// BACKGROUND SERVICE WORKER v5.4.0 - SILENT INJECTOR
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

// Funkcja sprawdzająca czy to sekcja testu
const isTestUrl = (url) => {
    return url.includes('testportal.pl/test/') ||
        url.includes('testportal.pl/exam/') ||
        url.includes('testportal.pl/start/');
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 1. AUTO-INJECTION DLA TESTÓW
    if (changeInfo.status === 'complete' && tab.url && isTestUrl(tab.url)) {
        console.log("[Background] Wykryto test na karcie " + tabId + ". Inicjalizacja silnika...");

        fetch(GITHUB_RAW_URL + `?ts=${Date.now()}`, { cache: "no-store" })
            .then(r => r.text())
            .then(code => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    world: "MAIN",
                    func: (engineCode) => {
                        try {
                            const script = document.createElement('script');
                            script.textContent = engineCode;
                            (document.documentElement || document.head).appendChild(script);
                            script.remove();
                            console.log("[Shield] Silnik odpalony pomyślnie.");
                        } catch (e) { }
                    },
                    args: [code]
                });
            })
            .catch(err => console.error("[Background] Błąd pobierania silnika: " + err.message));
    }

    // 2. ANTI-REDIRECT SYSTEM (Jeśli nas wykryje mimo wszystko)
    if (changeInfo.url && changeInfo.url.includes('DspUnsupportedBrowserPlugins.html')) {
        chrome.tabs.goBack(tabId).catch(() => {
            const originalUrl = changeInfo.url.split('/DspUnsupportedBrowserPlugins.html')[0];
            if (originalUrl.includes('testportal')) {
                chrome.tabs.update(tabId, { url: originalUrl });
            }
        });
    }
});
