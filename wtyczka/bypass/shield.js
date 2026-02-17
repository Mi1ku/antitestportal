(function () {
    // SHIELD LOADER v4.5.0 - DUAL-LAYER INJECTION
    console.log("[Shield] Aktywacja warstw ochronnych...");

    // WARSTWA 1: INSTANT LOCAL BYPASS (Core)
    // Wstrzykujemy krytyczne blokady bezpośrednio z pliku wtyczki
    try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('bypass/core.js');
        (document.head || document.documentElement).appendChild(script);
        script.onload = () => script.remove();
    } catch (e) {
        console.error("[Shield Error] Nie udało się wstrzyknąć rdzenia.");
    }

    // WARSTWA 2: DYNAMIC ENGINE (GitHub Sync)
    // Pobieramy zaawansowaną logikę i UI z chmury
    chrome.runtime.sendMessage({ type: "FETCH_ENGINE" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
            console.warn("[Shield] Błąd chmury. Działam na samym rdzeniu.");
            return;
        }

        console.log("[Shield] Silnik zsynchronizowany. Aktywacja modułów premium.");

        try {
            const engineScript = document.createElement('script');
            engineScript.textContent = response.code;
            (document.head || document.documentElement).appendChild(engineScript);
            engineScript.remove();
        } catch (e) {
            console.error("[Shield Error] Błąd inicjalizacji silnika dynamicznego.");
        }
    });

    // AUTO-BACK DLA STRONY BŁĘDU
    if (window.location.href.includes('DspUnsupportedBrowserPlugins.html')) {
        window.history.back();
    }
})();