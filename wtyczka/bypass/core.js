/**
 * ANTITESTPORTAL ULTRA - CORE v1.7.0 BRUTE FORCE
 * Runs before everything else.
 */
(function () {
    // Funkcja maskująca jako native
    const makeNative = (fn, name) => {
        const wrapped = function () { return fn.apply(this, arguments); };
        Object.defineProperty(wrapped, 'name', { value: name || fn.name });
        wrapped.toString = () => `function ${name || ''}() { [native code] }`;
        return wrapped;
    };

    const code = `
        (function() {
            const makeNative = ${makeNative.toString()};
            
            // 1. ZABIJAMY PRZEKIEROWANIA (OnBeforeUnload & Redirects)
            window.onbeforeunload = null;
            window.addEventListener('beforeunload', (e) => {
                e.stopImmediatePropagation();
            }, true);

            // 2. ABSOLUTNE ZASYPANIE FOCUSU (Configurable: false to klucz)
            try {
                const docProto = Object.getPrototypeOf(document);
                Object.defineProperty(docProto, 'hasFocus', {
                    value: makeNative(() => true, 'hasFocus'),
                    writable: false, configurable: false
                });
                
                Object.defineProperty(docProto, 'visibilityState', { get: makeNative(() => 'visible', 'get visibilityState'), configurable: false });
                Object.defineProperty(docProto, 'hidden', { get: makeNative(() => false, 'get hidden'), configurable: false });
            } catch(e) {}

            // 3. BLOKADA ADDEVENTLISTENER (Testportal nie może nas "słuchać")
            const originalAdd = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = makeNative(function(type, listener, options) {
                if (['blur', 'focusout', 'visibilitychange', 'mouseleave', 'pause'].includes(type)) {
                    return; 
                }
                return originalAdd.apply(this, arguments);
            }, 'addEventListener');

            // 4. MASKOWANIE WTYCZEK (Testportal nie może nas "zobaczyć" w navigatorze)
            if (navigator.plugins) {
                Object.defineProperty(navigator, 'plugins', {
                    get: () => ({ length: 0 }),
                    configurable: false
                });
            }

            console.log("[Shield Core] System GHOST AKTYWNY.");
        })();
    `;

    const script = document.createElement('script');
    script.textContent = code;
    (document.documentElement || document.head).appendChild(script);
    script.remove();
})();
