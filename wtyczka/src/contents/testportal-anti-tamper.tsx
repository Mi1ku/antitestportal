import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*",
        "https://teams.microsoft.com/*"
    ],
    all_frames: true,
    run_at: "document_start"
};

// Wstrzykiwanie tarczy bezpośrednio do MAIN world
const applyAntiAntiTampering = () => {
    try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('assets/shield.js');
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    } catch (e) {
        console.error("[Shield] Injection failed", e);
    }
}

applyAntiAntiTampering();

export default () => null;
