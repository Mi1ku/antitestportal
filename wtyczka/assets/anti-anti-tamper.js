/**
 * AntiTestportal Ultra v10.0.0
 * Absolute Stealth Core (GPT-Grade)
 */
(function () {
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

        // 2. NETWORK BLACKOUT (JavaScript Layer)
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

        console.log("[Shield] Ghost Commander v10.0 (Plasma) Active.");
    } catch (e) { }
})();
