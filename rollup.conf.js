import virtual from '@rollup/plugin-virtual';

let bannerText = `
// ==UserScript==
// @name         DTF: Navigate with keys
// @version      0.5.0
// @description  Navigate with keys!
// @author       murphyne
// @namespace    https://github.com/murphyne
// @match        *://dtf.ru/*
// @updateUrl    https://github.com/murphyne/dtf-keys/releases/latest/download/dtf-keys.meta.js
// @downloadUrl  https://github.com/murphyne/dtf-keys/releases/latest/download/dtf-keys.user.js
// @grant        GM.openInTab
// ==/UserScript==
`;

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/dtf-keys.user.js',
      format: 'esm',
      banner: bannerText.trimStart(),
    },
  },
  {
    input: 'entry',
    plugins: [
      virtual({ entry: '' }),
    ],
    output: {
      file: 'dist/dtf-keys.meta.js',
      format: 'esm',
      banner: bannerText.trim(),
    },
  },
];
