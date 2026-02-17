/**
 * ANTITESTPORTAL ULTRA v10.0.0 "GHOST COMMANDER"
 * Technology inspired by Testportal-GPT Main Architecture.
 * Total Stealth, Zero Latency, Unblockable Protection.
 */
(function () {
    // 1. NATIVE CLONING ENGINE
    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    // 2. IMMEDIATE SYSTEM OVERRIDES (The "GPT" Way)
    const applyBypass = () => {
        try {
            const p = Object.getPrototypeOf(document);

            // Focus & Visibility (The Core)
            Object.defineProperty(p, 'hasFocus', { value: _c(() => true, 'hasFocus'), configurable: false });
            Object.defineProperty(p, 'visibilityState', { get: _c(() => 'visible', 'get visibilityState'), configurable: false });
            Object.defineProperty(p, 'hidden', { get: _c(() => false, 'get hidden'), configurable: false });

            // Anti-Telemetry & Remote Logging
            window.logToServer = _c(() => false, 'logToServer');
            window.sendCheatInfo = _c(() => false, 'sendCheatInfo');

            // Masking extension signatures
            if (navigator.plugins) {
                Object.defineProperty(navigator, 'plugins', {
                    get: _c(() => ({ length: 0, item: () => null, namedItem: () => null }), 'get plugins'),
                    configurable: false
                });
            }

            // Event Suppression
            const s = (e) => e.stopImmediatePropagation();
            window.addEventListener('blur', s, true);
            window.addEventListener('visibilitychange', s, true);
            window.addEventListener('mouseleave', s, true);
            window.addEventListener('focusout', s, true);

            console.log("[Shield] Ghost Commander v10.0 Active.");
        } catch (e) { }
    };

    // 3. ENGINE ACTIVATION (Communication Bridge)
    const triggerEngine = () => {
        const u = window.location.href;
        if (u.includes('/test/') || u.includes('/exam/') || u.includes('/start/')) {
            document.dispatchEvent(new CustomEvent('TP_INIT_ULTRA'));
        }
    };

    applyBypass();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', triggerEngine);
    } else {
        triggerEngine();
    }
})();