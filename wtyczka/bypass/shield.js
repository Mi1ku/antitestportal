(function () {
    // ANTI-TESTPORTAL ULTRA LOADER v5.6.0 - SILENT TRIGGER

    // Sprawdzamy czy to strona testu
    const isTestPage = () => {
        const url = window.location.href;
        return url.includes('/test/') || url.includes('/exam/') ||
            url.includes('/start/') || url.includes('test.html') ||
            document.querySelector('.question-container, .timer') !== null;
    };

    if (isTestPage()) {
        // Wysyłamy sygnał do tła, żeby nam wstrzyknęło kod (Unikamy chrome-extension:// w DOMie)
        chrome.runtime.sendMessage({ type: "INIT_SHIELD" });
    }
})();