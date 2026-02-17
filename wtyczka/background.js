// BACKGROUND SERVICE WORKER v5.6.1 - ULTIMATE FIX
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

const CORE_BYPASS = `
(function() {
    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => "function " + (name || "") + "() { [native code] }";
        return wrapped;
    };

    // 1. NETWORK BLACKOUT (Absolutna blokada telemetrii)
    const isBad = (url) => {
        const s = String(url).toLowerCase();
        return s.includes('cheat') || s.includes('focus') || s.includes('trace') || 
               s.includes('honest') || s.includes('log') || s.includes('event') || s.includes('telemetry');
    };

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

    // 2. REFERENCE ERROR TRICK (To co działało najlepiej)
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: () => { throw new ReferenceError("antiTestportalFeature"); },
            configurable: true
        });

        const docProto = Object.getPrototypeOf(document);
        Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: true });
        Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: true });
        
        window.logToServer = makeNative(() => false, 'logToServer');
        window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

        // Blokada listenerów
        const stop = (e) => e.stopImmediatePropagation();
        window.addEventListener('blur', stop, true);
        window.addEventListener('visibilitychange', stop, true);
        window.addEventListener('mouseleave', stop, true);
    } catch(e) {}

    console.log("[Shield Core] v5.6.1 Ready.");
})();
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "INIT_SHIELD" && sender.tab) {
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

        fetch(GITHUB_RAW_URL + "?ts=" + Date.now(), { cache: "no-store" })
            .then(r => r.text())
            .then(code => {
                chrome.scripting.executeScript({
                    target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
                    world: "MAIN",
                    func: (engineCode) => {
                        const script = document.createElement('script');
                        script.textContent = engineCode;
                        (document.documentElement || document.head).appendChild(script);
                        script.remove();
                    },
                    args: [code]
                });
            });
        sendResponse({ success: true });
    }
});
