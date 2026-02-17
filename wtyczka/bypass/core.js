/**
 * SHIELD CORE v1.0.0 - INSTANT BYPASS
 * This script is injected directly into the page world to override global functions.
 */
(function () {
    console.log("[Shield Core] Inicjalizacja krytycznych blokad...");

    // 1. ZABÓJCA FOCUS LOSS (ReferenceError Trick)
    // To sprawia, że skrypt Testportalu śledzący fokus "wywala się" przy starcie.
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: () => { throw new ReferenceError("antiTestportalFeature"); },
            configurable: true
        });
    } catch (e) { }

    // 2. BLOKADA LOGOWANIA NA SERWER
    window.logToServer = () => false;
    window.sendCheatInfo = () => false;

    // 3. MROŻENIE WIDOCZNOŚCI
    try {
        const docProto = Object.getPrototypeOf(document);
        Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });
    } catch (e) { }

    // 4. GLOBALNY BLOKER BŁĘDÓW (z testportal-gpt)
    // Zapobiega wyświetlaniu komunikatów o błędach fokusu przez system.
    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('antiTestportalFeature')) {
            e.preventDefault();
            return true;
        }
    }, true);

    console.log("[Shield Core] Blokady aktywne. System niewykrywalny.");
})();
