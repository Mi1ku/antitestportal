import useGlobalSyncedState from "~hooks/use-global-synced-state"

export const PluginConfigKey = "shield-ultra-config-v11"; // New key to avoid conflicts

export interface PluginConfig {
    shieldKey: string;
    antiAntiTampering: boolean;
    timeFreeze: boolean;
    showHud: boolean;
    showAnswerBot: boolean;
    resetTimestamp: number;
}

const DefaultConfig: PluginConfig = {
    shieldKey: "",
    antiAntiTampering: false, // Domyślnie wyłączone (wymaga logowania)
    timeFreeze: false,
    showHud: false, // Domyślnie wyłączone
    showAnswerBot: false,
    resetTimestamp: 0
}

export default function usePluginConfig() {
    const [config, setConfig] = useGlobalSyncedState<PluginConfig>(PluginConfigKey, DefaultConfig);

    return {
        pluginConfig: {
            shieldKey: config.shieldKey,
            setShieldKey: (val: string) => setConfig(prev => ({ ...prev, shieldKey: val })),
            antiAntiTampering: config.antiAntiTampering,
            setAntiAntiTampering: (val: boolean) => setConfig(prev => ({ ...prev, antiAntiTampering: val })),
            timeFreeze: config.timeFreeze,
            setTimeFreeze: (val: boolean) => setConfig(prev => ({ ...prev, timeFreeze: val })),
            showHud: config.showHud,
            setShowHud: (val: boolean) => setConfig(prev => ({ ...prev, showHud: val })),
            showAnswerBot: config.showAnswerBot,
            setShowAnswerBot: (val: boolean) => setConfig(prev => ({ ...prev, showAnswerBot: val })),
            resetTimestamp: config.resetTimestamp,
            triggerReset: () => setConfig(prev => ({ ...prev, resetTimestamp: Date.now() }))
        }
    }
}

