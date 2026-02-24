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
    exclude_matches: [
        "https://*.testportal.pl/manager/*",
        "https://*.testportal.net/manager/*",
        "https://*.testportal.online/manager/*",
        "https://*.testportal.com/manager/*"
    ],
    all_frames: true,
    run_at: "document_start"
};

const sendSync = (cfg: PluginConfig) => {
    try {
        window.dispatchEvent(new CustomEvent("ultra_sync", { detail: cfg }));
    } catch (e) { }
};

const init = async () => {
    // SECURITY GUARD: Absolutely forbid execution on manager pages
    if (window.location.pathname.includes('/manager/') ||
        window.location.pathname.includes('/admin/') ||
        window.location.pathname.includes('/setup/')) {
        return;
    }

    // 1. Pobierz aktualny stan
    const cfg = await pluginStorage.get<PluginConfig>(PluginConfigKey);
    if (cfg) {
        sendSync(cfg);
    } else {
        // Fallback default
        sendSync({
            shieldKey: "",
            antiAntiTampering: false, // Domyślnie wyłączone (zabezpieczenie)
            timeFreeze: false,
            showHud: false, // Domyślnie wyłączone
            showAnswerBot: false,
            resetTimestamp: 0,
            searchEngine: 'google',
            geminiApiKey: ""
        });
    }

    // 2. Nasłuchuj zmian z Content Script (Main World) -> Storage
    window.addEventListener("ultra_sync_update", async (e: any) => {
        const update = e.detail;
        if (!update) return;
        const currentCfg = await pluginStorage.get<PluginConfig>(PluginConfigKey) || {} as PluginConfig;
        const newCfg = { ...currentCfg, ...update };
        await pluginStorage.set(PluginConfigKey, newCfg);
        // console.log("[RELAY] Synced update from page:", update);
    });

    // 3. Nasłuchuj zmian ze Storage -> Content Script
    pluginStorage.watch({
        [PluginConfigKey]: (change) => {
            if (change.newValue) {
                sendSync(change.newValue as PluginConfig);
            }
        }
    });

    // Heartbeat co 1s dla pewności (tylko w funkcji init, by też był chroniony returnem)
    setInterval(async () => {
        const cfg = await pluginStorage.get<PluginConfig>(PluginConfigKey);
        if (cfg) sendSync(cfg);
    }, 1000);
};

init();

export default () => null;
