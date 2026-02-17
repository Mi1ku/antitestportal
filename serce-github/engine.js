/**
 * ANTITESTPORTAL ULTRA v5.0.1 - PRO EDITION
 * Fixes: Stealth Focus, Telemetry Block, Advanced Time Warp
 */
(function () {
    const VERSION = "5.0.1";
    window.SHIELD_TIME_FREEZE = true;

    // 1. BLOKADA TELEMETRII (Zatrzymujemy wysyłanie "Prób" do serwera)
    const initNetworkBlock = () => {
        const _sendBeacon = navigator.sendBeacon;
        navigator.sendBeacon = function (url, data) {
            if (url.includes('cheat') || url.includes('focus') || url.includes('trace')) {
                console.log("[Shield] Zablokowano próbę wysłania raportu focusu.");
                return true; // Udajemy, że wysłano
            }
            return _sendBeacon.apply(this, arguments);
        };

        const _fetch = window.fetch;
        window.fetch = function (url, options) {
            const urlStr = String(url);
            if (urlStr.includes('cheat') || urlStr.includes('focus')) {
                return Promise.resolve(new Response(JSON.stringify({ status: "ok" })));
            }
            return _fetch.apply(this, arguments);
        };
    };

    // 2. BYPASS UCZCIWOŚCI
    const bypassHonesty = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                h.isHonest = () => true;
                Object.defineProperty(h, 'isHonest', { get: () => () => true });
            }
        } catch (e) { }
    };

    // 3. TIME WARP
    const timeWarp = () => {
        if (window.SHIELD_TIME_FREEZE && typeof window.startTime !== 'undefined') {
            window.startTime = Date.now();
        }
    };

    // 4. SUPREME AI & SEARCH
    const setupAI = () => {
        const selectors = ['.question-content', '.answer-text', '.question_essence', 'label', 'p', 'span'];
        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            if (el.innerText && el.innerText.trim().length > 2 && !el.hasAttribute('data-shield')) {
                el.setAttribute('data-shield', 'true');
                el.style.cursor = 'help';
                el.addEventListener('mousedown', (e) => {
                    if (e.ctrlKey || e.altKey) {
                        e.preventDefault();
                        const text = el.innerText.trim();
                        const url = e.ctrlKey
                            ? `https://www.google.com/search?q=${encodeURIComponent(text)}`
                            : `https://www.perplexity.ai/search?q=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                    }
                }, true);
            }
        });
        timeWarp();
    };

    const addIndicator = () => {
        if (document.getElementById('shield-indicator')) return;
        const div = document.createElement('div');
        div.id = 'shield-indicator';
        div.innerHTML = `🛡️ AntiTestportal Ultra v${VERSION} Active`;
        div.setAttribute('style', `
            position: fixed; bottom: 10px; right: 10px; background: rgba(139, 92, 246, 0.9);
            color: white; padding: 5px 12px; border-radius: 20px; font-size: 10px; z-index: 999999;
            backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2); pointer-events: none;
        `);
        document.documentElement.appendChild(div);
    };

    console.clear();
    console.log("%c 🦍 ANTITESTPORTAL ULTRA v" + VERSION + " 🦍 ", "color: #b983ff; font-weight: bold; font-size: 16px;");

    initNetworkBlock();
    addIndicator();
    setInterval(setupAI, 1000);
    window.addEventListener('error', e => e.preventDefault(), true);
})();