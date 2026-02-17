/**
 * ANTITESTPORTAL ULTRA v5.0.0 - PRO EDITION
 * Features: Absolute Anti-Tamper, Honest Bypass, Time Warp, AI Supreme
 */
(function () {
    const VERSION = "5.0.0";
    window.SHIELD_TIME_FREEZE = true; // Domyślnie włączone

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // 1. ZABÓJCA FOCUS LOSS (Anti-Tamper)
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
                    window.Testportal.Config.isTimeLimitEnabled = false;
                }
            }
        } catch (e) { }
    };

    // 3. TIME WARP (Zintegrowane sterowanie z UI)
    const timeWarp = () => {
        try {
            if (window.SHIELD_TIME_FREEZE && typeof window.startTime !== 'undefined') {
                // Resetujemy startTime tylko jeśli freeze jest włączony w UI
                window.startTime = Date.now();
            }
            if (window.Testportal && window.Testportal.Timer && window.SHIELD_TIME_FREEZE) {
                window.Testportal.Timer.stop = () => true;
                window.remainingTime = 9999;
            }
        } catch (e) { }
    };

    // 4. SUPREME AI & SEARCH
    const setupAI = () => {
        const selectors = [
            '.question-content', '.answer-text', '.question_essence',
            '.question-container p', '.question-container span',
            'label', 'h2', 'h1', '.mdc-form-field'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            if (el.innerText && el.innerText.trim().length > 2 && !el.hasAttribute('data-shield')) {
                el.setAttribute('data-shield', 'true');
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
    };

    // 5. WIZUALNY INDYKATOR
    const addIndicator = () => {
        if (document.getElementById('shield-indicator')) return;
        const div = document.createElement('div');
        div.id = 'shield-indicator';
        div.innerHTML = `🛡️ AntiTestportal Ultra v${VERSION} Active`;
        div.setAttribute('style', `
            position: fixed; bottom: 10px; right: 10px; background: rgba(139, 92, 246, 0.8);
            color: white; padding: 5px 12px; border-radius: 20px; font-size: 10px;
            z-index: 999999; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2);
            pointer-events: none; opacity: 0.8;
        `);
        document.documentElement.appendChild(div);
    };

    console.clear();
    console.log("%c 🦍 ANTITESTPORTAL ULTRA v" + VERSION + " ACTIVATED 🦍 ", "color: #8b5cf6; font-weight: bold; background: #000; padding: 15px; border: 3px solid #8b5cf6; border-radius: 8px;");

    initAntiTamper();
    addIndicator();
    setInterval(setupAI, 1000);
    window.addEventListener('error', (e) => { e.preventDefault(); }, true);
})();