/**
 * ANTITESTPORTAL ULTRA v5.4.0 - UNBLOCKABLE ENGINE
 * Second layer of defense + Premium Features
 */
(function () {
    const VERSION = "5.4.0";
    window.SHIELD_TIME_FREEZE = (typeof window.SHIELD_TIME_FREEZE === 'undefined') ? true : window.SHIELD_TIME_FREEZE;

    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // 1. GŁĘBOKA BLOKADA SIECIOWA (Network Stealth)
    const initNetworkShield = () => {
        const isBad = (url) => {
            const s = String(url).toLowerCase();
            return s.includes('cheat') || s.includes('focus') || s.includes('trace') ||
                s.includes('honest') || s.includes('log') || s.includes('event') || s.includes('telemetry');
        };

        const _fetch = window.fetch;
        window.fetch = makeNative(function (url, options) {
            if (isBad(url)) return Promise.resolve(new Response(JSON.stringify({ status: "ok", success: true })));
            return _fetch.apply(this, arguments);
        }, 'fetch');

        const _sendBeacon = navigator.sendBeacon;
        navigator.sendBeacon = makeNative(function (url, data) {
            if (isBad(url)) return true;
            return _sendBeacon.apply(this, arguments);
        }, 'sendBeacon');

        // XHR Stealth
        const _open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = makeNative(function (m, url) {
            this._isBad = isBad(url);
            return _open.apply(this, arguments);
        }, 'open');

        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = makeNative(function () {
            if (this._isBad) {
                Object.defineProperty(this, 'readyState', { value: 4 });
                Object.defineProperty(this, 'status', { value: 200 });
                this.dispatchEvent(new Event('load'));
                return;
            }
            return _send.apply(this, arguments);
        }, 'send');
    };

    // 2. FUNKCJE AI I SZUKANIA
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

        // TIME WARP
        if (window.SHIELD_TIME_FREEZE && typeof window.startTime !== 'undefined') {
            window.startTime = Date.now();
        }
        if (window.Testportal && window.Testportal.Timer && window.SHIELD_TIME_FREEZE) {
            window.Testportal.Timer.stop = makeNative(() => true, 'stop');
            window.remainingTime = 9999;
        }

        // AUTO-KILLER MODALI
        document.querySelectorAll('[class*="modal"], [class*="backdrop"], .mdc-dialog, .mdc-dialog__scrim').forEach(o => o.remove());
    };

    // 3. BYPASS SYSTEMU TESTPORTAL
    const bypassHonesty = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                h.isHonest = makeNative(() => true, 'isHonest');
                h.validate = makeNative(() => true, 'validate');
            }
            if (window.Testportal && window.Testportal.Config) {
                window.Testportal.Config.isFocusTrackingEnabled = false;
                window.Testportal.Config.loseFocusNotification = false;
            }
        } catch (e) { }
    };

    // START
    console.log("%c 🚀 ANTITESTPORTAL ULTRA UNBLOCKABLE v" + VERSION + " ACTIVE 🚀 ", "color: #8b5cf6; font-weight: bold; font-size: 14px;");

    initNetworkShield();
    bypassHonesty();
    setInterval(setupAI, 1000);
    window.addEventListener('error', e => e.preventDefault(), true);
})();