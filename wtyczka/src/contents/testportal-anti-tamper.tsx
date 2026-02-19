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

// @ts-ignore
import ghostScript from "data-text:~/../assets/anti-anti-tamper.js"

function injectGhostEngine() {
    try {
        const root = (document.head || document.documentElement);
        if (!root) return;

        const script = document.createElement('script');
        script.textContent = ghostScript;
        root.appendChild(script);
        script.remove();
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

export default () => null;

