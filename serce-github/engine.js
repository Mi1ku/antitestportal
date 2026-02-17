(function () {
    /**
     * SHIELD ULTRA ENTERPRISE v4.8.0 - THE ULTIMATE BYPASS & TIME WARP
     * Features: Absolute Anti-Tamper, Honest Bypass, Time Distortion
     */

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // 1. ZABÓJCA FOCUS LOSS (ReferenceError Trick - Ported from testportal-gpt)
    const initAntiTamper = () => {
        try {
            // Trik ReferenceError - paraliżuje wykrywanie zmian kart
            Object.defineProperty(document, 'hasFocus', {
                get: () => { throw new ReferenceError("antiTestportalFeature"); },
                configurable: true
            });

            window.logToServer = makeNative(() => false, 'logToServer');
            window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

            // Mrożenie widoczności karty
            const docProto = Object.getPrototypeOf(document);
            Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });

            // Blokowanie zdarzeń wyjścia
            window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('focusout', (e) => e.stopImmediatePropagation(), true);
        } catch (e) { }
    };

    // 2. BYPASS UCZCIWEGO ROZWIĄZUJĄCEGO (Honest Respondent Killer)
    const bypassHonesty = () => {
        try {
            if (window.Testportal) {
                const honesty = window.Testportal.HonestRespondent;
                if (honesty) {
                    honesty.isHonest = () => true;
                    honesty.validate = () => true;
                    honesty.sendPulse = () => true;
                    Object.defineProperty(honesty, 'isHonest', { get: () => () => true });
                }

                if (window.Testportal.Log) {
                    window.Testportal.Log.enqueue = () => true;
                    window.Testportal.Log.send = () => true;
                }

                if (window.Testportal.Config) {
                    window.Testportal.Config.isFocusTrackingEnabled = false;
                    window.Testportal.Config.loseFocusNotification = false;
                    window.Testportal.Config.isTimeLimitEnabled = false; // Próba wyłączenia limitu
                }
            }
        } catch (e) { }
    };

    // 3. TIME WARP (Mrożenie i manipulacja czasem)
    const timeWarp = () => {
        try {
            // Testportal liczy czas pytania od window.startTime
            // Ciągłe resetowanie startTime sprawia, że zegar pytania stoi w miejscu
            if (typeof window.startTime !== 'undefined') {
                setInterval(() => {
                    window.startTime = Date.now();
                }, 1000);
            }

            // Blokowanie automatycznego wysyłania testu po czasie (client-side)
            window.remainingTime = 9999;
            window.testTypeTimeLimit = 0;

            // Jeśli zegar jest w obiekcie Testportal.Timer
            if (window.Testportal && window.Testportal.Timer) {
                window.Testportal.Timer.stop = () => true;
                window.Testportal.Timer.remainingTime = 3600; // Ustawienie godziny zapasu
            }
        } catch (e) { }
    };

    // 4. NETWORK PROTECTION (Ghost Mode)
    const forbidden = ['cheat', 'focus', 'blur', 'trace', 'logger', 'honest', 'detection', 'cheat-detection'];
    const isBad = (u) => typeof u === 'string' && forbidden.some(p => u.toLowerCase().includes(p));

    const _sendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = makeNative(function (url, data) {
        if (isBad(url)) return true;
        return _sendBeacon.apply(this, arguments);
    }, 'sendBeacon');

    const _fetch = window.fetch;
    window.fetch = makeNative(function (url, init) {
        if (isBad(url)) return Promise.resolve(new Response('{"status":"ok","remainingTime":3600}'));
        return _fetch.apply(this, arguments);
    }, 'fetch');

    // 5. MODAL KILLER (Eliminacja powiadomień)
    const modalKiller = () => {
        const keywords = ['rozumiem', 'poinformowany', 'opuszczeniu', 'informacja', 'ok', 'understand', 'acknowledge'];
        document.querySelectorAll('button, div, span, a').forEach(el => {
            const text = (el.innerText || "").toLowerCase();
            if (keywords.some(k => text.includes(k))) {
                if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.classList.contains('mdc-button')) {
                    el.click();
                }
            }
        });

        const overlays = document.querySelectorAll('.mdc-dialog, .mdc-dialog__scrim, [class*="modal"], [class*="backdrop"]');
        overlays.forEach(o => o.remove());
        document.body.classList.remove('mdc-dialog-scroll-lock', 'modal-open');
        document.documentElement.style.overflow = 'auto';
    };

    // 6. AI & SEARCH HELPER
    const setupAI = () => {
        document.querySelectorAll('.question-content, .answer-text, p, span, h2, .question_essence').forEach(el => {
            if (el.innerText && el.innerText.trim().length > 5 && !el.hasAttribute('data-v4')) {
                el.setAttribute('data-v4', 'true');
                el.style.cursor = 'help';
                el.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const text = el.innerText.trim().replace(/\s+/g, ' ');
                        const url = e.ctrlKey
                            ? `https://www.google.com/search?q=${encodeURIComponent(text)}`
                            : `https://www.perplexity.ai/search?q=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                    }
                });
            }
        });
        bypassHonesty();
        timeWarp(); // Aktywacja pętli czasowej
        modalKiller();
    };

    // START
    console.clear();
    console.log("%c 🦍 SHIELD ULTRA v4.8.0 - TIME WARP ACTIVATED 🦍 ", "color: #8b5cf6; font-weight: bold; background: #000; padding: 15px; border: 3px solid #8b5cf6; border-radius: 8px;");

    initAntiTamper();
    setInterval(setupAI, 500);
    new MutationObserver(setupAI).observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('error', (e) => { e.preventDefault(); }, true);

})();