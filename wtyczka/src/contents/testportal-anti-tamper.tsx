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

injectGhostEngine();

// Dynamiczna synchronizacja stanu (bez wiadomości direct)
pluginStorage.watch({
    [PluginConfigKey]: (change) => {
        const newConfig = change.newValue as PluginConfig;
        const oldConfig = change.oldValue as PluginConfig;

        if (newConfig) {
            window.dispatchEvent(new CustomEvent("ultra_cmd_shield", { detail: newConfig.antiAntiTampering }));
            window.dispatchEvent(new CustomEvent("ultra_cmd_hud", { detail: newConfig.showHud }));
            window.dispatchEvent(new CustomEvent("ultra_cmd_freeze", { detail: newConfig.timeFreeze }));

            // Reagujemy na zmianę timestampu resetu (Zamiast sendMessage)
            if (newConfig.resetTimestamp !== oldConfig?.resetTimestamp) {
                window.dispatchEvent(new CustomEvent("ultra_cmd_reset"));
            }
        }
    }
});

const initShieldState = async () => {
    const config = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    if (!config) return;

    window.dispatchEvent(new CustomEvent("ultra_cmd_shield", { detail: config.antiAntiTampering }));
    window.dispatchEvent(new CustomEvent("ultra_cmd_hud", { detail: config.showHud }));
    window.dispatchEvent(new CustomEvent("ultra_cmd_freeze", { detail: config.timeFreeze }));
};

setTimeout(initShieldState, 150);

// --- SUPREME AI SCREENSHOT HANDLER ---
window.addEventListener("ultra_req_capture", async () => {
    try {
        chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, async (response) => {
            if (response && response.success && response.dataUrl) {
                // Konwertujemy DataURL na Blob dla schowka
                const res = await fetch(response.dataUrl);
                const blob = await res.blob();

                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ "image/png": blob })
                    ]);

                    // Otwieramy ChatGPT
                    window.open("https://chatgpt.com/", "_blank");
                } catch (err) {
                    console.error("Clipboard write failed:", err);
                    alert("⚠️ Nie udało się skopiować obrazu do schowka. Upewnij się, że strona jest aktywna.");
                }
            } else {
                console.error("Screenshot failed:", response?.error);
            }
        });
    } catch (e) {
        console.error("Capture flow error:", e);
    }
});

export default () => null;
