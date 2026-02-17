(function () {
    // SHIELD LOADER v4.2.0 - CSP BYPASSED
    console.log("[Shield] Inicjalizacja systemu (CSP Header Strip Active)...");

    chrome.runtime.sendMessage({ type: "FETCH_ENGINE" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
            console.error("[Shield Error] Błąd pobierania silnika z tła.");
            return;
        }

        console.log("%c [Shield] Silnik pobrany. Aktywacja Ghost Mode... ", "color: #22c55e; font-weight: bold;");

        // CSP zostało usunięte przez rules.json, więc możemy wstrzyknąć kod bezpośrednio
        try {
            const script = document.createElement('script');
            script.textContent = response.code;
            (document.head || document.documentElement).appendChild(script);
            script.remove();
        } catch (e) {
            console.warn("[Shield] Próba wstrzyknięcia przez Blob (Fallback)...");
            const blob = new Blob([response.code], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const s = document.createElement('script');
            s.src = url;
            (document.head || document.documentElement).appendChild(s);
        }
    });

    // Skrót dla strony błędu
    if (window.location.href.includes('DspUnsupportedBrowserPlugins.html')) {
        window.history.back();
    }
})();