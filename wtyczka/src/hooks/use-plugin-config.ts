import useGlobalSyncedState from "~hooks/use-global-synced-state"
import { GptModel } from "~models/openai";

export enum AutoSolveButtonVisibility {
    VISIBLE = "visible",
    BARELY_VISIBLE = "barely_visible",
    NOT_VISIBLE = "not_visible"
}

export const PluginConfigKey = "shield-ultra-config-v10";

export interface PluginConfig {
    shieldKey: string;
    apiKey: string;
    apiModel: string;
    antiAntiTampering: boolean;
    btnVisibility: AutoSolveButtonVisibility;
    timeFreeze: boolean;
}

const DefaultConfig: PluginConfig = {
    shieldKey: "",
    apiKey: "",
    apiModel: GptModel.GPT_5_2,
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
            apiKey: config.apiKey,
            setApiKey: (val: string) => setConfig(prev => ({ ...prev, apiKey: val })),
            apiModel: config.apiModel,
            setApiModel: (val: string) => setConfig(prev => ({ ...prev, apiModel: val })),
            antiAntiTampering: config.antiAntiTampering,
            setAntiAntiTampering: (val: boolean) => setConfig(prev => ({ ...prev, antiAntiTampering: val })),
            btnVisibility: config.btnVisibility,
            setBtnVisibility: (val: AutoSolveButtonVisibility) => setConfig(prev => ({ ...prev, btnVisibility: val })),
            timeFreeze: config.timeFreeze,
            setTimeFreeze: (val: boolean) => setConfig(prev => ({ ...prev, timeFreeze: val }))
        }
    }
}
