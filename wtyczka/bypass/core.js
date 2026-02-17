/**
 * SHIELD CORE v1.2.0 - HARDENED INSTANT BYPASS
 * This script runs in the ISOLATED world but affects the MAIN world
 */
(function () {
    console.log("[Shield Core] Aktywacja TOTAL STEALTH v1.2...");

    // 1. SILNE BLOKOWANIE EVENTÓW (ISOLATED LEVEL)
    const block = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
    };

    // Blokujemy zdarzenia zanim Testportal je w ogóle zobaczy
    ['blur', 'focusout', 'visibilitychange', 'mouseleave', 'pause'].forEach(evt => {
        window.addEventListener(evt, block, true);
        document.addEventListener(evt, block, true);
    });

    // 2. WYSYŁKA DO MAIN WORLD (ZABÓJCA FOKUSU)
    // Ponieważ jesteśmy w Content Script, musimy wstrzyknąć to do MAIN, 
    // aby nadpisać document.hasFocus i inne globalne API.
    const injectToMain = () => {
        const code = `
            (function() {
                try {
                    // ReferenceError Trick
                    Object.defineProperty(document, 'hasFocus', {
                        get: () => { throw new ReferenceError("antiTestportalFeature"); },
                        configurable: true
                    });

                    // Visibility Lock
                    const docProto = Object.getPrototypeOf(document);
                    Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
                    Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });

                    // API Neutralization
                    window.logToServer = () => false;
                    window.sendCheatInfo = () => false;

                    // Mrożenie zdarzeń w MAIN WORLD
                    const stop = (e) => e.stopImmediatePropagation();
                    window.addEventListener('blur', stop, true);
                    window.addEventListener('visibilitychange', stop, true);

                    console.log("[Shield Core] Blokady MAIN aktywne.");
                } catch(e) {}
            })();
        `;
        const script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    };

    injectToMain();
    console.log("[Shield Core] System zainicjowany.");
})();
