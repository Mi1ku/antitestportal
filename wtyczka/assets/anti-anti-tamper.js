(function () {
    console.log("[76mikus] Anti-Anti-Tampering Supreme is active");

    // 1. THE REFERENCE ERROR TRICK (Requested by user)
    // This crashes the detection script when it tries to check if the window has focus
    window.logToServer = () => false;
    Object.defineProperty(document, 'hasFocus', {
        get: () => { throw new ReferenceError("antiTestportalFeature"); },
        configurable: true
    });

    // Silence errors to keep the console clean
    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes("antiTestportalFeature")) {
            return true;
        }
    }, true);

    // 2. HONEST RESPONDENT PROTOCOL (Classic Supreme Fix)
    const applyHonest = () => {
        try {
            if (window.Testportal && window.Testportal.HonestRespondent) {
                const h = window.Testportal.HonestRespondent;
                const _tr = () => true;
                h.isHonest = _tr;
                h.validate = _tr;
                h.setHonest = _tr;
                // Shadowing for extra protection
                Object.defineProperty(h, 'isHonest', { get: () => _tr, configurable: true });
            }
        } catch (e) { }
    };

    // 3. TELEMETRY BLACKOUT
    window.sendCheatInfo = () => false;
    window.onBlurHandler = () => false;

    applyHonest();
    setInterval(applyHonest, 1000);

    console.log("%c [76mikus] HONEST RESPONDENT ACTIVE ", "background: #8b5cf6; color: white; font-weight: bold; border-radius: 4px; padding: 2px 4px;");
})();
