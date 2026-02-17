/**
 * ANTITESTPORTAL ULTRA - CORE v1.6.0 UNBLOCKABLE
 * The first and most critical layer of defense.
 */
(function () {
    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    const injectBulletproof = () => {
        const code = `
            (function() {
                const makeNative = ${makeNative.toString()};
                
                const harden = (obj, prop, value) => {
                    try {
                        Object.defineProperty(obj, prop, {
                            value: value,
                            writable: false,
                            configurable: false // Nie do zablokowania/zmiany
                        });
                    } catch (e) {
                        // Jeśli już istnieje, spróbuj nadpisać przez prototyp
                        try {
                            const proto = Object.getPrototypeOf(obj);
                            Object.defineProperty(proto, prop, {
                                get: () => value,
                                configurable: false
                            });
                        } catch (e2) {}
                    }
                };

                // 1. ABSOLUTNE KŁAMSTWO FOCUSU
                harden(document, 'hasFocus', makeNative(() => true, 'hasFocus'));
                
                // 2. BLOKADA WIDOCZNOŚCI (Zawsze visible)
                const docProto = Object.getPrototypeOf(document);
                Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: false });
                Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: false });

                // 3. EVENT BLACK HOLE (Przejmujemy wszystki eventy wyjścia)
                const stop = (e) => {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                };
                ['blur', 'focusout', 'visibilitychange', 'mouseleave', 'pause', 'contextmenu'].forEach(type => {
                    window.addEventListener(type, stop, true);
                    document.addEventListener(type, stop, true);
                });

                // 4. HIJACK ADDEVENTLISTENER (Testportal nie może dodać swoich czujek)
                const originalAdd = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = makeNative(function(type, listener, options) {
                    if (['blur', 'focusout', 'visibilitychange', 'mouseleave'].includes(type)) {
                        return; // Blokujemy rejestrację podsłuchu
                    }
                    return originalAdd.apply(this, arguments);
                }, 'addEventListener');

                // 5. BLOKADA RAPORTOWANIA
                window.logToServer = makeNative(() => false, 'logToServer');
                window.sendCheatInfo = makeNative(() => false, 'sendCheatInfo');

                console.log("[Shield Core] WARSTWA 1 (UNBLOCKABLE) AKTYWNA.");
            })();
        `;
        const script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    };

    injectBulletproof();
})();
