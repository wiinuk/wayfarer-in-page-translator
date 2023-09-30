// ==UserScript==
// @id           wayfarer-in-page-translator
// @name         Wayfarer in-page translator
// @category     Controls
// @namespace    https://github.com/wiinuk/wayfarer-in-page-translator
// @downloadURL  https://github.com/wiinuk/wayfarer-in-page-translator/raw/main/wayfarer-in-page-translator.user.js
// @updateURL    https://github.com/wiinuk/wayfarer-in-page-translator/raw/main/wayfarer-in-page-translator.user.js
// @homepageURL  https://github.com/wiinuk/wayfarer-in-page-translator
// @version      0.1.2
// @description  In-page translation Wayfarer plugin for Wayspot review.
// @author       Wiinuk
// @match        https://wayfarer.nianticlabs.com/*
// @icon         https://www.google.com/s2/favicons?domain=wayfarer.nianticlabs.com
// @grant        GM_info
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./source/document-jsx/jsx-runtime.ts
function jsxs(name, properties, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_option) {
    const element = document.createElement(name);
    for (const [key, value] of Object.entries(properties !== null && properties !== void 0 ? properties : {})) {
        if (key === "children")
            continue;
        if (key === "style" && typeof value === "function") {
            value(element.style);
            continue;
        }
        element.setAttribute(key, String(value));
    }
    const children = properties === null || properties === void 0 ? void 0 : properties.children;
    if (children) {
        if (Array.isArray(children)) {
            for (const child of children) {
                if (!child)
                    continue;
                element.append(child);
            }
        }
        else {
            element.append(children);
        }
    }
    return element;
}
const jsx = jsxs;

;// CONCATENATED MODULE: ./package.json
const package_namespaceObject = {};
;// CONCATENATED MODULE: ./source/standard-extensions.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function standard_extensions_error(template, ...substitutions) {
    const message = String.raw(template, ...substitutions.map((x) => typeof x === "string" ? x : JSON.stringify(x)));
    throw new Error(message);
}
function exhaustive(value) {
    return standard_extensions_error `unexpected value: ${value}`;
}
function id(x) {
    return x;
}
function ignore(..._args) {
    /* 引数を無視する関数 */
}
let ignoreReporterCache;
function createProgressReporter(progress, total) {
    class MessagedProgressEvent extends ProgressEvent {
        constructor(message, options) {
            super("message", options);
            this.message = message;
        }
    }
    if (progress === undefined) {
        return (ignoreReporterCache !== null && ignoreReporterCache !== void 0 ? ignoreReporterCache : (ignoreReporterCache = {
            next: ignore,
            done: ignore,
        }));
    }
    let loaded = 0;
    return {
        next(message) {
            loaded = Math.max(loaded + 1, total);
            progress(new MessagedProgressEvent(message, {
                lengthComputable: true,
                loaded,
                total,
            }));
        },
        done(message) {
            progress(new MessagedProgressEvent(message, {
                lengthComputable: true,
                loaded: total,
                total,
            }));
        },
    };
}
class AbortError extends Error {
    constructor(message) {
        super(message);
        this.name = "AbortError";
    }
}
function newAbortError(message = "The operation was aborted.") {
    if (typeof DOMException === "function") {
        return new DOMException(message, "AbortError");
    }
    else {
        return new AbortError(message);
    }
}
function throwIfAborted(signal) {
    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        throw newAbortError();
    }
}
function sleep(milliseconds, option) {
    return new Promise((resolve, reject) => {
        const signal = option === null || option === void 0 ? void 0 : option.signal;
        if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
            reject(newAbortError());
            return;
        }
        const onAbort = signal
            ? () => {
                clearTimeout(id);
                reject(newAbortError());
            }
            : ignore;
        const id = setTimeout(() => {
            signal === null || signal === void 0 ? void 0 : signal.removeEventListener("abort", onAbort);
            resolve();
        }, milliseconds);
        signal === null || signal === void 0 ? void 0 : signal.addEventListener("abort", onAbort);
    });
}
function microYield() {
    return Promise.resolve();
}
function cancelToReject(promise, onCancel = ignore) {
    return promise.catch((e) => {
        if (e instanceof Error && e.name === "AbortError") {
            return onCancel();
        }
        throw e;
    });
}
function createAsyncCancelScope(handleAsyncError) {
    let lastCancel = new AbortController();
    return (process) => {
        // 前の操作をキャンセル
        lastCancel.abort();
        lastCancel = new AbortController();
        handleAsyncError(
        // キャンセル例外を無視する
        cancelToReject(process(lastCancel.signal)));
    };
}
function assertTrue() {
    // 型レベルアサーション関数
}
function waitBy(predicate, option) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const interval = (_a = option === null || option === void 0 ? void 0 : option.intervalMilliseconds) !== null && _a !== void 0 ? _a : 500;
        for (;;) {
            const result = predicate();
            if (result)
                return result;
            yield sleep(interval, option);
        }
    });
}

;// CONCATENATED MODULE: ./source/document-extensions.ts
var document_extensions_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function waitElementLoaded() {
    if (document.readyState !== "loading") {
        return Promise.resolve();
    }
    return new Promise((resolve) => document.addEventListener("DOMContentLoaded", () => resolve()));
}
function waitElementLoadedBy(selectors, options) {
    return document_extensions_awaiter(this, void 0, void 0, function* () {
        return waitBy(() => document.querySelector(selectors), options);
    });
}
let styleElement = null;
function addStyle(cssOrTemplate, ...substitutions) {
    const css = typeof cssOrTemplate === "string"
        ? cssOrTemplate
        : String.raw(cssOrTemplate, ...substitutions);
    if (styleElement == null) {
        styleElement = document.createElement("style");
        document.head.appendChild(styleElement);
    }
    styleElement.textContent += css + "\n";
    document.head.appendChild(styleElement);
}
function addScript(url) {
    return new Promise((onSuccess, onError) => {
        const script = document.createElement("script");
        script.onload = onSuccess;
        script.onerror = onError;
        document.head.appendChild(script);
        script.src = url;
    });
}
function loadPackageScript(name, path) {
    return document_extensions_awaiter(this, void 0, void 0, function* () {
        function getVersion(dependency) {
            var _a, _b;
            if (dependency === "" || dependency === "*") {
                return "latest";
            }
            for (const range of dependency.split("||")) {
                // `2.2 - 3.5` = `>=2.2 <=3.5`
                const version2 = (_a = /^([^\s]+)\s+-\s+([^\s]+)$/.exec(range)) === null || _a === void 0 ? void 0 : _a[1];
                if (version2 != null) {
                    return version2;
                }
                const singleVersion = (_b = /^\s*((~|^|>=|<=)?[^\s]+)\s*$/.exec(dependency)) === null || _b === void 0 ? void 0 : _b[0];
                // `5.x`, `^5.2`, `~5.2`, `<=5.2`, `>5.2` などは cdn で処理されるので変換不要
                if (singleVersion != null) {
                    return singleVersion;
                }
                // `>=2.2 <=3.5` など複雑な指定子は非対応
                return error `非対応のバージョン指定子 ( ${dependency} ) です。`;
            }
            return error `ここには来ない`;
        }
        function getPackageBaseUrl(name, dependency) {
            // url
            if (/^(https?:\/\/|file:)/.test(dependency)) {
                return dependency;
            }
            // ローカルパス
            if (/^(\.\.\/|~\/|\.\/|\/)/.test(dependency)) {
                return `file:${dependency}`;
            }
            // git
            if (/^git(\+(ssh|https))?:\/\//.test(dependency)) {
                return error `git URL 依存関係は対応していません。`;
            }
            // github
            if (/^[^\\]+\/.+$/.test(dependency)) {
                return error `github URL 依存関係は対応していません。`;
            }
            // 普通のバージョン指定
            const version = getVersion(dependency);
            return `https://cdn.jsdelivr.net/npm/${name}@${version}`;
        }
        const dependency = packageJson.dependencies[name];
        const baseUrl = getPackageBaseUrl(name, dependency);
        const url = `${baseUrl}/${path}`;
        yield addScript(url);
        console.debug(`${url} からスクリプトを読み込みました`);
        return;
    });
}
let parseCssColorTemp = null;
let parseCssColorRegex = null;
function parseCssColor(cssColor, result = { r: 0, g: 0, b: 0, a: 0 }) {
    const d = (parseCssColorTemp !== null && parseCssColorTemp !== void 0 ? parseCssColorTemp : (parseCssColorTemp = document.createElement("div")));
    d.style.color = cssColor;
    const m = d.style
        .getPropertyValue("color")
        .match((parseCssColorRegex !== null && parseCssColorRegex !== void 0 ? parseCssColorRegex : (parseCssColorRegex = /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/i)));
    if (!m) {
        return error `color "${cssColor}" is could not be parsed.`;
    }
    const [, r, g, b, a] = m;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result.r = parseInt(r);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result.g = parseInt(g);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result.b = parseInt(b);
    result.a = a === undefined ? 1 : parseFloat(a);
    return result;
}
function fetchJsonp(input, options) {
    return new Promise((resolve, reject) => {
        var _a, _b, _c;
        const global = (_a = options === null || options === void 0 ? void 0 : options.global) !== null && _a !== void 0 ? _a : globalThis;
        const parameters = (_b = options === null || options === void 0 ? void 0 : options.parameters) !== null && _b !== void 0 ? _b : {};
        const callbackParameterName = (_c = options === null || options === void 0 ? void 0 : options.callbackParameterName) !== null && _c !== void 0 ? _c : "callback";
        const callbackName = `jsonp_callback_${Date.now()}_${global.Math.round(100000 * global.Math.random())}`;
        const source = new global.URL(input);
        for (const [key, value] of global.Object.entries(parameters)) {
            source.searchParams.append(key, value);
        }
        source.searchParams.append(callbackParameterName, callbackName);
        const script = global.document.createElement("script");
        script.type = "text/javascript";
        script.src = source.toString();
        const globalStore = global;
        globalStore[callbackName] = function (data) {
            delete globalStore[callbackName];
            global.document.body.removeChild(script);
            resolve(data);
        };
        script.onerror = function () {
            delete globalStore[callbackName];
            global.document.body.removeChild(script);
            reject(new global.Error("JSONP request failed"));
        };
        global.document.body.appendChild(script);
    });
}

;// CONCATENATED MODULE: ../gas-drivetunnel/source/json-schema-core.ts
const pathCaches = [];
const seenCaches = [];
// eslint-disable-next-line @typescript-eslint/ban-types
class Schema {
    constructor(_validate, _isOptional = false) {
        this._validate = _validate;
        this._isOptional = _isOptional;
    }
    parse(target) {
        var _a, _b;
        const currentPath = (_a = pathCaches.pop()) !== null && _a !== void 0 ? _a : [];
        const seen = (_b = seenCaches.pop()) !== null && _b !== void 0 ? _b : {
            // TODO: ES5 または Rhino ランタイムは WeakMap が存在しない V8 はエラーが発生するので polyfill を使う
            add() {
                /* fake */
            },
            has() {
                return false;
            },
        };
        try {
            return this._validate(target, currentPath, seen);
        }
        finally {
            currentPath.length = 0;
            pathCaches.push(currentPath);
            seenCaches.push(seen);
        }
    }
    optional() {
        return optional(this);
    }
}
function wrap(validate) {
    return new Schema(validate);
}
class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
    get name() {
        return "ValidationError";
    }
}
function validationError(path, expected, actual) {
    return new ValidationError(JSON.stringify({
        path,
        expected,
        actual,
    }));
}
function strictObject(shape) {
    const props = [];
    for (const key in shape) {
        props.push([key, shape[key]]);
    }
    return wrap((target, path, seen) => {
        if (target === null || typeof target !== "object") {
            throw validationError(path, "object", typeof target);
        }
        if (seen.has(target)) {
            return target;
        }
        seen.add(target);
        for (const [key, valueSchema] of props) {
            if (!(key in target)) {
                if (valueSchema._isOptional) {
                    continue;
                }
                throw validationError(path, `{ '${key}': any }`, "object");
            }
            const value = target[key];
            try {
                path.push(key);
                valueSchema._validate(value, path, seen);
            }
            finally {
                path.pop();
            }
        }
        return target;
    });
}
function literal(value) {
    const json = String(literal);
    return wrap((target, path) => {
        if (target !== value) {
            throw validationError(path, json, typeof value === "object" ? "object" : String(target));
        }
        return target;
    });
}
let stringSchema;
function string() {
    return (stringSchema !== null && stringSchema !== void 0 ? stringSchema : (stringSchema = wrap((target, path) => {
        if (typeof target !== "string") {
            throw validationError(path, "string", typeof target);
        }
        return target;
    })));
}
function tuple(schemas) {
    const anyTupleName = `[${schemas.map(() => "any").join(", ")}]`;
    return wrap((target, path, seen) => {
        if (!Array.isArray(target)) {
            throw validationError(path, "any[]", typeof target);
        }
        if (seen.has(target)) {
            return target;
        }
        seen.add(target);
        if (target.length < schemas.length) {
            const actualTypeName = 5 < target.length
                ? "any[]"
                : `[${target.map(() => "any").join(", ")}]`;
            throw validationError(path, anyTupleName, actualTypeName);
        }
        for (let i = 0; i < schemas.length; i++) {
            const elementSchema = schemas[i];
            const element = target[i];
            path.push(i);
            try {
                elementSchema._validate(element, path, seen);
            }
            finally {
                path.pop();
            }
        }
        return target;
    });
}
function array(elementSchema) {
    return wrap((target, path, seen) => {
        if (!Array.isArray(target)) {
            throw validationError(path, "any[]", typeof target);
        }
        if (seen.has(target)) {
            return target;
        }
        seen.add(target);
        for (let i = 0; i < target.length; i++) {
            const element = target[i];
            try {
                path.push(i);
                elementSchema._validate(element, path, seen);
            }
            finally {
                path.pop();
            }
        }
        return target;
    });
}
const errorsCaches = [];
function union(schemas) {
    return wrap((target, path, seen) => {
        var _a;
        const errors = (_a = errorsCaches.pop()) !== null && _a !== void 0 ? _a : [];
        try {
            for (const schema of schemas) {
                try {
                    schema._validate(target, path, seen);
                    return target;
                }
                catch (e) {
                    if (e instanceof ValidationError) {
                        errors.push(e.message);
                    }
                }
            }
            throw new ValidationError(JSON.stringify({
                path,
                errors: errors.map((message) => JSON.parse(message)),
            }));
        }
        finally {
            errors.length = 0;
            errorsCaches.push(errors);
        }
    });
}
let nullSchemaCache;
function null_() {
    return (nullSchemaCache !== null && nullSchemaCache !== void 0 ? nullSchemaCache : (nullSchemaCache = wrap((target, path) => {
        if (target === null) {
            return target;
        }
        throw validationError(path, "null", typeof target);
    })));
}

let neverSchemaCache;
function never() {
    return (neverSchemaCache !== null && neverSchemaCache !== void 0 ? neverSchemaCache : (neverSchemaCache = wrap((target, path) => {
        throw validationError(path, "never", typeof target);
    })));
}
let anySchemaCache;
function any() {
    return (anySchemaCache !== null && anySchemaCache !== void 0 ? anySchemaCache : (anySchemaCache = wrap((target) => {
        return target;
    })));
}
function optional(schema) {
    return new Schema(schema._validate, true);
}

;// CONCATENATED MODULE: ./source/styles.module.css
const cssText = ".translated-text-58873c60e0a82af9a88b921e5546810b3b2bf2a1 {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n\r\n  background-color: rgba(0, 0, 0, 0.5);\r\n  backdrop-filter: blur(2px);\r\n  color: white;\r\n\r\n  font-size: 12px;\r\n  padding: 5px;\r\n}\r\n:has(> .translated-text-58873c60e0a82af9a88b921e5546810b3b2bf2a1) {\r\n    position: relative;\r\n}\r\n\r\n.spinner-93b25c750ac7b5afa8e21d77e65dc41870c4943c:before {\r\n    content: \"\";\r\n    box-sizing: border-box;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    height: 32px;\r\n    width: 32px;\r\n    border-radius: 50%;\r\n    border: 3px solid #ccc;\r\n    border-top-color: #DF471C;\r\n    animation: spinner 4s linear infinite;\r\n}\r\n\r\n@keyframes spinner {\r\n    to {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n.spinner-93b25c750ac7b5afa8e21d77e65dc41870c4943c * {\r\n    display: none;\r\n}\r\n";
/* harmony default export */ const styles_module = ({
    "translated-text": "translated-text-58873c60e0a82af9a88b921e5546810b3b2bf2a1",
    spinner: "spinner-93b25c750ac7b5afa8e21d77e65dc41870c4943c",
});

;// CONCATENATED MODULE: ./source/switch.module.css
const switch_module_cssText = "\r\n.switch-391e9ebb960dc71098af60238b63973f28b00eb4 {\r\n    --slider-size: 13px;\r\n    --slider-position: 2px;\r\n    --switch-width: 30px;\r\n    --switch-height: 17px;\r\n\r\n    --transition: 0.4s;\r\n\r\n    --color-on: #DF471C;\r\n    --color-off: #ccc;\r\n    --color-slider: white;\r\n}\r\n\r\n.switch-391e9ebb960dc71098af60238b63973f28b00eb4 {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: var(--switch-width);\r\n    height: var(--switch-height);\r\n}\r\n\r\n.switch-391e9ebb960dc71098af60238b63973f28b00eb4 input {\r\n    opacity: 0;\r\n    width: 0;\r\n    height: 0;\r\n}\r\n\r\n.slider-e1e00dccad352d901be20bb96aa075b000da098f {\r\n    position: absolute;\r\n    cursor: pointer;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    background-color: var(--color-off);\r\n    -webkit-transition: var(--transition);\r\n    transition: var(--transition);\r\n}\r\n\r\n.slider-e1e00dccad352d901be20bb96aa075b000da098f:before {\r\n    position: absolute;\r\n    content: \"\";\r\n    height: var(--slider-size);\r\n    width: var(--slider-size);\r\n    left: var(--slider-position);\r\n    bottom: var(--slider-position);\r\n    background-color: var(--color-slider);\r\n    -webkit-transition: var(--transition);\r\n    transition: var(--transition);\r\n}\r\n\r\ninput:checked+.slider-e1e00dccad352d901be20bb96aa075b000da098f {\r\n    background-color: var(--color-on);\r\n}\r\n\r\ninput:focus+.slider-e1e00dccad352d901be20bb96aa075b000da098f {\r\n    box-shadow: 0 0 1px var(--color-on);\r\n}\r\n\r\ninput:checked+.slider-e1e00dccad352d901be20bb96aa075b000da098f:before {\r\n    -webkit-transform: translateX(var(--slider-size));\r\n    -ms-transform: translateX(var(--slider-size));\r\n    transform: translateX(var(--slider-size));\r\n}\r\n\r\n.slider-e1e00dccad352d901be20bb96aa075b000da098f.round-f42f836472fa734544d645a4cb440ca4e1ea5327 {\r\n    border-radius: var(--switch-height);\r\n}\r\n\r\n.slider-e1e00dccad352d901be20bb96aa075b000da098f.round-f42f836472fa734544d645a4cb440ca4e1ea5327:before {\r\n    border-radius: 50%;\r\n}\r\n\r\n.label-dfe5b857a03aefd661ffef336fbda2ed9bde8623 {\r\n    text-align: center;\r\n}\r\n.container-3b8aa6d246c5d6f0df26cb76fe024603e945743e {\r\n    padding: 0.5em;\r\n}\r\n";
/* harmony default export */ const switch_module = ({
    switch: "switch-391e9ebb960dc71098af60238b63973f28b00eb4",
    slider: "slider-e1e00dccad352d901be20bb96aa075b000da098f",
    round: "round-f42f836472fa734544d645a4cb440ca4e1ea5327",
    label: "label-dfe5b857a03aefd661ffef336fbda2ed9bde8623",
    container: "container-3b8aa6d246c5d6f0df26cb76fe024603e945743e",
});

;// CONCATENATED MODULE: ./source/wayfarer-in-page-translator.tsx
var wayfarer_in_page_translator_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const pluginName = "wayfarer-in-page-translator";
function handleAsyncError(promise) {
    promise.catch((error) => {
        console.error(error);
        if (error != null &&
            typeof error === "object" &&
            "stack" in error &&
            typeof error.stack === "string") {
            console.error(error.stack);
        }
    });
}
function main() {
    handleAsyncError(asyncMain());
}
function resultSpec(resultSpec) {
    return union([
        strictObject({
            type: literal("success"),
            result: resultSpec,
        }),
        strictObject({
            type: literal("failure"),
            error: any(),
        }),
    ]);
}
const translateResultSpec = resultSpec(string());
function detectUserLanguage() {
    var _a;
    let [language = navigator.language] = navigator.languages;
    language = language.toLowerCase();
    if (language.startsWith("zh"))
        return language;
    return (_a = language.split("-")[0]) !== null && _a !== void 0 ? _a : language;
}
let kanaPattern, hanPattern;
function detectSourceLanguageSimple(text) {
    if (text.length === 0)
        return null;
    kanaPattern !== null && kanaPattern !== void 0 ? kanaPattern : (kanaPattern = /^[\p{scx=Hiragana}\p{scx=Katakana}]$/u);
    hanPattern !== null && hanPattern !== void 0 ? hanPattern : (hanPattern = /^\p{scx=Han}$/u);
    let characterCount = 0;
    let kanaCharacterCount = 0;
    let hanCharacterCount = 0;
    for (const surrogatePair of text) {
        characterCount++;
        if (kanaPattern.test(surrogatePair)) {
            kanaCharacterCount++;
        }
        if (hanPattern.test(surrogatePair)) {
            hanCharacterCount++;
        }
    }
    // 漢字やカナが50%以上でカナが少しでも含まれているなら ja
    if (0.5 <= (kanaCharacterCount + hanCharacterCount) / characterCount &&
        0.01 <= kanaCharacterCount) {
        console.debug(`日本語判定: ${text}`);
        return "ja";
    }
    return null;
}
function translate(text, options) {
    var _a, _b, _c;
    return wayfarer_in_page_translator_awaiter(this, void 0, void 0, function* () {
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        const source = (_b = (_a = options === null || options === void 0 ? void 0 : options.source) !== null && _a !== void 0 ? _a : detectSourceLanguageSimple(text)) !== null && _b !== void 0 ? _b : "";
        const target = (_c = options === null || options === void 0 ? void 0 : options.target) !== null && _c !== void 0 ? _c : detectUserLanguage();
        if (source === target)
            return text;
        throwIfAborted(signal);
        const response = yield fetchJsonp("https://script.google.com/macros/s/AKfycbxlj9ulvLTmopmzz7Wv3ms5Wz5jy3tVtF5IXQbHdCHNFcfxiWRzc7vxVVTFeoAzZdo/exec", {
            callbackParameterName: "jsonp-callback",
            parameters: {
                text,
                source,
                target,
            },
            global: unsafeWindow,
        });
        throwIfAborted(signal);
        const json = translateResultSpec.parse(response);
        if (json.type === "success") {
            if (json.result === text) {
                console.debug(`${pluginName}: 無駄な翻訳リクエスト?, ${json.result}`);
            }
            return json.result;
        }
        throw json.error;
    });
}
function injectGetReviewListener(onGetReview) {
    const open0 = XMLHttpRequest.prototype.open;
    function open1(...args) {
        const [method, url] = args;
        if (url == "/api/v1/vault/review" && method == "GET") {
            this.addEventListener("load", onGetReview, false);
        }
        open0.apply(this, args);
    }
    XMLHttpRequest.prototype.open = open1;
}
class Disposable {
    constructor(_dispose) {
        this._dispose = _dispose;
    }
    static create(dispose) {
        return new Disposable(dispose);
    }
    dispose() {
        this._dispose();
    }
    append(...disposables) {
        return new Disposable(() => {
            this.dispose();
            for (const d of disposables) {
                d.dispose();
            }
        });
    }
}
Disposable.empty = new Disposable(ignore);
function addTranslatorElement(element, { signal }) {
    var _a;
    return wayfarer_in_page_translator_awaiter(this, void 0, void 0, function* () {
        const text = (_a = element.textContent) !== null && _a !== void 0 ? _a : "";
        const spinnerElement = (jsx("div", { class: styles_module.spinner, children: jsx("span", { children: "...\u8AAD\u307F\u8FBC\u307F\u4E2D" }) }));
        const translatedElement = (jsx("span", { class: styles_module["translated-text"], children: spinnerElement }));
        const translationElement = (jsxs("div", { children: [jsx("style", { children: cssText }), text, translatedElement] }));
        element.attachShadow({ mode: "open" }).appendChild(translationElement);
        const translatedText = yield translate(text, {
            signal,
        });
        const translatedDisplayText = (translatedElement.innerText =
            text === translatedText ? "" : translatedText);
        if (translatedDisplayText === "") {
            translatedElement.remove();
        }
        return Disposable.create(() => translationElement.remove());
    });
}
const settingsKey = "wayfarer-in-page-translator-026fd711-881a-4482-a645-3f760b874b03";
const settingsV1 = strictObject({
    enabled: union([literal(true), literal(false)]).optional(),
});
const defaultSettings = {
    enabled: true,
};
function getSettings() {
    var _a;
    const settings = settingsV1.parse(JSON.parse((_a = localStorage.getItem(settingsKey)) !== null && _a !== void 0 ? _a : JSON.stringify(defaultSettings)));
    return Object.freeze(settings);
}
function saveSettings(settings) {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    console.debug(`${pluginName}: 保存しました。`, settings);
}
function modifySettings(mapping) {
    saveSettings(mapping(getSettings()));
}
function addSwitchElement(options) {
    var _a;
    return wayfarer_in_page_translator_awaiter(this, void 0, void 0, function* () {
        const parent = yield waitElementLoadedBy("wf-header > :nth-child(1) > :nth-child(1)", options);
        const inputCheckbox = (jsx("input", { type: "checkbox" }));
        inputCheckbox.checked = (_a = getSettings().enabled) !== null && _a !== void 0 ? _a : false;
        inputCheckbox.addEventListener("change", function () {
            modifySettings((s) => (Object.assign(Object.assign({}, s), { enabled: this.checked })));
        });
        const switchElement = (jsxs("div", { class: switch_module.container, children: [jsx("div", { class: switch_module.label, children: "\u7FFB\u8A33" }), jsxs("label", { class: switch_module.switch, children: [jsx("style", { children: switch_module_cssText }), inputCheckbox, jsx("span", { class: switch_module.slider + " " + switch_module.round })] })] }));
        const root = jsx("div", {});
        parent.append(root);
        root.attachShadow({ mode: "open" }).appendChild(switchElement);
        return Disposable.create(() => root.remove());
    });
}
let reviewElementCleaner = Disposable.empty;
function onGetReview({ signal }) {
    return wayfarer_in_page_translator_awaiter(this, void 0, void 0, function* () {
        reviewElementCleaner.dispose();
        reviewElementCleaner = Disposable.empty;
        signal.addEventListener("abort", () => {
            console.debug(`${pluginName}: キャンセル`);
            reviewElementCleaner.dispose();
            reviewElementCleaner = Disposable.empty;
        });
        reviewElementCleaner = reviewElementCleaner.append(yield addSwitchElement());
        yield waitBy(() => getSettings().enabled, { signal });
        const titleElement = yield waitElementLoadedBy("#title-description-card > .wf-review-card__body > div > a > div", { signal });
        const descriptionElement = yield waitElementLoadedBy("#title-description-card > .wf-review-card__body > div > div", { signal });
        const supplementaryElement = yield waitElementLoadedBy("app-supporting-info wf-review-card > .wf-review-card__body > :nth-child(1) > :nth-child(2)", { signal });
        reviewElementCleaner = reviewElementCleaner.append(yield addTranslatorElement(titleElement, { signal }));
        reviewElementCleaner = reviewElementCleaner.append(yield addTranslatorElement(descriptionElement, { signal }));
        reviewElementCleaner = reviewElementCleaner.append(yield addTranslatorElement(supplementaryElement, { signal }));
    });
}
function asyncMain() {
    return wayfarer_in_page_translator_awaiter(this, void 0, void 0, function* () {
        yield waitElementLoaded();
        addStyle(cssText);
        const scope = createAsyncCancelScope(handleAsyncError);
        injectGetReviewListener(() => scope((signal) => onGetReview({ signal })));
    });
}

;// CONCATENATED MODULE: ./source/wayfarer-in-page-translator.user.ts
main();

/******/ })()
;
//# sourceMappingURL=wayfarer-in-page-translator.user.js.map