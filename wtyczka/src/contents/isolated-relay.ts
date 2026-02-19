import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"
import { PluginConfigKey, type PluginConfig } from "~hooks/use-plugin-config";

const pluginStorage = new Storage({
    area: "local" // Używamy LOCAL (jest szybsze i niezawodne dla content scriptów)
});

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*",
        "https://*.testportal.com/*",
        "https://teams.microsoft.com/*"
    ],
    all_frames: true,
    run_at: "document_start"
};

const sendSync = (cfg: PluginConfig) => {
    try {
        window.dispatchEvent(new CustomEvent("ultra_sync", { detail: cfg }));
        // Debug
        // console.log("[RELAY] Sent ultra_sync", cfg);
    } catch (e) { }
};

const init = async () => {
    // 1. Pobierz aktualny stan
    const cfg = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    if (cfg) {
        sendSync(cfg);
    } else {
        // Fallback default
        sendSync({
            shieldKey: "",
            antiAntiTampering: true,
            timeFreeze: false, // Domyślnie FALSE, żeby user włączył świadomie
            showHud: true,
            resetTimestamp: 0
        });
    }

    // 2. Nasłuchuj zmian
    pluginStorage.watch({
        [PluginConfigKey]: (change) => {
            if (change.newValue) {
                sendSync(change.newValue as PluginConfig);
            }
        }
    });
};

init();
// Heartbeat co 1s dla pewności
setInterval(async () => {
    const cfg = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    if (cfg) sendSync(cfg);
}, 1000);

export default () => null;
