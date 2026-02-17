(function () {
    console.log("%c [AntiTestportal Ultra] Supreme Engine Active ", "background: #8b5cf6; color: white; font-weight: bold; border-radius: 4px; padding: 4px 12px;");

    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    // --- 1. GHOST HUD (Branding Update: AntiTestportal Ultra) ---
    const createHUD = () => {
        if (document.getElementById('ultra-supreme-hud')) return;
        const hud = document.createElement('div');
        hud.id = 'ultra-supreme-hud';
        hud.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; z-index: 999999; 
                        background: rgba(139, 92, 246, 0.15); backdrop-filter: blur(8px);
                        border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px;
                        padding: 6px 12px; color: #a78bfa; font-family: 'Inter', sans-serif;
                        font-size: 10px; font-weight: bold; pointer-events: none;
                        display: flex; align-items: center; gap: 6px; animation: fadeIn 0.5s ease-out;">
                <div style="width: 6px; height: 6px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399;"></div>
                ANTITESTPORTAL ULTRA: <span id="ultra-status">GHOST ACTIVE</span>
            </div>
            <style>
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            </style>
        `;
        document.body.appendChild(hud);
    };

    // --- 2. THE REFERENCE ERROR TRICK ---
    window.logToServer = _c(() => false, 'logToServer');
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: () => { throw new ReferenceError("antiTestportalFeature"); },
            configurable: true
        });
    } catch (e) { }

    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes("antiTestportalFeature")) {
            e.preventDefault();
            return true;
        }
    }, true);

    // --- 3. NUCLEAR EVENT BLOCKING ---
    const silence = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
    };
    const events = ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'mozvisibilitychange', 'webkitvisibilitychange', 'pagehide', 'beforeunload'];
    events.forEach(ev => {
        window.addEventListener(ev, silence, true);
        document.addEventListener(ev, silence, true);
    });

    // --- 4. SUPREME BYPASS (Honest & Timer) ---
    const applySupremeBypass = () => {
        try {
            if (!document.getElementById('ultra-supreme-hud')) createHUD();

            if (window.Testportal) {
                const tp = window.Testportal;

                if (tp.HonestRespondent) {
                    const h = tp.HonestRespondent;
                    h.isHonest = _c(() => true, 'isHonest');
                    h.validate = _c(() => true, 'validate');
                    h.checkFocus = _c(() => true, 'checkFocus');
                    h.attemptsCount = 0;

                    Object.defineProperty(h, 'isHonest', { get: () => true, configurable: true });
                    Object.defineProperty(h, 'attemptsCount', { get: () => 0, set: () => { }, configurable: false });
                }

                if (tp.Timer) {
                    const t = tp.Timer;
                    t.isExpired = _c(() => false, 'isExpired');
                    if (t.getTimeLeft) {
                        const originalTime = t.getTimeLeft ? t.getTimeLeft() : 9999;
                        if (!window.__tp_orig_time__) window.__tp_orig_time__ = originalTime;
                        t.getTimeLeft = _c(() => window.__tp_orig_time__, 'getTimeLeft');
                    }
                }
            }

            window.remainingTime = 999999;
            window.timeSpent = 0;
            window.cheat_detected = false;

        } catch (e) { }
    };

    // --- 5. TIMER RESET LISTENER ---
    window.addEventListener("76mikus_reset_timer", () => {
        try {
            if (window.Testportal && window.Testportal.Timer) {
                const t = window.Testportal.Timer;
                if (t.init) t.init();
                if (window.startTime) window.startTime = Date.now();
                window.__tp_orig_time__ = undefined;
                console.log("[AntiTestportal Ultra] Timer Reset Done");
            }
        } catch (e) { }
    });

    applySupremeBypass();
    setInterval(applySupremeBypass, 400);

})();
