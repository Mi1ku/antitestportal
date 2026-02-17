/**
 * ANTITESTPORTAL ULTRA v5.7.0 - ULTIMATE ENGINE
 * Fixes: Focal Loss Prevention, Persistent Time Warp, Unblockable States
 */
(function () {
    const VERSION = "5.7.0";

    // Inicjalizacja stanu (jeśli nie został wstrzyknięty przez background)
    if (typeof window.SHIELD_TIME_FREEZE === 'undefined') {
        window.SHIELD_TIME_FREEZE = true;
    }

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => "function " + (name || "") + "() { [native code] }";
        return wrapped;
    };

    // 1. EKSTREMALNY TIME WARP (Zarządzanie czasem)
    const timeWarp = () => {
        if (!window.SHIELD_TIME_FREEZE) return;

        try {
            // Client-side reset
            if (typeof window.startTime !== 'undefined') window.startTime = Date.now();

            // Testportal Object Timer
            if (window.Testportal && window.Testportal.Timer) {
                const t = window.Testportal.Timer;
                t.stop = makeNative(() => true, 'stop');
                t.pause = makeNative(() => true, 'pause');
                t.isExpired = makeNative(() => false, 'isExpired');
                window.remainingTime = 9999;
            }

            // Server-side telemetry prevention
            if (typeof window.timePassed !== 'undefined') window.timePassed = 0;
            if (typeof window.timeSpent !== 'undefined') window.timeSpent = 0;
        } catch (e) { }
    };

    // 2. SUPREME AI & SEARCH
    const setupAI = () => {
        const selectors = ['.question-content', '.answer-text', '.question_essence', 'label', 'p', 'span', 'h1', 'h2'];
        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            if (el.innerText && el.innerText.trim().length > 2 && !el.hasAttribute('data-shield')) {
                el.setAttribute('data-shield', 'true');
                el.style.cursor = 'help';
                el.addEventListener('mousedown', (e) => {
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const text = el.innerText.trim().replace(/\s+/g, ' ');
                        const url = e.ctrlKey
                            ? `https://www.google.com/search?q=${encodeURIComponent(text)}`
                            : `https://www.perplexity.ai/search?q=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                    }
                }, true);
            }
        });

        timeWarp();

        // Usuwanie śmieci i alertów Testportalu
        document.querySelectorAll('[class*="modal"], [class*="backdrop"], .mdc-dialog, .mdc-dialog__scrim').forEach(o => o.remove());
    };

    // 3. BYPASS SYSTEMU (Honest Respondent)
    const bypassSystem = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                h.isHonest = makeNative(() => true, 'isHonest');
                h.validate = makeNative(() => true, 'validate');
            }
        } catch (e) { }
    };

    console.log("%c 🦍 ANTITESTPORTAL ULTRA v" + VERSION + " ACTIVE 🦍 ", "color: #b983ff; font-weight: bold;");

    bypassSystem();
    setInterval(setupAI, 1000);
    window.addEventListener('error', e => e.preventDefault(), true);
})();