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
        // Wstrzykujemy do head dla maksymalnej szybkości
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    } catch (e) { }
}

// 1. Wstrzykujemy silnik (MAIN WORLD)
injectGhostEngine();

// 2. Obsługa DYNAMICZNCH zmian (Bez odświeżania strony)
// Słuchamy zmian w storage i przesyłamy je do wstrzykniętego skryptu przez CustomEvent
pluginStorage.watch({
    [PluginConfigKey]: (change) => {
        const newConfig = change.newValue as PluginConfig;
        if (newConfig) {
            console.log("[76mikus] Dynamic Sync:", newConfig);
            window.dispatchEvent(new CustomEvent("ultra_cmd_shield", { detail: newConfig.antiAntiTampering }));
            window.dispatchEvent(new CustomEvent("ultra_cmd_hud", { detail: newConfig.showHud }));
            window.dispatchEvent(new CustomEvent("ultra_cmd_freeze", { detail: newConfig.timeFreeze }));
        }
    }
});

// 3. Inicjalizacja stanu początkowego (zaraz po załadowaniu)
const initShieldState = async () => {
    const config = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    const isEnabled = config?.antiAntiTampering ?? true;
    const isHud = config?.showHud ?? true;
    const isFreeze = config?.timeFreeze ?? false;

    // Wysyłamy stan początkowy do wstrzykniętego skryptu
    window.dispatchEvent(new CustomEvent("ultra_cmd_shield", { detail: isEnabled }));
    window.dispatchEvent(new CustomEvent("ultra_cmd_hud", { detail: isHud }));
    window.dispatchEvent(new CustomEvent("ultra_cmd_freeze", { detail: isFreeze }));
};

// Czekamy chwilę, żeby wstrzyknięty skrypt zdążył ustawić listenery
setTimeout(initShieldState, 100);

export default () => null;
