import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

import { generateFonts, OtherAssetType } from 'fantasticon';

import { ICONS_CONFIG } from '../icons.config.ts';

// Fantasticon's own default start codepoint.
const FIRST_CODEPOINT = 0xf101;

const { fontName, options, outputDir, svgDir, themes } = ICONS_CONFIG;

const readIconNames = async (theme: string) =>
  (await readdir(resolve(svgDir, theme)))
    .filter((file) => file.endsWith('.svg'))
    .map((file) => basename(file, '.svg'));

const iconNamesByTheme = new Map(
  await Promise.all(
    themes.map(async (theme) => [theme, await readIconNames(theme)] as const),
  ),
);
const allIconNames = [...new Set([...iconNamesByTheme.values()].flat())].sort();

// Every theme must draw every icon: `IconName` and codepoints are shared.
const missing = themes.flatMap((theme) =>
  allIconNames
    .filter((name) => !iconNamesByTheme.get(theme)?.includes(name))
    .map((name) => `  ${name}.svg missing from theme "${theme}"`),
);
if (missing.length > 0) {
  console.error(
    `Icon sets differ between themes; nothing was generated.\n${missing.join('\n')}`,
  );
  process.exit(1);
}

// Assigned here rather than by fantasticon, so a name has the same
// codepoint in every theme's font regardless of file order.
const codepoints = Object.fromEntries(
  allIconNames.map((name, index) => [name, FIRST_CODEPOINT + index]),
);

await rm(outputDir, { force: true, recursive: true });
await mkdir(outputDir, { recursive: true });

for (const [index, theme] of themes.entries()) {
  const isFirstTheme = index === 0;

  await generateFonts({
    ...options,
    assetTypes: isFirstTheme
      ? [OtherAssetType.TS, OtherAssetType.CSS]
      : [OtherAssetType.CSS],
    codepoints,
    inputDir: resolve(svgDir, theme),
    name: `${fontName}-${theme}`,
    outputDir,
    pathOptions: isFirstTheme
      ? { ts: resolve(outputDir, `${fontName}.ts`) }
      : {},
    selector: `[data-theme="${theme}"] .icon`,
  });
}

await writeFile(
  resolve(outputDir, `${fontName}.css`),
  themes.map((theme) => `@import './${fontName}-${theme}.css';\n`).join(''),
);

console.log(
  `Generated ${allIconNames.length} icons for themes: ${themes.join(', ')}`,
);
