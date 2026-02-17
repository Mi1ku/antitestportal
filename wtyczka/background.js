// BACKGROUND SERVICE WORKER v10.0.0 - GHOST COORDINATOR
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "ACTIVATE_ULTRA_ENGINE" && sender.tab) {
        chrome.storage.local.get(['shield_time_freeze'], (res) => {
            const freeze = res.shield_time_freeze !== false;
            fetch(GITHUB_RAW_URL + "?ts=" + Date.now(), { cache: "no-store" })
                .then(r => r.text())
                .then(code => {
                    chrome.scripting.executeScript({
                        target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
                        world: "MAIN",
                        func: (engineCode, f) => {
                            window.__tp_ultra_freeze__ = f;
                            const s = document.createElement('script');
                            s.textContent = engineCode;
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

// TOTAL RECOVERY SYSTEM
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes('DspUnsupportedBrowserPlugins.html')) {
        chrome.tabs.goBack(tabId).catch(() => { });
    }
});
