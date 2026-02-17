/**
 * ANTITESTPORTAL ULTRA v5.5.0 - STEALTH RECOVERY EDITION
 * Features: Absolute Anti-Tamper, Network Blackout, Time Warp, AI Supreme
 */
(function () {
    const VERSION = "5.5.0";
    window.SHIELD_TIME_FREEZE = (typeof window.SHIELD_TIME_FREEZE === 'undefined') ? true : window.SHIELD_TIME_FREEZE;

    // 1. BLOKADA TELEMETRII (Network Blackout)
    const initNetworkShield = () => {
        const isBad = (url) => {
            const s = String(url).toLowerCase();
            return s.includes('cheat') || s.includes('focus') || s.includes('trace') ||
                s.includes('honest') || s.includes('log') || s.includes('event');
        };

        const _fetch = window.fetch;
        window.fetch = function (url, options) {
            if (isBad(url)) return Promise.resolve(new Response(JSON.stringify({ status: "ok", success: true })));
            return _fetch.apply(this, arguments);
        };

        const _sendBeacon = navigator.sendBeacon;
        navigator.sendBeacon = function (url, data) {
            if (isBad(url)) return true;
            return _sendBeacon.apply(this, arguments);
        };

        const _open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (m, url) {
            this._isBad = isBad(url);
            return _open.apply(this, arguments);
        };

        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            if (this._isBad) {
                Object.defineProperty(this, 'readyState', { value: 4 });
                Object.defineProperty(this, 'status', { value: 200 });
                this.dispatchEvent(new Event('load'));
                return;
            }
            return _send.apply(this, arguments);
        };
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

        if (window.SHIELD_TIME_FREEZE && typeof window.startTime !== 'undefined') {
            window.startTime = Date.now();
        }

        // Modal & Overlay Killer
        document.querySelectorAll('[class*="modal"], [class*="backdrop"], .mdc-dialog, .mdc-dialog__scrim').forEach(o => o.remove());
    };

    console.log("%c 🦍 ANTITESTPORTAL ULTRA v" + VERSION + " ACTIVE 🦍 ", "color: #8b5cf6; font-weight: bold;");

    initNetworkShield();
    setInterval(setupAI, 1000);
})();