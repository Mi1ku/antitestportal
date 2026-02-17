/**
 * ANTITESTPORTAL ULTRA v10.0.0 - GHOST CORE ENGINE
 * Premium Features: Time Warp v2, AI Supreme, Absolute Honesty
 */
(function () {
    if (typeof window.__tp_ultra_active__ !== 'undefined') return;
    window.__tp_ultra_active__ = true;

    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => "function " + (n || "") + "() { [native code] }";
        return w;
    };

    // 1. TIME WARP v2 (Perfect Synchronization)
    const tW = () => {
        if (window.__tp_ultra_freeze__ === false) return;
        try {
            if (typeof window.startTime !== 'undefined') window.startTime = Date.now();
            if (window.Testportal && window.Testportal.Timer) {
                const t = window.Testportal.Timer;
                t.stop = _c(() => true, 'stop');
                t.pause = _c(() => true, 'pause');
                t.isExpired = _c(() => false, 'isExpired');
                window.remainingTime = 999999;
            }
            // Universal variables
            ['timePassed', 'timeSpent', 'elapsedTime'].forEach(k => {
                if (typeof window[k] !== 'undefined') window[k] = 0;
            });
        } catch (e) { }
    };

    // 2. AI SUPREME & SEARCH
    const sAI = () => {
        const sel = ['.question-content', '.answer-text', '.question_essence', 'label', 'p', 'span', 'h1', 'h2'];
        document.querySelectorAll(sel.join(', ')).forEach(el => {
            if (el.innerText && el.innerText.trim().length > 2 && !el.hasAttribute('data-shield-v10')) {
                el.setAttribute('data-shield-v10', '1');
                el.style.cursor = 'help';
                el.addEventListener('mousedown', (e) => {
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const t = el.innerText.trim().replace(/\s+/g, ' ');
                        const u = e.ctrlKey
                            ? `https://www.google.com/search?q=${encodeURIComponent(t)}`
                            : `https://www.perplexity.ai/search?q=${encodeURIComponent(t)}`;
                        window.open(u, '_blank');
                    }
                }, true);
            }
        });

        tW();
        // UI Clean
        document.querySelectorAll('[class*="modal"], [class*="backdrop"], .mdc-dialog, .mdc-dialog__scrim').forEach(o => o.remove());
    };

    // 3. HONESTY PROTOCOL (GPT Method)
    const bH = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                h.isHonest = _c(() => true, 'isHonest');
                h.validate = _c(() => true, 'validate');
                Object.defineProperty(h, 'isHonest', { get: () => _c(() => true, 'isHonest'), configurable: false });
            }
        } catch (e) { }
    };

    bH();
    setInterval(sAI, 1000);
    console.log("%c [Ultra Engine] System Online v10.0 ", "background: #8b5cf6; color: white; border-radius: 4px; padding: 2px 4px;");
})();