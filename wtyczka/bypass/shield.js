(function () {
    // ANTI-TESTPORTAL ULTRA LOADER v5.5.0 "THE BRUTE"
    // To jest jedyny sposób na pokonanie ich skanera: Wstrzykiwanie natychmiastowe.

    console.log("[Shield] Próba neutralizacji systemów detekcji...");

    // 1. WCZYTUJEMY RDZEŃ LOKALNY NATYCHMIAST (Bez sprawdzania URL, wszędzie)
    try {
        const coreScript = document.createElement('script');
        coreScript.src = chrome.runtime.getURL('bypass/core.js');
        // Wstrzykujemy do DOCUMENT ELEMENT bo HEAD może jeszcze nie istnieć
        (document.documentElement || document.head).appendChild(coreScript);
        coreScript.onload = () => coreScript.remove();
    } catch (e) {
        console.error("[Shield Error] Błąd krytyczny rdzenia.");
    }

    // 2. SPRAWDZAMY CZY TO STRONA TESTU (Dla silnika zdalnego)
    const isTestPage = () => {
        const url = window.location.href;
        return url.includes('/test/') || url.includes('/exam/') ||
            url.includes('/start/') || url.includes('test.html') ||
            document.querySelector('.question-container, .timer') !== null;
    };

    if (isTestPage()) {
        chrome.runtime.sendMessage({ type: "FETCH_ENGINE" }, (fetchResponse) => {
            if (chrome.runtime.lastError || !fetchResponse || !fetchResponse.success) return;
            chrome.runtime.sendMessage({ type: "INJECT_ENGINE", code: fetchResponse.code });
        });
    }
})();