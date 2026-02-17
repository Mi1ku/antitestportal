(function () {
    /**
     * SHIELD ULTRA ENTERPRISE v4.5.0 - THE ULTIMATE BYPASS
     * Combining Nuclear Engine with ReferenceError Focus-Kill
     */

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // 1. ZABÓJCA FOCUS LOSS (GŁĘBOKIE OŚLEPIENIE)
    const blindDetection = () => {
        try {
            // Trik ReferenceError - wywala skrypt Testportalu, gdy pyta o fokus
            Object.defineProperty(document, 'hasFocus', {
                get: () => { throw new ReferenceError("ShieldFocusGuard"); },
                configurable: true
            });

            // Wyłączamy logowanie na serwer
            window.logToServer = makeNative(() => false, 'logToServer');
            window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

            // Mrożenie stanów
            const docProto = Object.getPrototypeOf(document);
            Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });
        } catch (e) { }
    };

    // 2. BLOKADA "UCZCIWEGO ROZWIĄZUJĄCEGO" (Honest Respondent Killer)
    const killHonesty = () => {
        try {
            if (window.Testportal) {
                if (window.Testportal.Log) {
                    window.Testportal.Log.enqueue = makeNative(() => true, 'enqueue');
                    window.Testportal.Log.send = makeNative(() => true, 'send');
                    window.Testportal.Log.sendCheat = makeNative(() => true, 'sendCheat');
                }
                if (window.Testportal.Config) {
                    window.Testportal.Config.isFocusTrackingEnabled = false;
                    window.Testportal.Config.loseFocusNotification = false;
                }
                if (window.Testportal.HonestRespondent) {
                    window.Testportal.HonestRespondent.isHonest = () => true;
                    window.Testportal.HonestRespondent.validate = () => true;
                }
            }
        } catch (e) { }
    };

    // 3. NETWORK FILTER (XHR/Fetch Proxy)
    const forbidden = ['cheat', 'focus', 'blur', 'trace', 'logger', 'honest', 'detection'];
    const isBad = (u) => typeof u === 'string' && forbidden.some(p => u.toLowerCase().includes(p));

    const _sendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = makeNative(function (url, data) {
        if (isBad(url)) return true;
        return _sendBeacon.apply(this, arguments);
    }, 'sendBeacon');

    const _fetch = window.fetch;
    window.fetch = makeNative(function (url, init) {
        if (isBad(url)) return Promise.resolve(new Response('{"status":"ok"}'));
        return _fetch.apply(this, arguments);
    }, 'fetch');

    // 4. AUTO-CLICKER (Rozumiem)
    const modalKiller = () => {
        const keywords = ['rozumiem', 'poinformowany', 'opuszczeniu', 'informacja'];
        document.querySelectorAll('button, div, span').forEach(el => {
            const text = (el.innerText || "").toLowerCase();
            if (keywords.some(k => text.includes(k))) {
                if (el.tagName === 'BUTTON') el.click();
                if (el.classList.contains('modal') || el.classList.contains('backdrop')) el.remove();
            }
        });
        document.body.classList.remove('modal-open');
    };

    // 5. HELPERY (SZYBKIE SZUKANIE)
    const setupUI = () => {
        document.querySelectorAll('.question-content, .answer-text, p, span, h2').forEach(el => {
            if (el.innerText && el.innerText.trim().length > 5 && !el.hasAttribute('data-v4')) {
                el.setAttribute('data-v4', 'true');
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
        killHonesty();
        modalKiller();
    };

    // BLOKADA BŁĘDÓW (Ciche działanie)
    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('ShieldFocusGuard')) {
            e.preventDefault(); // Ukrywamy nasz celowy ReferenceError
        }
    }, true);

    // START
    console.clear();
    console.log("%c 🦍 SHIELD ULTRA v4.5.0 - ULTIMATE BYPASS LOADED 🦍 ", "color: #22c55e; font-weight: bold; background: #000; padding: 15px; border: 3px solid #22c55e; border-radius: 8px;");

    blindDetection();
    setInterval(setupUI, 500);
    new MutationObserver(setupUI).observe(document.documentElement, { childList: true, subtree: true });

})();