import React, { useEffect, useRef, useState } from "react";
import useBrowserEnv, { BrowserEnvType } from "~hooks/use-browser-env";

export const MSG_GLOBAL_STATE_CHANGE = "testportal-global-state-change";

// Simple Custom Emitter for Browser Environment
const listeners: Record<string, ((val: any) => void)[]> = {};
const stateMap = new Map<string, any>();

export const stateBus = {
    get: <T>(key: string): T | undefined => stateMap.get(key),
    set: <T>(key: string, value: T) => {
        stateMap.set(key, value);
        if (listeners[key]) {
            listeners[key].forEach(cb => cb(value));
        }
    },
    subscribe: <T>(key: string, callback: (value: T) => void) => {
        if (!listeners[key]) listeners[key] = [];
        listeners[key].push(callback);
        return () => {
            listeners[key] = listeners[key].filter(cb => cb !== callback);
        };
    }
}

export default function useSyncedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(defaultValue);
    const isInitialized = useRef<boolean>(false);

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
    }, []);

    useEffect(() => {
        const unsubscribe = stateBus.subscribe<T>(key, (newVal) => {
            if (!isInitialized.current) return;
            setValue(newVal);
        });
        return () => unsubscribe();
    }, [key]);

    const setSharedValue: React.Dispatch<React.SetStateAction<T>> = (update) => {
        if (!isInitialized.current) return;
        const currentValue = stateBus.get<T>(key) ?? defaultValue;
        const newValue = typeof update === "function" ? (update as any)(currentValue) : update;
        stateBus.set(key, newValue);
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (e) { }
    };

    return [value, setSharedValue];
}