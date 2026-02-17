// BACKGROUND SERVICE WORKER - CORS BYPASS ENGINE
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/rejmer-kopia/refs/heads/main/antitestportal/serce-github/engine.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FETCH_ENGINE") {
        const cacheKey = `?ts=${Date.now()}`;

        fetch(GITHUB_RAW_URL + cacheKey, { cache: "no-store" })
            .then(response => response.text())
            .then(code => {
                sendResponse({ success: true, code: code });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep message channel open for async response
    }
});

// Auto-redirect from error page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes('DspUnsupportedBrowserPlugins.html')) {
        chrome.tabs.goBack(tabId).catch(() => {
            // If goBack fails, try to reload or do nothing
        });
    }
});
