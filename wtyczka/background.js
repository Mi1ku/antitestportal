// BACKGROUND SERVICE WORKER v5.7.0 - ULTIMATE STEALTH & NETWORK BLACKOUT
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

// RDZEŃ STEALTH (Blokada wszystkiego co wysyła dane o wyjściu)
const CORE_BYPASS = `
(function() {
    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => "function " + (name || "") + "() { [native code] }";
        return wrapped;
    };

    const isBad = (url) => {
        const s = String(url).toLowerCase();
        return s.includes('cheat') || s.includes('focus') || s.includes('trace') || 
               s.includes('honest') || s.includes('log') || s.includes('event') || 
               s.includes('telemetry') || s.includes('monitor');
    };

    // 1. BLOKADA SIECIOWA (FETCH, BEACON, XHR)
    const _fetch = window.fetch;
    window.fetch = makeNative(function(url, options) {
        if (isBad(url)) return Promise.resolve(new Response(JSON.stringify({ status: "ok", success: true })));
        return _fetch.apply(this, arguments);
    }, 'fetch');

    const _sendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = makeNative(function(url, data) {
        if (isBad(url)) return true;
        return _sendBeacon.apply(this, arguments);
    }, 'sendBeacon');

    const _xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = makeNative(function(m, url) {
        this._isBad = isBad(url);
        return _xhrOpen.apply(this, arguments);
    }, 'open');

    const _xhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = makeNative(function() {
        if (this._isBad) {
            Object.defineProperty(this, 'readyState', { value: 4 });
            Object.defineProperty(this, 'status', { value: 200 });
            this.dispatchEvent(new Event('load'));
            return;
        }
        return _xhrSend.apply(this, arguments);
    }, 'send');

    // 2. FOCUS STEALTH (Always True + Native Mask)
    try {
        const docProto = Object.getPrototypeOf(document);
        Object.defineProperty(docProto, 'hasFocus', {
            value: makeNative(() => true, 'hasFocus'),
            writable: false, configurable: false
        });
        Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: false });
        Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: false });
        
        window.logToServer = makeNative(() => false, 'logToServer');
        window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

        // Blokada listenerów onblur/onfocus
        window.onblur = null;
        window.onfocus = null;
        document.onvisibilitychange = null;
    } catch(e) {}

    console.log("[Shield Core] Blackout System Active.");
})();
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "INIT_SHIELD" && sender.tab) {
        // Wstrzykujemy rdzeń blokujący telemetrię
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
            world: "MAIN",
            func: (code) => {
                const script = document.createElement('script');
                script.textContent = code;
                (document.documentElement || document.head).appendChild(script);
                script.remove();
            },
            args: [CORE_BYPASS]
        });

        // Pobieramy silnik i wstrzykujemy aktualny stan przełącznika czasu
        chrome.storage.local.get(['shield_time_freeze'], (res) => {
            const freezeEnabled = res.shield_time_freeze !== false; // Domyślnie true

            fetch(GITHUB_RAW_URL + "?ts=" + Date.now(), { cache: "no-store" })
                .then(r => r.text())
                .then(code => {
                    chrome.scripting.executeScript({
                        target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
                        world: "MAIN",
                        func: (engineCode, freeze) => {
                            window.SHIELD_TIME_FREEZE = freeze;
                            const script = document.createElement('script');
                            script.textContent = engineCode;
                            (document.documentElement || document.head).appendChild(script);
                            script.remove();
                        },
                        args: [code, freezeEnabled]
                    });
                });
        });
        sendResponse({ success: true });
    }
});
