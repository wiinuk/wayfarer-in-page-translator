// ==UserScript==
// @id           wayfarer-in-page-translator
// @name         Wayfarer in-page translator
// @category     Controls
// @namespace    https://github.com/wiinuk/wayfarer-in-page-translator
// @downloadURL  https://github.com/wiinuk/wayfarer-in-page-translator/raw/main/wayfarer-in-page-translator.user.js
// @updateURL    https://github.com/wiinuk/wayfarer-in-page-translator/raw/main/wayfarer-in-page-translator.user.js
// @homepageURL  https://github.com/wiinuk/wayfarer-in-page-translator
// @version      0.2.0
// @description  In-page translation Wayfarer plugin for Wayspot review.
// @author       Wiinuk
// @match        https://wayfarer.nianticlabs.com/*
// @icon         https://www.google.com/s2/favicons?domain=wayfarer.nianticlabs.com
// @grant        GM_info
// ==/UserScript==

import * as MainModule from "./wayfarer-in-page-translator";
MainModule.main();
