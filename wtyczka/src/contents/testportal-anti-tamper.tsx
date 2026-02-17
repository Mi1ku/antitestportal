import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*",
        "https://teams.microsoft.com/*"
    ],
    all_frames: true,
    run_at: "document_start",
    world: "MAIN" // To krytyczne: kod uruchamia się bezpośrednio w "mózgu" strony
};

const storage = new Storage();

const applyShield = () => {
    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    try {
        const p = Object.getPrototypeOf(document);

        // 1. FOCUS & VISIBILITY (Shadowing)
        Object.defineProperty(p, 'hasFocus', {
            value: _c(() => true, 'hasFocus'),
            writable: false, configurable: false
        });

        Object.defineProperty(p, 'visibilityState', {
            get: _c(() => 'visible', 'get visibilityState'),
            configurable: false
        });

        Object.defineProperty(p, 'hidden', {
            get: _c(() => false, 'get hidden'),
            configurable: false
        });

        // 2. NETWORK BLACKOUT (Silent)
        window.logToServer = _c(() => false, 'logToServer');
        window.sendCheatInfo = _c(() => false, 'sendCheatInfo');

        // 3. PLUGIN MASKING
        if (navigator.plugins) {
            Object.defineProperty(navigator, 'plugins', {
                get: _c(() => ({ length: 0, item: () => null, namedItem: () => null }), 'get plugins'),
                configurable: false
            });
        }

        // 4. EVENT SUPPRESSION
        const s = (e) => e.stopImmediatePropagation();
        window.addEventListener('blur', s, true);
        window.addEventListener('visibilitychange', s, true);
        window.addEventListener('mouseleave', s, true);
        window.addEventListener('focusout', s, true);

        // Odblokowanie PPM
        window.addEventListener('contextmenu', s, true);

        console.log("%c [System] AntiTestportal Ultra Shield Active ", "background: #8b5cf6; color: white; border-radius: 4px; padding: 2px 4px;");
    } catch (e) { }
};

// Uruchamiamy natychmiast
applyShield();

export default () => null;
