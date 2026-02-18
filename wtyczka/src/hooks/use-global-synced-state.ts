import React, { useEffect, useRef, useState } from "react";
// import { Storage } from "@plasmohq/storage"
import { EventEmitter } from "events"
import useBrowserEnv, { BrowserEnvType } from "~hooks/use-browser-env";

export const MSG_GLOBAL_STATE_CHANGE = "testportal-global-state-change";

const stateMap = new Map<string, any>();
const emitter = new EventEmitter();
export const stateBus = {
    get: <T>(key: string): T | undefined => stateMap.get(key),
    set: <T>(key: string, value: T) => {
        stateMap.set(key, value)
        emitter.emit(key, value)
    },
    subscribe: <T>(key: string, callback: (value: T) => void) => {
        emitter.on(key, callback)
        return () => emitter.off(key, callback)
    }
}

/*
 * Custom React hook to manage a global state variable that is synchronized with persistent plugin storage.
 */
export default function useSyncedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(defaultValue);
    const browserEnv: BrowserEnvType = useBrowserEnv();

    const isInitialized = useRef<boolean>(false);
    const initialMessageSkipped = useRef<boolean>(false);

    // Load from plugin storage when the component mounts.
    useEffect(() => {
        const load = () => {
            try {
                const raw = localStorage.getItem(key);
                if (raw !== null) {
                    const parsed = JSON.parse(raw);
                    setValue(parsed);
                    stateBus.set(key, parsed);
                } else {
                    stateBus.set(key, defaultValue);
                }
            } catch (e) {
                stateBus.set(key, defaultValue);
            }
            isInitialized.current = true;
        };
        load();
    }, [])

    // Subscribe to changes in the global state bus for this key.
    useEffect(() => {
        const unsubscribe = stateBus.subscribe<T>(key, (newVal) => {
            if (!isInitialized.current) return;
            setValue(newVal)
        })
        return () => {
            unsubscribe()
        }
    }, [key]);

    // Function to set the shared value in the global state bus.
    const setSharedValue: React.Dispatch<React.SetStateAction<T>> = (update) => {
        if (!isInitialized.current) return;
        const currentValue = stateBus.get<T>(key) ?? defaultValue;
        const newValue = typeof update === "function" ? (update as any)(currentValue) : update
        stateBus.set(key, newValue)
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (e) { }
    }

    return [value, setSharedValue]
}