(function () {
    // SHIELD LOADER v5.0.0 - PRO INJECTION SYSTEM
    console.log("[Shield] Inicjalizacja systemu wstrzykiwania...");

    // 1. WCZYTUJEMY RDZEŃ LOKALNY
    try {
        const coreScript = document.createElement('script');
        coreScript.src = chrome.runtime.getURL('bypass/core.js');
        (document.head || document.documentElement).appendChild(coreScript);
        coreScript.onload = () => coreScript.remove();
    } catch (e) {
        console.error("[Shield Error] Rdzeń nie odnaleziony.");
    }

    // 2. POBIERAMY I WSTRZYKUJEMY SILNIK Z CHMURY (Omijamy CSP przez Background Script)
    chrome.runtime.sendMessage({ type: "FETCH_ENGINE" }, (fetchResponse) => {
        if (chrome.runtime.lastError || !fetchResponse || !fetchResponse.success) {
            console.warn("[Shield] Błąd serwera. Korzystam z lokalnego rdzenia.");
            return;
        }

        console.log("[Shield] Silnik zsynchronizowany. Przekazywanie do egzekucji...");

        // Wysyłamy kod do background, aby wstrzyknął go przez Scripting API (100% bypass CSP)
        chrome.runtime.sendMessage({
            type: "INJECT_ENGINE",
            code: fetchResponse.code
        }, (injectResponse) => {
            if (injectResponse && injectResponse.success) {
                console.log("%c [Shield] 🦍 SYSTEM SHIELD ULTRA AKTYWNY 🦍 ", "color: #8b5cf6; font-weight: bold; font-size: 14px;");
            } else {
                console.error("[Shield Error] Błąd krytyczny wstrzykiwania silnika.");
            }
        });
    });

    if (window.location.href.includes('DspUnsupportedBrowserPlugins.html')) {
        window.history.back();
    }
})();