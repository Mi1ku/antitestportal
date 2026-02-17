import useGlobalSyncedState from "~hooks/use-global-synced-state"

export enum AutoSolveButtonVisibility {
    VISIBLE = "visible",
    BARELY_VISIBLE = "barely_visible",
    NOT_VISIBLE = "not_visible"
}

export const PluginConfigKey = "shield-ultra-config-v11"; // New key to avoid conflicts

export interface PluginConfig {
    shieldKey: string;
    antiAntiTampering: boolean;
    btnVisibility: AutoSolveButtonVisibility;
    timeFreeze: boolean;
}

const DefaultConfig: PluginConfig = {
    shieldKey: "",
    antiAntiTampering: true,
    btnVisibility: AutoSolveButtonVisibility.VISIBLE,
    timeFreeze: true
}

export default function usePluginConfig() {
    const [config, setConfig] = useGlobalSyncedState<PluginConfig>(PluginConfigKey, DefaultConfig);

    return {
        pluginConfig: {
            shieldKey: config.shieldKey,
            setShieldKey: (val: string) => setConfig(prev => ({ ...prev, shieldKey: val })),
            antiAntiTampering: config.antiAntiTampering,
            setAntiAntiTampering: (val: boolean) => setConfig(prev => ({ ...prev, antiAntiTampering: val })),
            btnVisibility: config.btnVisibility,
            setBtnVisibility: (val: AutoSolveButtonVisibility) => setConfig(prev => ({ ...prev, btnVisibility: val })),
            timeFreeze: config.timeFreeze,
            setTimeFreeze: (val: boolean) => setConfig(prev => ({ ...prev, timeFreeze: val }))
        }
    }
}
