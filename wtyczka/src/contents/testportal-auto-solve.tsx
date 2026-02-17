import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import usePluginConfig from "~hooks/use-plugin-config";

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*"
    ],
    all_frames: true,
    run_at: "document_idle"
};

const TestportalUltraEngine = () => {
    const { pluginConfig } = usePluginConfig();

    const resetTimer = () => {
        try {
            // @ts-ignore
            if (typeof window.startTime !== 'undefined') window.startTime = Date.now();
            // @ts-ignore
            if (window.Testportal && window.Testportal.Timer) {
                // @ts-ignore
                const t = window.Testportal.Timer;
                // Force reset if internal state allows
                if (t.init) t.init();
            }
            ['timePassed', 'timeSpent'].forEach(k => {
                // @ts-ignore
                if (typeof window[k] !== 'undefined') window[k] = 0;
            });
            console.log("[Engine] Timer Reset.");
        } catch (e) { }
    };

    // 1. TIME WARP v11.2 (Integrated)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!pluginConfig.timeFreeze) return;
            try {
                // @ts-ignore
                if (window.Testportal && window.Testportal.Timer) {
                    // @ts-ignore
                    const t = window.Testportal.Timer;
                    t.stop = () => true;
                    t.pause = () => true;
                    t.isExpired = () => false;
                    // @ts-ignore
                    window.remainingTime = 999999;
                }
                ['timePassed', 'timeSpent'].forEach(k => {
                    // @ts-ignore
                    if (typeof window[k] !== 'undefined') window[k] = 0;
                });
            } catch (e) { }
        }, 800);
        return () => clearInterval(interval);
    }, [pluginConfig.timeFreeze]);

    // 2. SEARCH SHORTS
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.ctrlKey || e.altKey) {
                const target = e.target as HTMLElement;
                const text = target.innerText?.trim();

                if (text && text.length > 2) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    if (e.ctrlKey) {
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
                    } else if (e.altKey) {
                        window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(text)}`, '_blank');
                    }
                }
            }
        };

        window.addEventListener('mousedown', handleMouseDown, true);
        return () => window.removeEventListener('mousedown', handleMouseDown, true);
    }, []);

    // 3. LISTEN FOR RESET SIGNAL
    useEffect(() => {
        const handleMessage = (msg: any) => {
            if (msg.type === "RESET_TIMER") {
                resetTimer();
            }
        };
        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    return null;
}

// Inicjalizacja
const isTest = document.querySelector(".test-solving-container") || document.querySelector(".question_essence");
if (isTest) {
    const rootDiv = document.createElement("div");
    rootDiv.id = "ultra-engine-v11";
    document.body.appendChild(rootDiv);
    const root = createRoot(rootDiv);
    root.render(<TestportalUltraEngine />);
}

export default () => null;
