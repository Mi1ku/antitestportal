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
            // 1. Reset natywnych zmiennych okna
            // @ts-ignore
            if (typeof window.startTime !== 'undefined') window.startTime = Date.now();

            // 2. Szukanie obiektu Testportal w window (pobrane przez postMessage z MAIN world jeśli trzeba, 
            // ale tutaj próbujemy bezpośrednio z izolowanego, co zazwyczaj nie widzi danych, 
            // dlatego użyjemy wstrzyknięcia do resetu poniżej)

            // Wywołujemy reset w MAIN world wysyłając event
            const event = new CustomEvent("76mikus_reset_timer");
            window.dispatchEvent(event);

            console.log("[Engine] Global Reset Signal Sent.");
        } catch (e) { }
    };

    // 1. TIME WARP v11.4 (Control)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!pluginConfig.timeFreeze) return;
            // Tutaj tylko logika pomocnicza, główny mróz jest w assets/anti-anti-tamper.js
        }, 800);
        return () => clearInterval(interval);
    }, [pluginConfig.timeFreeze]);

    // 2. SEARCH SHORTS
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

    // 3. LISTEN FOR RESET SIGNAL FROM POPUP
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

// Inicjalizacja silnika
const rootDiv = document.createElement("div");
rootDiv.id = "ultra-engine-v11-76mikus";
document.body.appendChild(rootDiv);
const root = createRoot(rootDiv);
root.render(<TestportalUltraEngine />);

export default () => null;
