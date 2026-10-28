import { resolve } from 'node:path';

import { FontAssetType, type RunnerOptions } from 'fantasticon';

const ICON_DIR = resolve(import.meta.dirname, 'src/components/Icon');

interface IconsConfig {
  // Each theme's font is named `<fontName>-<theme>`; `themeCssSplit` routes
  // `@font-face` rules to their theme by that suffix.
  fontName: string;
  // Options shared by every theme's font; per-theme options are set by
  // `scripts/genIcons.ts`.
  options: Omit<
    RunnerOptions,
    | 'assetTypes'
    | 'codepoints'
    | 'inputDir'
    | 'name'
    | 'outputDir'
    | 'pathOptions'
    | 'selector'
  >;
  outputDir: string;
  // Holds one `<theme>/` folder of SVGs per theme, all with the same names.
  svgDir: string;
  // `data-theme` values; the first theme's run also emits the shared TS file.
  themes: string[];
}

const ICONS_CONFIG: IconsConfig = {
  fontName: 'rockethash',
  options: {
    fontTypes: [FontAssetType.WOFF, FontAssetType.WOFF2],
    formatOptions: {
      ts: {
        constantName: 'ICON_CODEPOINTS',
        literalIdName: 'IconName',
        singleQuotes: true,
        types: ['literalId', 'constant'],
      },
    },
    normalize: true,
    tag: '',
    templates: {
      css: resolve(ICON_DIR, 'Icon.hbs'),
    },
  },
  outputDir: resolve(ICON_DIR, '__generated__'),
  svgDir: resolve(ICON_DIR, 'svg'),
  themes: ['duckdice', 'tower'],
};

export { ICONS_CONFIG };
