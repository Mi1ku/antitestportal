(function () {
    /**
     * SHIELD ULTRA ENTERPRISE v4.6.0 - THE ULTIMATE BYPASS
     * Improved Anti-Tamper & Persistent Focus Locking
     */

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // 1. ZABÓJCA FOCUS LOSS (GŁĘBOKIE OŚLEPIENIE - ANTI-TAMPER)
    const blindDetection = () => {
        try {
            // Trik ReferenceError - wywala skrypt Testportalu, gdy pyta o fokus
            // Zmieniono na property 'hasFocus' bezpośrednio na dokumencie tak jak w dzialajacybypass
            Object.defineProperty(document, 'hasFocus', {
                get: () => { throw new ReferenceError("antiTestportalFeature"); },
                configurable: true
            });

            // Wyłączamy logowanie na serwer (z dzialajacybypass)
            window.logToServer = makeNative(() => false, 'logToServer');
            window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

            // Mrożenie stanów widoczności
            const docProto = Object.getPrototypeOf(document);
            Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });

            // Blokada zdarzeń blur/focus na poziomie okna (zabezpieczenie dodatkowe)
            window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('focusout', (e) => e.stopImmediatePropagation(), true);
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
                    // Dodatkowe zabezpieczenie prototypu
                    Object.defineProperty(window.Testportal.HonestRespondent, 'isHonest', { get: () => () => true });
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

    // 4. AUTO-CLICKER (Rozumiem / Modal Killer)
    const modalKiller = () => {
        const keywords = ['rozumiem', 'poinformowany', 'opuszczeniu', 'informacja', 'ok', 'understand'];
        document.querySelectorAll('button, div, span, a').forEach(el => {
            const text = (el.innerText || "").toLowerCase();
            if (keywords.some(k => text.includes(k))) {
                if (el.tagName === 'BUTTON' || el.tagName === 'A') el.click();
                if (el.classList.contains('modal') || el.classList.contains('backdrop')) el.remove();
            }
        });
        // Siłowe usuwanie overlayów
        const overlays = document.querySelectorAll('[class*="modal"], [class*="backdrop"], [id*="modal"]');
        overlays.forEach(o => o.remove());
        document.body.classList.remove('modal-open');
        document.documentElement.style.overflow = 'auto'; // Przywrócenie przewijania
    };

    // 5. HELPERY (SZYBKIE SZUKANIE)
    const setupUI = () => {
        document.querySelectorAll('.question-content, .answer-text, p, span, h2, label').forEach(el => {
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
        if (e.message && (e.message.includes('ShieldFocusGuard') || e.message.includes('antiTestportalFeature'))) {
            e.preventDefault();
        }
    }, true);

    // START
    console.clear();
    console.log("%c 🦍 SHIELD ULTRA v4.6.0 - RE-ENFORCED 🦍 ", "color: #8b5cf6; font-weight: bold; background: #000; padding: 15px; border: 3px solid #8b5cf6; border-radius: 8px;");

    blindDetection();
    setInterval(setupUI, 500);
    new MutationObserver(setupUI).observe(document.documentElement, { childList: true, subtree: true });

})();