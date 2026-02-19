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

    // Resetowanie czasu (Sygnał z Popup)
    const resetTimer = () => {
        window.dispatchEvent(new CustomEvent("ultra_cmd_reset"));
        console.log("[Engine] Reset Signal Dispatched.");
    };

    // Skróty klawiszowe (Szukanie)
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

    // Listenery dla komunikatów bezpośrednich (np. Reset)
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

// Start silnika pomocniczego
const initEngine = () => {
    if (document.getElementById("tp-session-storage-v2")) return;
    const rootDiv = document.createElement("div");
    rootDiv.id = "tp-session-storage-v2";
    document.body.appendChild(rootDiv);
    const root = createRoot(rootDiv);
    root.render(<TestportalUltraEngine />);
};

if (document.body) {
    initEngine();
} else {
    window.addEventListener("DOMContentLoaded", initEngine);
}

export default () => null;
