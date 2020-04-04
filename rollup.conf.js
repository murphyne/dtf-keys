let bannerText = `
// ==UserScript==
// @name         DTF: Navigate with keys
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Navigate with keys!
// @author       mr-m
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
