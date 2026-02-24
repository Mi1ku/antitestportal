import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const PluginConfigKey = "shield-ultra-config-v11"; // New key to avoid conflicts

const storage = new Storage({
    area: "local"
});

export interface PluginConfig {
    shieldKey: string;
    antiAntiTampering: boolean;
    timeFreeze: boolean;
    showHud: boolean;
    showAnswerBot: boolean;
    resetTimestamp: number;
    searchEngine: 'groq' | 'google' | 'perplexity';
}

const DefaultConfig: PluginConfig = {
    shieldKey: "",
    antiAntiTampering: false, // Domyślnie wyłączone (wymaga logowania)
    timeFreeze: false,
    showHud: false, // Domyślnie wyłączone
    showAnswerBot: false,
    resetTimestamp: 0,
    searchEngine: 'groq'
}

export default function usePluginConfig() {
    const [config, setConfig] = useStorage<PluginConfig>({
        key: PluginConfigKey,
        instance: storage
    }, DefaultConfig);

    const safeConfig = config || DefaultConfig;

    return {
        pluginConfig: {
            shieldKey: safeConfig.shieldKey,
            setShieldKey: (val: string) => setConfig(prev => ({ ...(prev || DefaultConfig), shieldKey: val })),
            antiAntiTampering: safeConfig.antiAntiTampering,
            setAntiAntiTampering: (val: boolean) => setConfig(prev => ({ ...(prev || DefaultConfig), antiAntiTampering: val })),
            timeFreeze: safeConfig.timeFreeze,
            setTimeFreeze: (val: boolean) => setConfig(prev => ({ ...(prev || DefaultConfig), timeFreeze: val })),
            showHud: safeConfig.showHud,
            setShowHud: (val: boolean) => setConfig(prev => ({ ...(prev || DefaultConfig), showHud: val })),
            showAnswerBot: safeConfig.showAnswerBot,
            setShowAnswerBot: (val: boolean) => setConfig(prev => ({ ...(prev || DefaultConfig), showAnswerBot: val })),
            resetTimestamp: safeConfig.resetTimestamp,
            triggerReset: () => setConfig(prev => ({ ...(prev || DefaultConfig), resetTimestamp: Date.now() })),
            searchEngine: safeConfig.searchEngine,
            setSearchEngine: (val: 'groq' | 'google' | 'perplexity') => setConfig(prev => ({ ...(prev || DefaultConfig), searchEngine: val }))
        }
    }
}

