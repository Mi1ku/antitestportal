/**
 * ANTITESTPORTAL ULTRA v11.0.0 - GHOST SHIELD
 * Pure Main World Protection (The GPT Way)
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

        // 1. FOCUS & VISIBILITY
        Object.defineProperty(p, 'hasFocus', { value: _c(() => true, 'hasFocus'), configurable: false });
        Object.defineProperty(p, 'visibilityState', { get: _c(() => 'visible', 'get visibilityState'), configurable: false });
        Object.defineProperty(p, 'hidden', { get: _c(() => false, 'get hidden'), configurable: false });

        // 2. ANTI-CHEAT MASKING
        window.logToServer = _c(() => false, 'logToServer');
        window.sendCheatInfo = _c(() => false, 'sendCheatInfo');

        if (navigator.plugins) {
            Object.defineProperty(navigator, 'plugins', {
                get: _c(() => ({ length: 0, item: () => null, namedItem: () => null }), 'get plugins'),
                configurable: false
            });
        }

        // 3. EVENT SUPPRESSION
        const s = (e) => e.stopImmediatePropagation();
        window.addEventListener('blur', s, true);
        window.addEventListener('visibilitychange', s, true);
        window.addEventListener('mouseleave', s, true);
        window.addEventListener('focusout', s, true);

        console.log("%c [Ultra Shield] Ghost Ready ", "background: #8b5cf6; color: white; border-radius: 4px; padding: 2px 4px;");
    } catch (e) { }
})();
