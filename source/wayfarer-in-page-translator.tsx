import { addStyle, waitElementLoaded } from "./document-extensions";
import classNames, { cssText } from "./styles.module.css";

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

async function asyncMain() {
    await waitElementLoaded();
    addStyle(cssText);

    const progress = (message: { type: never }) => {
        console.log(JSON.stringify(message));

        const { type } = message;
        switch (type) {
            default:
                throw new Error(`Unknown message type ${type satisfies never}`);
        }
    };
}
