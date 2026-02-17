// BACKGROUND SERVICE WORKER v5.2.0 - PRO INJECTION ENGINE
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/engine.js";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FETCH_ENGINE") {
        fetch(GITHUB_RAW_URL + `?ts=${Date.now()}`, { cache: "no-store" })
            .then(response => response.text())
            .then(code => {
                sendResponse({ success: true, code: code });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }

    if (request.type === "INJECT_ENGINE" && sender.tab) {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id, frameIds: [sender.frameId] },
            world: "MAIN",
            func: (code) => {
                try {
                    const script = document.createElement('script');
                    script.textContent = code;
                    (document.head || document.documentElement).appendChild(script);
                    script.remove();
                } catch (e) { }
            },
            args: [request.code]
        }).then(() => {
            sendResponse({ success: true });
        }).catch(err => {
            sendResponse({ success: false, error: err.message });
        });
        return true;
    }
});

// Usunięto problematyczny auto-redirect powodujący pętle na stronie głównej
