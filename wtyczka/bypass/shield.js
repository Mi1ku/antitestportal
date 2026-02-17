/**
 * ANTI-TESTPORTAL ULTRA - SHIELD v5.6.0 (STEALTH MAIN WORLD)
 * Runs directly in the page context. No script tags = No detection.
 */
(function () {
    // 1. BLOKADA DETEKCJI (URUCHAMIANA NATYCHMIAST)
    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    // Spoofing focusu - najprostsza i najskuteczniejsza metoda
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: makeNative(() => true, 'hasFocus'),
            configurable: true
        });

        const docProto = Object.getPrototypeOf(document);
        Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: true });
        Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: true });

        // Blokada eventów wyjścia
        const stop = (e) => e.stopImmediatePropagation();
        window.addEventListener('blur', stop, true);
        window.addEventListener('visibilitychange', stop, true);
        window.addEventListener('mouseleave', stop, true);

        // Uciszenie telemetrii Testportalu
        window.logToServer = makeNative(() => false, 'logToServer');
        window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

        console.log("[Shield] Stealth Core v5.6.0 Aktywny.");
    } catch (e) { }

    // 2. LOGIKA ŁADOWANIA SILNIKA Z GITHUBA
    const isTestPage = () => {
        const url = window.location.href;
        return url.includes('/test/') || url.includes('/exam/') ||
            url.includes('/start/') || url.includes('test.html');
    };

    if (isTestPage()) {
        console.log("[Shield] Wykryto test. Prośba o silnik...");
        // Uwaga: W world: MAIN nie mamy dostępu do chrome.runtime.sendMessage 
        // tak łatwo jak w ISOLATED, ale możemy użyć custom eventu lub background scriptu.
        // Jednak najprościej na czas testu wstrzyknąć silnik przez tło.
    }
})();