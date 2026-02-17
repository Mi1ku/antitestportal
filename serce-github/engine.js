/**
 * ANTITESTPORTAL ULTRA v5.6.1 - ULTIMATE ENGINE
 * Fixes: Extreme Timer Freeze, Honest Bypass, Search Integration
 */
(function () {
    const VERSION = "5.6.1";
    window.SHIELD_TIME_FREEZE = (typeof window.SHIELD_TIME_FREEZE === 'undefined') ? true : window.SHIELD_TIME_FREEZE;

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => "function " + (name || "") + "() { [native code] }";
        return wrapped;
    };

    // 1. EKSTREMALNY TIME WARP
    const timeWarp = () => {
        if (!window.SHIELD_TIME_FREEZE) return;

        try {
            // Resetujemy czas startu (testy podstawowe)
            if (typeof window.startTime !== 'undefined') {
                window.startTime = Date.now();
            }

            // Atak na obiekt Timer (nowy Testportal)
            if (window.Testportal && window.Testportal.Timer) {
                const t = window.Testportal.Timer;
                t.stop = makeNative(() => true, 'stop');
                t.pause = makeNative(() => true, 'pause');
                t.isExpired = makeNative(() => false, 'isExpired');
                window.remainingTime = 9999;
            }

            // Blokada wysyłki czasu do serwera
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

        // Killer overlejów (Blokujemy informację "Straciłeś focus")
        document.querySelectorAll('[class*="modal"], [class*="backdrop"], .mdc-dialog, .mdc-dialog__scrim').forEach(o => o.remove());
        document.body.classList.remove('modal-open', 'mdc-dialog-scroll-lock');
    };

    // 3. BYPASS UCZCIWOŚCI
    const bypassHonesty = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                h.isHonest = makeNative(() => true, 'isHonest');
                h.validate = makeNative(() => true, 'validate');
            }
        } catch (e) { }
    };

    console.log("%c 🦍 ANTITESTPORTAL ULTRA v" + VERSION + " ACTIVE 🦍 ", "color: #b983ff; font-weight: bold;");

    bypassHonesty();
    setInterval(setupAI, 1000);
    window.addEventListener('error', e => e.preventDefault(), true);
})();