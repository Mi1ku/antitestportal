import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*",
        "https://teams.microsoft.com/*"
    ],
    all_frames: true,
    run_at: "document_start",
    world: "MAIN"
};

/**
 * 🦍 mi1ku SUPREME GHOST ENGINE v11.3.5 (Final Polish)
 * Absolute Stealth, Honest Respondent & Zero Trace
 */
(function () {
    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    const applySupremeGhost = () => {
        try {
            const p = Object.getPrototypeOf(document);

            // 1. ABSOLUTE FOCUS & VISIBILITY (Native Shadowing)
            Object.defineProperty(p, 'hasFocus', { value: _c(() => true, 'hasFocus'), configurable: false });
            Object.defineProperty(p, 'visibilityState', { get: _c(() => 'visible', 'get visibilityState'), configurable: false });
            Object.defineProperty(p, 'hidden', { get: _c(() => false, 'get hidden'), configurable: false });

            // 2. HONEST RESPONDENT SUPREME (The Original v10 logic + V11 upgrades)
            const mockHonestProtocol = () => {
                // @ts-ignore
                if (window.Testportal) {
                    // @ts-ignore
                    const tp = window.Testportal;
                    if (tp.HonestRespondent) {
                        const h = tp.HonestRespondent;
                        h.isHonest = _c(() => true, 'isHonest');
                        h.validate = _c(() => true, 'validate');
                        h.setHonest = _c(() => true, 'setHonest');
                        h.checkFocus = _c(() => true, 'checkFocus');
                        // @ts-ignore
                        h.sendCheatInfo = _c(() => false, 'sendCheatInfo');
                        Object.defineProperty(h, 'isHonest', { get: _c(() => true, 'isHonest'), configurable: false });
                    }
                    if (tp.Timer) {
                        const t = tp.Timer;
                        t.isExpired = _c(() => false, 'isExpired');
                    }
                }

                // Legacy & Global Bypass
                // @ts-ignore
                window.logToServer = _c(() => false, 'logToServer');
                // @ts-ignore
                window.sendCheatInfo = _c(() => false, 'sendCheatInfo');
                // @ts-ignore
                window.onBlurHandler = _c(() => false, 'onBlurHandler');
                // @ts-ignore
                window.cheat_detected = false;
            };

            // 3. NAVIGATOR & ENVIRONMENT MASKING
            if (navigator.plugins) {
                Object.defineProperty(navigator, 'plugins', {
                    get: _c(() => ({ length: 0, item: () => null, namedItem: () => null }), 'get plugins'),
                    configurable: false
                });
            }

            // 4. NUCLEAR EVENT SUPPRESSION (Global Capture)
            const s = (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            };
            const events = ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'mozvisibilitychange', 'webkitvisibilitychange', 'pagehide'];
            events.forEach(ev => {
                window.addEventListener(ev, s, true);
                document.addEventListener(ev, s, true);
            });

            // 5. ANTI-EXTENSION DETECTION (Hide Chrome Runtime)
            // @ts-ignore
            if (window.chrome && window.chrome.runtime) {
                const r = window.chrome.runtime;
                // @ts-ignore
                r.sendMessage = _c(() => { }, 'sendMessage');
                // @ts-ignore
                r.connect = _c(() => { }, 'connect');
            }

            // Periodic enforcement
            mockHonestProtocol();
            setInterval(mockHonestProtocol, 800);

            console.log("%c [76mikus] SUPREME GHOST ENGINE v11.3.5 READY ", "background: #8b5cf6; color: white; border-radius: 4px; padding: 4px 8px; font-weight: bold;");
        } catch (e) { }
    };

    applySupremeGhost();
})();

export default () => null;
