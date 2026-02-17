import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"
import { PluginConfigKey, type PluginConfig } from "~hooks/use-plugin-config";

const pluginStorage = new Storage();

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
    run_at: "document_start"
};

function injectGhostEngine() {
    try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('assets/anti-anti-tamper.js');
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    } catch (e) { }
}

// Zawsze wstrzykujemy silnik, ponieważ musi on słuchać eventów sterujących
injectGhostEngine();

// Inicjalizacja stanu początkowego
const initShieldState = async () => {
    const config = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    const isEnabled = config?.antiAntiTampering ?? true;
    const isHud = config?.showHud ?? true;

    // Wysyłamy stan początkowy do wstrzykniętego skryptu
    window.dispatchEvent(new CustomEvent("ultra_cmd_shield", { detail: isEnabled }));
    window.dispatchEvent(new CustomEvent("ultra_cmd_hud", { detail: isHud }));
};

initShieldState();

export default () => null;
