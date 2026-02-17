/**
 * ANTITESTPORTAL ULTRA v5.9.0 - TOTAL STEALTH ENGINE
 * Features: Silent Time Warp, Invisible AI Search, Total Blackout
 */
(function () {
    const VERSION = "5.9.0";
    if (typeof window.__tp_freeze__ === 'undefined') window.__tp_freeze__ = true;

    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => "function " + (n || "") + "() { [native code] }";
        return w;
    };

    // 1. SILNE MROŻENIE CZASU
    const tW = () => {
        if (!window.__tp_freeze__) return;
        try {
            if (typeof window.startTime !== 'undefined') window.startTime = Date.now();
            if (window.Testportal && window.Testportal.Timer) {
                const t = window.Testportal.Timer;
                t.stop = _c(() => true, 'stop');
                t.pause = _c(() => true, 'pause');
                t.isExpired = _c(() => false, 'isExpired');
                window.remainingTime = 9999;
            }
            if (typeof window.timePassed !== 'undefined') window.timePassed = 0;
            if (typeof window.timeSpent !== 'undefined') window.timeSpent = 0;
        } catch (e) { }
    };

    // 2. SUPREME AI & SEARCH
    const sAI = () => {
        const sel = ['.question-content', '.answer-text', '.question_essence', 'label', 'p', 'span', 'h1', 'h2'];
        document.querySelectorAll(sel.join(', ')).forEach(el => {
            if (el.innerText && el.innerText.trim().length > 2 && !el.hasAttribute('data-s')) {
                el.setAttribute('data-s', '1');
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

        // Killer overlejów
        document.querySelectorAll('[class*="modal"], [class*="backdrop"], .mdc-dialog, .mdc-dialog__scrim').forEach(o => o.remove());
    });

    // 3. BYPASS HONESTY
    const bH = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                h.isHonest = _c(() => true, 'isHonest');
                h.validate = _c(() => true, 'validate');
            }
        } catch (e) { }
    };

    bH();
    setInterval(sAI, 1000);
    window.addEventListener('error', e => e.preventDefault(), true);
    console.log("%c AntiTestportal Ultra v" + VERSION + " Active", "color: #8b5cf6; font-weight: bold;");
})();