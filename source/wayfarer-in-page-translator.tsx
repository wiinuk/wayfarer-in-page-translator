import {
    addStyle,
    fetchJsonp,
    waitElementLoaded,
    waitElementLoadedBy,
} from "./document-extensions";
import { z } from "../../gas-drivetunnel/source/json-schema";
import classNames, { cssText } from "./styles.module.css";
import switchClassNames, {
    cssText as switchCssText,
} from "./switch.module.css";

import {
    createAsyncCancelScope,
    throwIfAborted,
    type AsyncOptions,
    ignore,
    waitBy,
} from "./standard-extensions";

const pluginName = "wayfarer-in-page-translator";

function handleAsyncError(promise: Promise<void>) {
    promise.catch((error: unknown) => {
        console.error(error);
        if (
            error != null &&
            typeof error === "object" &&
            "stack" in error &&
            typeof error.stack === "string"
        ) {
            console.error(error.stack);
        }
    });
}

export function main() {
    handleAsyncError(asyncMain());
}

function resultSpec<T>(resultSpec: z.Schema<T>) {
    return z.union([
        z.strictObject({
            type: z.literal("success"),
            result: resultSpec,
        }),
        z.strictObject({
            type: z.literal("failure"),
            error: z.any(),
        }),
    ]);
}
const translateResultSpec = resultSpec(z.string());

function detectUserLanguage(): Iso639LanguageCode {
    let [language = navigator.language] = navigator.languages;
    language = language.toLowerCase();
    if (language.startsWith("zh")) return language;
    return language.split("-")[0] ?? language;
}

let kanaPattern, hanPattern;
function detectSourceLanguageSimple(text: string) {
    if (text.length === 0) return null;

    kanaPattern ??= /^[\p{scx=Hiragana}\p{scx=Katakana}]$/u;
    hanPattern ??= /^\p{scx=Han}$/u;

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
    if (
        0.5 <= (kanaCharacterCount + hanCharacterCount) / characterCount &&
        0.01 <= kanaCharacterCount
    ) {
        console.debug(`日本語判定: ${text}`);
        return "ja";
    }

    return null;
}

type Iso639LanguageCode = string;
interface TranslateOptions extends AsyncOptions {
    /** undefined なら text から推定する */
    source?: Iso639LanguageCode;
    /** undefined ならブラウザから対象言語を推定する */
    target?: Iso639LanguageCode;
}
async function translate(text: string, options?: TranslateOptions) {
    const signal = options?.signal;
    const source = options?.source ?? detectSourceLanguageSimple(text) ?? "";
    const target = options?.target ?? detectUserLanguage();
    if (source === target) return text;

    throwIfAborted(signal);
    const response = await fetchJsonp(
        "https://script.google.com/macros/s/AKfycbxlj9ulvLTmopmzz7Wv3ms5Wz5jy3tVtF5IXQbHdCHNFcfxiWRzc7vxVVTFeoAzZdo/exec",
        {
            callbackParameterName: "jsonp-callback",
            parameters: {
                text,
                source,
                target,
            },
            global: unsafeWindow as unknown as typeof globalThis,
        }
    );
    throwIfAborted(signal);
    const json = translateResultSpec.parse(response);
    if (json.type === "success") {
        if (json.result === text) {
            console.debug(
                `${pluginName}: 無駄な翻訳リクエスト?, ${json.result}`
            );
        }
        return json.result;
    }
    throw json.error;
}

function injectGetReviewListener(
    onGetReview: (
        this: XMLHttpRequest,
        event: ProgressEvent<XMLHttpRequestEventTarget>
    ) => void
) {
    const open0 = XMLHttpRequest.prototype.open;
    function open1(
        this: XMLHttpRequest,
        method: string,
        url: string | URL
    ): void;
    function open1(
        this: XMLHttpRequest,
        method: string,
        url: string | URL,
        async: boolean,
        username?: string | null,
        password?: string | null
    ): void;
    function open1(
        this: XMLHttpRequest,
        ...args: [
            method: string,
            url: string | URL,
            async?: boolean,
            username?: string | null,
            password?: string | null
        ]
    ) {
        const [method, url] = args;
        if (url == "/api/v1/vault/review" && method == "GET") {
            this.addEventListener("load", onGetReview, false);
        }
        open0.apply(this, args as Parameters<typeof open0>);
    }
    XMLHttpRequest.prototype.open = open1;
}

class Disposable {
    constructor(private _dispose: () => void) {}
    static create(dispose: () => void) {
        return new Disposable(dispose);
    }
    static empty = new Disposable(ignore);
    dispose() {
        this._dispose();
    }
    append(...disposables: this[]) {
        return new Disposable(() => {
            this.dispose();
            for (const d of disposables) {
                d.dispose();
            }
        });
    }
}

async function addTranslatorElement(
    element: Element,
    { signal }: { signal: AbortSignal }
) {
    const text = element.textContent ?? "";
    const spinnerElement = (
        <div class={classNames.spinner}>
            <span>...読み込み中</span>
        </div>
    );
    const translatedElement = (
        <span class={classNames["translated-text"]}>{spinnerElement}</span>
    );
    const translationElement = (
        <div>
            <style>{cssText}</style>
            {text}
            {translatedElement}
        </div>
    );
    element.attachShadow({ mode: "open" }).appendChild(translationElement);

    const translatedText = await translate(text, {
        signal,
    });
    const translatedDisplayText = (translatedElement.innerText =
        text === translatedText ? "" : translatedText);
    if (translatedDisplayText === "") {
        translatedElement.remove();
    }

    return Disposable.create(() => translationElement.remove());
}

const settingsKey =
    "wayfarer-in-page-translator-026fd711-881a-4482-a645-3f760b874b03";

const settingsV1 = z.strictObject({
    enabled: z.union([z.literal(true), z.literal(false)]).optional(),
});
type Settings = z.infer<typeof settingsV1>;

const defaultSettings: Required<Settings> = {
    enabled: true,
};
function getSettings() {
    const settings = settingsV1.parse(
        JSON.parse(
            localStorage.getItem(settingsKey) ?? JSON.stringify(defaultSettings)
        )
    );
    return Object.freeze(settings);
}
function saveSettings(settings: Settings) {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    console.debug(`${pluginName}: 保存しました。`, settings);
}
function modifySettings(mapping: (settings: Settings) => Settings) {
    saveSettings(mapping(getSettings()));
}

async function addSwitchElement(options?: { signal?: AbortSignal }) {
    const parent = await waitElementLoadedBy(
        "wf-header > :nth-child(1) > :nth-child(1)",
        options
    );
    const inputCheckbox = (<input type="checkbox" />) as HTMLInputElement;
    inputCheckbox.checked = getSettings().enabled ?? false;
    inputCheckbox.addEventListener("change", function () {
        modifySettings((s) => ({ ...s, enabled: this.checked }));
    });
    const switchElement = (
        <div class={switchClassNames.container}>
            <div class={switchClassNames.label}>翻訳</div>
            <label class={switchClassNames.switch}>
                <style>{switchCssText}</style>
                {inputCheckbox}
                <span
                    class={
                        switchClassNames.slider + " " + switchClassNames.round
                    }
                ></span>
            </label>
        </div>
    );
    const root = <div></div>;
    parent.append(root);
    root.attachShadow({ mode: "open" }).appendChild(switchElement);
    return Disposable.create(() => root.remove());
}

let reviewElementCleaner = Disposable.empty;
async function onGetReview({ signal }: { signal: AbortSignal }) {
    reviewElementCleaner.dispose();
    reviewElementCleaner = Disposable.empty;
    signal.addEventListener("abort", () => {
        console.debug(`${pluginName}: キャンセル`);
        reviewElementCleaner.dispose();
        reviewElementCleaner = Disposable.empty;
    });

    reviewElementCleaner = reviewElementCleaner.append(
        await addSwitchElement()
    );
    await waitBy(() => getSettings().enabled, { signal });

    const titleElement = await waitElementLoadedBy(
        "#title-description-card > .wf-review-card__body > div > a > div",
        { signal }
    );
    const descriptionElement = await waitElementLoadedBy(
        "#title-description-card > .wf-review-card__body > div > div",
        { signal }
    );
    const supplementaryElement = await waitElementLoadedBy(
        "app-supporting-info wf-review-card > .wf-review-card__body > :nth-child(1) > :nth-child(2)",
        { signal }
    );

    reviewElementCleaner = reviewElementCleaner.append(
        await addTranslatorElement(titleElement, { signal })
    );
    reviewElementCleaner = reviewElementCleaner.append(
        await addTranslatorElement(descriptionElement, { signal })
    );
    reviewElementCleaner = reviewElementCleaner.append(
        await addTranslatorElement(supplementaryElement, { signal })
    );
}

async function asyncMain() {
    await waitElementLoaded();
    addStyle(cssText);

    const scope = createAsyncCancelScope(handleAsyncError);
    injectGetReviewListener(() => scope((signal) => onGetReview({ signal })));
}
