import { type Targets, transform } from 'lightningcss';
import postcss, {
  type AtRule,
  type ChildNode,
  type Root,
  type Rule,
} from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { type Plugin } from 'vite';

const THEME_ATTRIBUTE = 'data-theme';
const THEME_NAME_PATTERN = /^[\w-]+$/;
const GROUP_AT_RULES = new Set(['container', 'layer', 'media', 'supports']);
const TARGET_PATTERN = /^([a-z]+)(\d+)(?:\.(\d+))?$/;
const TARGET_BROWSERS: Record<string, keyof Targets> = {
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  ios: 'ios_saf',
  opera: 'opera',
  safari: 'safari',
};

// Mirrors how Vite converts `build.cssTarget` for its own lightningcss minify.
const toLightningTargets = (
  cssTarget: string | string[] | false,
): Targets | undefined => {
  if (!cssTarget) return undefined;

  const targets: Targets = {};
  for (const entry of [cssTarget].flat()) {
    if (entry === 'esnext') continue;

    const [, name = '', major = '', minor = '0'] =
      TARGET_PATTERN.exec(entry) ?? [];
    const browser = TARGET_BROWSERS[name];
    if (!browser) {
      throw new Error(
        `[theme-css-split] Unsupported build.cssTarget "${entry}"; use browser versions such as "chrome111".`,
      );
    }

    const version = (Number(major) << 16) | (Number(minor) << 8);
    const current = targets[browser];
    if (current === undefined || version < current) targets[browser] = version;
  }

  return Object.keys(targets).length > 0 ? targets : undefined;
};

// `theme: null` marks a selector shared by every theme.
interface ClassifiedSelector {
  selector: string;
  theme: string | null;
}

const isThemeAttribute = (node: selectorParser.Node) =>
  selectorParser.isAttribute(node) && node.attribute === THEME_ATTRIBUTE;

const isInsideKeyframes = (rule: Rule) =>
  rule.parent?.type === 'atrule' &&
  (rule.parent as AtRule).name.endsWith('keyframes');

const classifySelector = (
  selector: selectorParser.Selector,
): ClassifiedSelector => {
  const themeAttributes: selectorParser.Attribute[] = [];
  selector.walkAttributes((node) => {
    if (isThemeAttribute(node)) themeAttributes.push(node);
  });

  if (themeAttributes.length === 0) {
    return { selector: selector.toString().trim(), theme: null };
  }

  const combinatorIndex = selector.nodes.findIndex(
    (node) => node.type === 'combinator',
  );
  const leadingCompound =
    combinatorIndex === -1
      ? selector.nodes
      : selector.nodes.slice(0, combinatorIndex);
  const [attribute] = themeAttributes;

  if (
    themeAttributes.length > 1 ||
    !attribute ||
    !leadingCompound.includes(attribute) ||
    attribute.operator !== '=' ||
    !attribute.value
  ) {
    throw new Error(
      `[theme-css-split] Unsupported selector "${selector.toString().trim()}": ${THEME_ATTRIBUTE} must appear once, as [${THEME_ATTRIBUTE}="<theme>"], in the leading compound selector.`,
    );
  }

  const theme = attribute.value;
  if (!THEME_NAME_PATTERN.test(theme)) {
    throw new Error(
      `[theme-css-split] Theme name "${theme}" must match ${THEME_NAME_PATTERN} to be used as a file name.`,
    );
  }

  const isOnlyNodeInCompound = leadingCompound.length === 1;
  const next = attribute.next();
  attribute.remove();

  if (isOnlyNodeInCompound) {
    if (next?.type === 'combinator' && next.value.trim() === '') {
      // `[data-theme=x] .a` -> `.a`
      next.remove();
    } else {
      // `[data-theme=x]` -> `:root`, `[data-theme=x] > .a` -> `:root > .a`
      selector.prepend(selectorParser.pseudo({ value: ':root' }));
    }
  }

  return { selector: selector.toString().trim(), theme };
};

const classifyRules = (root: Root) => {
  const classified = new Map<Rule, ClassifiedSelector[]>();
  const themes = new Set<string>();

  root.walkRules((rule) => {
    if (isInsideKeyframes(rule)) return;

    const selectors: ClassifiedSelector[] = [];
    selectorParser((selectorRoot) => {
      selectorRoot.each((selector) => {
        const result = classifySelector(selector);
        if (result.theme) themes.add(result.theme);
        selectors.push(result);
      });
    }).processSync(rule.selector);

    classified.set(rule, selectors);
  });

  return { classified, themes };
};

const buildThemeNodes = (
  nodes: ChildNode[],
  theme: string,
  classified: Map<Rule, ClassifiedSelector[]>,
): ChildNode[] =>
  nodes.flatMap((node): ChildNode[] => {
    if (node.type === 'rule' && classified.has(node)) {
      const selectors = (classified.get(node) ?? [])
        .filter((item) => item.theme === null || item.theme === theme)
        .map((item) => item.selector);

      return selectors.length > 0 ? [node.clone({ selectors })] : [];
    }

    if (node.type === 'atrule' && GROUP_AT_RULES.has(node.name) && node.nodes) {
      const children = buildThemeNodes(node.nodes, theme, classified);
      if (children.length === 0) return [];

      const wrapper = node.clone({ nodes: [] });
      wrapper.append(children);
      return [wrapper];
    }

    return [node.clone()];
  });

const assertUniqueKeyframes = (root: Root, theme: string) => {
  const seen = new Set<string>();

  root.walkAtRules(/keyframes$/, (atRule) => {
    const key = `@${atRule.name} ${atRule.params}`;
    if (seen.has(key)) {
      throw new Error(
        `[theme-css-split] Duplicate "${key}" in theme "${theme}". Give theme-specific keyframes distinct names.`,
      );
    }
    seen.add(key);
  });
};

/**
 * Replaces the bundled CSS with one stylesheet per `data-theme` value,
 * emitted as `themes/<theme>.css` with the theme attribute stripped from
 * selectors. CSS not scoped to a theme is copied into every theme file.
 *
 * Vite's own CSS minification is turned off: it runs before
 * `generateBundle` and silently drops all but the last same-named
 * `@keyframes`, hiding collisions between themes. Each theme file is
 * minified here instead, after validation.
 */
export const themeCssSplit = (): Plugin => {
  let shouldMinify = true;
  let targets: Targets | undefined;

  return {
    config(userConfig) {
      shouldMinify =
        (userConfig.build?.cssMinify ?? userConfig.build?.minify) !== false;
      return { build: { cssMinify: false } };
    },
    configResolved(config) {
      targets = toLightningTargets(config.build.cssTarget);
    },
    generateBundle: {
      handler(_options, bundle) {
        const root = postcss.root();

        for (const [fileName, output] of Object.entries(bundle)) {
          if (output.type !== 'asset' || !fileName.endsWith('.css')) continue;

          const source =
            typeof output.source === 'string'
              ? output.source
              : new TextDecoder().decode(output.source);
          root.append(postcss.parse(source, { from: fileName }).nodes);
          delete bundle[fileName];
        }

        try {
          const { classified, themes } = classifyRules(root);

          if (themes.size === 0) {
            throw new Error(
              `[theme-css-split] No [${THEME_ATTRIBUTE}] selector found in the bundled CSS; nothing to split.`,
            );
          }

          for (const theme of [...themes].sort()) {
            const fileName = `themes/${theme}.css`;
            const themeRoot = postcss.root();
            themeRoot.append(buildThemeNodes(root.nodes, theme, classified));
            assertUniqueKeyframes(themeRoot, theme);

            const css = themeRoot.toString();
            this.emitFile({
              fileName,
              source: shouldMinify
                ? `${new TextDecoder().decode(
                    transform({
                      code: new TextEncoder().encode(css),
                      filename: fileName,
                      minify: true,
                      targets,
                    }).code,
                  )}\n`
                : css,
              type: 'asset',
            });
          }
        } catch (error) {
          this.error(error instanceof Error ? error.message : String(error));
        }
      },
      // Vite emits the bundled CSS asset in its own `generateBundle`.
      order: 'post',
    },
    name: 'theme-css-split',
  };
};
