/**
 * SHIELD ULTRA ENTERPRISE v4.9.0 - THE ULTIMATE BYPASS & SUPREME SEARCH
 * Features: Absolute Anti-Tamper, Honest Bypass, Time Distortion, AI Magic
 */
(function () {
    const SHIELD_VERSION = "4.9.0";

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // 1. ZABÓJCA FOCUS LOSS (ReferenceError Trick)
    const initAntiTamper = () => {
        try {
            Object.defineProperty(document, 'hasFocus', {
                get: () => { throw new ReferenceError("antiTestportalFeature"); },
                configurable: true
            });
            window.logToServer = makeNative(() => false, 'logToServer');
            window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');
            const docProto = Object.getPrototypeOf(document);
            Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });
        } catch (e) { }
    };

    // 2. BYPASS UCZCIWEGO ROZWIĄZUJĄCEGO
    const bypassHonesty = () => {
        try {
            if (window.Testportal) {
                const honesty = window.Testportal.HonestRespondent;
                if (honesty) {
                    honesty.isHonest = () => true;
                    honesty.validate = () => true;
                    Object.defineProperty(honesty, 'isHonest', { get: () => () => true });
                }
                if (window.Testportal.Config) {
                    window.Testportal.Config.isFocusTrackingEnabled = false;
                    window.Testportal.Config.loseFocusNotification = false;
                }
            }
        } catch (e) { }
    };

    // 3. TIME WARP
    const timeWarp = () => {
        try {
            if (typeof window.startTime !== 'undefined') {
                window.startTime = Date.now() + 3600000; // Dodajemy godzinę zapasu
            }
            if (window.Testportal && window.Testportal.Timer) {
                window.Testportal.Timer.stop = () => true;
            }
        } catch (e) { }
    };

    // 4. SUPREME AI & SEARCH (Now with more selectors)
    const setupAI = () => {
        // Bardziej agresywne selektory dla Testportalu
        const selectors = [
            '.question-content', '.answer-text', '.question_essence',
            '.question-container p', '.question-container span',
            'label', 'h2', 'h1', '.mdc-form-field'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            if (el.innerText && el.innerText.trim().length > 2 && !el.hasAttribute('data-shield')) {
                el.setAttribute('data-shield', 'true');
                el.style.transition = 'all 0.2s';

                // Wizualne potwierdzenie, że element jest "obsłużony" (subtelna zmiana kursora)
                el.style.cursor = 'help';

                el.addEventListener('mousedown', (e) => {
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        e.stopPropagation();

                        const text = el.innerText.trim().replace(/\s+/g, ' ');
                        const url = e.ctrlKey
                            ? `https://www.google.com/search?q=${encodeURIComponent(text)}`
                            : `https://www.perplexity.ai/search?q=${encodeURIComponent(text)}`;

                        window.open(url, '_blank');
                    }
                }, true);
            }
        });

        bypassHonesty();
        timeWarp();

        // Modal Killer
        document.querySelectorAll('.mdc-dialog, .mdc-dialog__scrim, [class*="modal"], [class*="backdrop"]').forEach(o => o.remove());
        document.body.classList.remove('mdc-dialog-scroll-lock', 'modal-open');
    };

    // 5. FLOATING INDICATOR (Potwierdzenie wizualne na stronie)
    const addIndicator = () => {
        if (document.getElementById('shield-indicator')) return;
        const div = document.createElement('div');
        div.id = 'shield-indicator';
        div.innerHTML = `🛡️ Shield Ultra v${SHIELD_VERSION} Active`;
        div.setAttribute('style', `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(139, 92, 246, 0.8);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-family: sans-serif;
            z-index: 999999;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.2);
            pointer-events: none;
            opacity: 0.7;
        `);
        document.documentElement.appendChild(div);
    };

    // INICJALIZACJA
    console.clear();
    console.log("%c 🦍 SHIELD ULTRA v" + SHIELD_VERSION + " - FULL POWER ACTIVATED 🦍 ", "color: #8b5cf6; font-weight: bold; background: #000; padding: 15px; border: 3px solid #8b5cf6; border-radius: 8px;");

    initAntiTamper();
    addIndicator();

    setInterval(setupAI, 1000);
    window.addEventListener('error', (e) => { e.preventDefault(); }, true);
})();