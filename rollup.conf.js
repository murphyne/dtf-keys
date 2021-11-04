let bannerText = `
// ==UserScript==
// @name         DTF: Navigate with keys
// @version      0.4.3
// @description  Navigate with keys!
// @author       murphyne
// @namespace    https://github.com/murphyne
// @match        *://dtf.ru/*
// @grant        GM.openInTab
// ==/UserScript==
`;

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/dtf-keys.user.js',
    format: 'esm',
    banner: bannerText.trimStart(),
  },
};
