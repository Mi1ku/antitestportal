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

    // 1. Synchronizacja GHOST SHIELD (Anti-Tamper)
    useEffect(() => {
        const event = new CustomEvent("ultra_cmd_shield", {
            detail: pluginConfig.antiAntiTampering
        });
        window.dispatchEvent(event);
    }, [pluginConfig.antiAntiTampering]);

    // 2. Synchronizacja Widoczności HUD
    useEffect(() => {
        const event = new CustomEvent("ultra_cmd_hud", {
            detail: pluginConfig.showHud
        });
        window.dispatchEvent(event);
    }, [pluginConfig.showHud]);

    // 3. Obsługa resetowania czasu
    const resetTimer = () => {
        const event = new CustomEvent("ultra_cmd_reset");
        window.dispatchEvent(event);
        console.log("[Engine] Hard Reset Signal Dispatched.");
    };

    // 4. Skróty klawiszowe (Szukanie)
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.ctrlKey || e.altKey) {
                const target = e.target as HTMLElement;
                const text = target.innerText?.trim() || window.getSelection()?.toString().trim();

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

    // 5. Sygnały z Popup
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

// Start silnika
const rootDiv = document.createElement("div");
rootDiv.id = "ultra-engine-heart";
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(<TestportalUltraEngine />);

export default () => null;
