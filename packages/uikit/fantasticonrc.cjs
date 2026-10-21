module.exports = {
  assetTypes: ['ts', 'css'],
  fontTypes: ['woff', 'woff2'],
  formatOptions: {
    ts: {
      constantName: 'ICON_CODEPOINTS',
      literalIdName: 'IconName',
      singleQuotes: true,
      types: ['literalId', 'constant'],
    },
  },
  inputDir: './src/components/Icon/svg',
  name: 'rockethash',
  normalize: true,
  outputDir: './src/components/Icon/__generated__',
  tag: '',
  templates: {
    css: './src/components/Icon/Icon.hbs',
  },
};
