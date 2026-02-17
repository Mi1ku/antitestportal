/**
 * ANTITESTPORTAL ULTRA - CORE v1.3.0 STEALTH
 */
(function () {
    console.log("[Shield Core] Aktywacja warstwy dyskretnej...");

    // 1. CAŁKOWITE ZABLOKOWANIE EVENTÓW WYJŚCIA
    const block = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
    };

    ['blur', 'focusout', 'visibilitychange', 'mouseleave', 'pause'].forEach(evt => {
        window.addEventListener(evt, block, true);
        document.addEventListener(evt, block, true);
    });

    // 2. WSTRZYKIWANIE KŁAMSTWA DO MAIN WORLD
    const injectStealth = () => {
        const code = `
            (function() {
                try {
                    // Zamiast rzucać błędem, po prostu zwracamy TRUE
                    const trueFn = () => true;
                    Object.defineProperty(document, 'hasFocus', {
                        get: () => trueFn,
                        configurable: true
                    });

                    // Visibility Lock - głębokie nadpisanie
                    const docProto = Object.getPrototypeOf(document);
                    Object.defineProperty(docProto, 'visibilityState', { get: () => 'visible', configurable: true });
                    Object.defineProperty(docProto, 'hidden', { get: () => false, configurable: true });

                    // Blokada wysyłki danych o "oszustwach"
                    window.logToServer = () => false;
                    window.sendCheatInfo = () => false;
                    
                    // Pozbywamy się handlerów onblur/onvisibilitychange
                    window.onblur = null;
                    window.onfocus = null;
                    document.onvisibilitychange = null;

                    console.log("[Shield Core] Status: NIEWIDZIALNY.");
                } catch(e) {}
            })();
        `;
        const script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    };

    injectStealth();
})();
