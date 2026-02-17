// BACKGROUND SERVICE WORKER v5.9.0 - TOTAL STEALTH
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

// RDZEŃ BYPASSU - Czysty i niewykrywalny
const CORE_BYPASS =
    "(function() {" +
    "    const makeNative = (fn, name) => {" +
    "        const wrapped = function () { return fn.apply(this, arguments); };" +
    "        Object.defineProperty(wrapped, 'name', { value: name || fn.name });" +
    "        wrapped.toString = () => 'function ' + (name || '') + '() { [native code] }';" +
    "        return wrapped;" +
    "    };" +
    "    try {" +
    "        const docProto = Object.getPrototypeOf(document);" +
    "        Object.defineProperty(docProto, 'hasFocus', {" +
    "            value: makeNative(() => true, 'hasFocus')," +
    "            writable: true, configurable: true" +
    "        });" +
    "        Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: true });" +
    "        Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: true });" +
    "        window.logToServer = makeNative(() => false, 'logToServer');" +
    "        window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');" +
    "        const stop = (e) => e.stopImmediatePropagation();" +
    "        window.addEventListener('blur', stop, true);" +
    "        window.addEventListener('visibilitychange', stop, true);" +
    "        window.addEventListener('mouseleave', stop, true);" +
    "    } catch(e) {}" +
    "})();";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "INIT_SHIELD" && sender.tab) {
        // 1. Wstrzykujemy rdzeń
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

        // 2. Pobieramy silnik z GitHuba
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

// Auto-recovery - jeśli nas wykryje mimo wszystko
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes('DspUnsupportedBrowserPlugins.html')) {
        chrome.tabs.goBack(tabId).catch(() => { });
    }
});
