// BACKGROUND SERVICE WORKER v5.8.0 - GHOST RECOVERY
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

// RDZEŃ STEALTH - ZERO TRACELOGS, ZERO SIGNATURES
const CORE_BYPASS = `
(function() {
    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => "function " + (n || "") + "() { [native code] }";
        return w;
    };

    const isB = (u) => {
        const s = String(u).toLowerCase();
        return s.includes('cheat') || s.includes('focus') || s.includes('trace') || 
               s.includes('honest') || s.includes('log') || s.includes('event') || 
               s.includes('monitor') || s.includes('plugin') || s.includes('detect');
    };

    // Przechwytywanie telemetrii (Fetch/Beacon/XHR)
    const _f = window.fetch;
    window.fetch = _c(function(u, o) {
        if (isB(u)) return Promise.resolve(new Response(JSON.stringify({ status: "ok" })));
        return _f.apply(this, arguments);
    }, 'fetch');

    const _b = navigator.sendBeacon;
    navigator.sendBeacon = _c(function(u, d) {
        if (isB(u)) return true;
        return _b.apply(this, arguments);
    }, 'sendBeacon');

    const _o = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = _c(function(m, u) {
        this._b = isB(u);
        return _o.apply(this, arguments);
    }, 'open');

    const _s = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = _c(function() {
        if (this._b) {
            Object.defineProperty(this, 'status', { value: 200 });
            Object.defineProperty(this, 'readyState', { value: 4 });
            this.dispatchEvent(new Event('load'));
            return;
        }
        return _s.apply(this, arguments);
    }, 'send');

    // Spoofing focusu i widoczności
    try {
        const p = Object.getPrototypeOf(document);
        Object.defineProperty(p, 'hasFocus', { value: _c(() => true, 'hasFocus'), configurable: false });
        Object.defineProperty(p, 'visibilityState', { get: _c(() => 'visible', 'get visibilityState'), configurable: false });
        Object.defineProperty(p, 'hidden', { get: _c(() => false, 'get hidden'), configurable: false });
        
        window.onblur = null;
        window.onfocus = null;
        document.onvisibilitychange = null;
    } catch(e) {}
})();
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "INIT_SHIELD" && sender.tab) {
        // Wstrzykujemy rdzeń
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
            world: "MAIN",
            func: (code) => {
                const s = document.createElement('script');
                s.textContent = code;
                (document.documentElement || document.head).appendChild(s);
                s.remove();
            },
            args: [CORE_BYPASS]
        });

        // Pobieramy silnik
        chrome.storage.local.get(['shield_time_freeze'], (res) => {
            const freeze = res.shield_time_freeze !== false;
            fetch(GITHUB_RAW_URL + "?ts=" + Date.now(), { cache: "no-store" })
                .then(r => r.text())
                .then(code => {
                    chrome.scripting.executeScript({
                        target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
                        world: "MAIN",
                        func: (c, f) => {
                            window.__tp_freeze__ = f;
                            const s = document.createElement('script');
                            s.textContent = c;
                            (document.documentElement || document.head).appendChild(s);
                            s.remove();
                        },
                        args: [code, freeze]
                    });
                });
        });
        sendResponse({ success: true });
    }
});

// Auto-recovery - powrót ze strony błędu
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes('DspUnsupportedBrowserPlugins.html')) {
        chrome.tabs.goBack(tabId).catch(() => { });
    }
});
