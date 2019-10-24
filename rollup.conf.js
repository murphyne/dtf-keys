let bannerText = `
// ==UserScript==
// @name         DTF: Navigate with keys
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Navigate with keys!
// @author       mr-m
// @match        *://dtf.ru/*
// @grant        none
// ==/UserScript==
`;

module.exports = {
  input: 'src/src.js',
  output: {
    file: 'dist/dtf-keys.user.js',
    format: 'esm',
    banner: bannerText.trimStart(),
  },
};
