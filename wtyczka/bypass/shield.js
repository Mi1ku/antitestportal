(function () {
    // SHIELD LOADER v5.1.0 - SMART ACTIVATION

    // Funkcja sprawdzająca czy jesteśmy na właściwej stronie testu
    const isTestPage = () => {
        const url = window.location.href;
        const isExam = url.includes('/test/') ||
            url.includes('/exam/') ||
            url.includes('/start/') ||
            url.includes('test.html');

        // Dodatkowe sprawdzenie po elementach DOM (na wypadek dziwnych URLi)
        const hasTestElements = document.querySelector('.question-container, .timer, .question_essence, #start-test-button, .question-content') !== null;

        return isExam || hasTestElements;
    };

    if (!isTestPage()) {
        // Na głównej stronie lub dashboardzie nic nie robimy, żeby uniknąć błędów i pętli
        return;
    }

    console.log("[Shield] Wykryto stronę egzaminu. Aktywacja warstw ochronnych...");

    // 1. WCZYTUJEMY RDZEŃ LOKALNY
    try {
        const coreScript = document.createElement('script');
        coreScript.src = chrome.runtime.getURL('bypass/core.js');
        (document.head || document.documentElement).appendChild(coreScript);
        coreScript.onload = () => coreScript.remove();
    } catch (e) { }

    // 2. POBIERAMY SILNIK Z CHMURY
    chrome.runtime.sendMessage({ type: "FETCH_ENGINE" }, (fetchResponse) => {
        if (chrome.runtime.lastError || !fetchResponse || !fetchResponse.success) return;

        chrome.runtime.sendMessage({
            type: "INJECT_ENGINE",
            code: fetchResponse.code
        });
    });
})();