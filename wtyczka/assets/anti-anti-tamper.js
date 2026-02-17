(function () {
    console.log("%c [AntiTestportal Ultra] Supreme Engine Initializing ", "background: #8b5cf6; color: white; font-weight: bold; border-radius: 4px; padding: 4px 12px;");

    let isHudEnabled = true;
    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false;

    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    // --- 1. GHOST HUD (Branding: AntiTestportal Ultra) ---
    const createHUD = () => {
        if (document.getElementById('mikus-hud-container')) return;
        const hud = document.createElement('div');
        hud.id = 'mikus-hud-container';
        hud.style.cssText = "position: fixed; top: 12px; right: 12px; z-index: 2147483647; pointer-events: none; transition: opacity 0.2s ease;";
        hud.innerHTML = `
            <div style="background: rgba(139, 92, 246, 0.15); backdrop-filter: blur(10px);
                        border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px;
                        padding: 8px 14px; color: #a78bfa; font-family: 'Outfit', 'Inter', sans-serif;
                        font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 8px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2); animation: slideInHud 0.4s ease-out;">
                <div id="mikus-dot" style="width: 7px; height: 7px; background: #34d399; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulseDot 2s infinite;"></div>
                <span style="letter-spacing: 0.5px;">ULTRA: <span id="mikus-status-text">GHOST ACTIVE</span></span>
            </div>
            <style>
                @keyframes slideInHud { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes pulseDot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
            </style>
        `;
        (document.body || document.documentElement).appendChild(hud);
    };

    const updateHudDisplay = () => {
        const hud = document.getElementById('mikus-hud-container');
        if (!hud) return;

        const shouldShow = isHudEnabled && (isGhostShieldEnabled || isTimeFreezeEnabled);
        hud.style.opacity = shouldShow ? "1" : "0";
        hud.style.visibility = shouldShow ? "visible" : "hidden";

        const statusText = document.getElementById('mikus-status-text');
        if (statusText) {
            statusText.innerText = isTimeFreezeEnabled ? "TIME FROZEN" : "GHOST ACTIVE";
        }
    };

    // --- 2. ANTI-TAMPER & STEALTH ---
    window.logToServer = _c(() => false, 'logToServer');
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: () => {
                if (isGhostShieldEnabled) throw new ReferenceError("antiTestportalFeature");
                return true;
            },
            configurable: true
        });
    } catch (e) { }

    const silence = (e) => {
        if (!isGhostShieldEnabled) return;
        e.stopImmediatePropagation();
        e.stopPropagation();
    };
    ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'mozvisibilitychange', 'webkitvisibilitychange', 'pagehide', 'beforeunload'].forEach(ev => {
        window.addEventListener(ev, silence, true);
        document.addEventListener(ev, silence, true);
    });

    // --- 3. SUPREME BYPASS ENGINE ---
    const applySupremeBypass = () => {
        try {
            if (!document.getElementById('mikus-hud-container')) createHUD();
            updateHudDisplay();

            if (window.Testportal) {
                const tp = window.Testportal;

                if (tp.HonestRespondent && isGhostShieldEnabled) {
                    const h = tp.HonestRespondent;
                    h.isHonest = _c(() => true, 'isHonest');
                    h.attemptsCount = 0;
                    Object.defineProperty(h, 'isHonest', { get: () => true, configurable: true });
                    Object.defineProperty(h, 'attemptsCount', { get: () => 0, set: () => { }, configurable: false });
                }

                if (tp.Timer) {
                    const t = tp.Timer;
                    if (isTimeFreezeEnabled) {
                        t.isExpired = _c(() => false, 'isExpired');
                        if (t.getTimeLeft) {
                            const current = t.getTimeLeft();
                            if (!window.__tp_frozen_time) window.__tp_frozen_time = current;
                            t.getTimeLeft = _c(() => window.__tp_frozen_time, 'getTimeLeft');
                        }
                    } else {
                        window.__tp_frozen_time = null;
                    }
                }
            }
            window.remainingTime = window.remainingTime || 999999;
            window.timeSpent = 0;
            window.cheat_detected = false;
        } catch (e) { }
    };

    // --- 4. COMMAND LISTENERS (Sync from Content Script) ---
    window.addEventListener("ultra_cmd_reset", () => {
        window.__tp_frozen_time = null;
        try {
            if (window.Testportal && window.Testportal.Timer) {
                const t = window.Testportal.Timer;
                if (t.init) t.init();
            }
            if (window.startTime) window.startTime = Date.now();
        } catch (e) { }
        console.log("[AntiTestportal Ultra] Timer Reset Triggered.");
    });

    window.addEventListener("ultra_cmd_freeze", (e) => {
        isTimeFreezeEnabled = e.detail;
        updateHudDisplay();
    });

    window.addEventListener("ultra_cmd_shield", (e) => {
        isGhostShieldEnabled = e.detail;
        updateHudDisplay();
    });

    window.addEventListener("ultra_cmd_hud", (e) => {
        isHudEnabled = e.detail;
        updateHudDisplay();
    });

    applySupremeBypass();
    setInterval(applySupremeBypass, 400);

})();
