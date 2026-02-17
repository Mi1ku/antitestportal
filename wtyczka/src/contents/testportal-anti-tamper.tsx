import type { PlasmoCSConfig } from "plasmo"
import { BaseStorage, Storage } from "@plasmohq/storage"
import { PluginConfigKey, type PluginConfig } from "~hooks/use-plugin-config";

const pluginStorage: BaseStorage = new Storage();
export const config: PlasmoCSConfig = {
    matches: [
        "https://testportal.pl/*",
        "https://testportal.net/*",
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://testportal.com/*",
        "https://*.testportal.com/*",
        "https://teams.microsoft.com/*"
    ],
    all_frames: true,
    run_at: "document_start" // Przyspieszamy wstrzykiwanie
};

// Kudos to github.com/alszolowicz/anti-testportal for concept and inspiration.
function applyAntiAntiTampering() {
    try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('assets/anti-anti-tamper.js');
        // Wstrzykujemy do head dla maksymalnej szybkości
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    } catch (e) {
        console.error("[76mikus] Injection failed", e);
    }
}

const initialize = async () => {
    const config = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    const enableAntiAntiTampering = config?.antiAntiTampering ?? true;

    if (enableAntiAntiTampering) {
        console.log("[76mikus] Applying anti-anti-tampering (Supreme Mode)");
        applyAntiAntiTampering();
    } else {
        console.log("[76mikus] Anti-anti-tampering is disabled");
    }
};

initialize();

export default () => null;
