// BACKGROUND SERVICE WORKER v5.5.1 - FIX SYNTAX ERROR
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

// 1. RDZEŃ STEALTH (Wstrzykiwany jako string)
const CORE_BYPASS = `
(function() {
    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => "function " + (name || "") + "() { [native code] }";
        return wrapped;
    };

    try {
        window.logToServer = makeNative(() => false, 'logToServer');
        window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

        // ReferenceError Trick
        Object.defineProperty(document, 'hasFocus', {
            get: () => { throw new ReferenceError("antiTestportalFeature"); },
            configurable: true
        });

        const docProto = Object.getPrototypeOf(document);
        Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: true });
        Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: true });

        const stop = (e) => e.stopImmediatePropagation();
        window.addEventListener('blur', stop, true);
        window.addEventListener('visibilitychange', stop, true);
        window.addEventListener('mouseleave', stop, true);

        console.log("[Shield] Core Stealth Active.");
    } catch(e) {}
})();
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "INIT_SHIELD" && sender.tab) {
        // Wstrzykiwanie rdzenia
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

        // Pobieranie silnika
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
            })
            .catch(err => console.error("[Background] Fetch error:", err));

        sendResponse({ success: true });
    }
});

// Auto-recovery
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes('DspUnsupportedBrowserPlugins.html')) {
        chrome.tabs.goBack(tabId).catch(() => { });
    }
});
