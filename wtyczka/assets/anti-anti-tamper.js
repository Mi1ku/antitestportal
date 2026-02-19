(function () {
    // SUPREME GHOST ENGINE v1.5.0 - ULTRA PRECISION

    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false;
    let isHudEnabled = true;

    const fakedFunctions = new Map();
    const originalToString = Function.prototype.toString;

    const _c = (fn, n) => {
        if (!fn || typeof fn !== 'function') return fn;
        const name = n || fn.name || 'anonymous';
        fakedFunctions.set(fn, `function ${name}() { [native code] }`);
        try { Object.defineProperty(fn, 'name', { value: name, configurable: true }); } catch (e) { }
        return fn;
    };

    Function.prototype.toString = _c(function () {
        if (fakedFunctions.has(this)) return fakedFunctions.get(this);
        return originalToString.call(this);
    }, 'toString');

    const patch = (obj, prop, value, asGetter = false) => {
        try {
            if (!obj || typeof obj !== 'object') return;
            const desc = asGetter ? { get: value, configurable: true } : { value: value, configurable: true };
            Object.defineProperty(obj, prop, desc);
        } catch (e) { }
    };

    // Stealth patches
    patch(navigator, 'webdriver', () => false, true);
    patch(document, 'hasFocus', _c(() => true, 'hasFocus'));
    patch(document, 'visibilityState', () => isGhostShieldEnabled ? 'visible' : document.visibilityState, true);
    patch(document, 'hidden', () => isGhostShieldEnabled ? false : document.hidden, true);

    const silence = (e) => {
        if (isGhostShieldEnabled && ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'pagehide'].includes(e.type)) {
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    };

    ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'pagehide'].forEach(ev => {
        window.addEventListener(ev, silence, true);
        document.addEventListener(ev, silence, true);
    });

    // Window blur protection
    window.onblur = null;
    window.onfocus = null;

    const rndId = (p) => p + '-' + Math.random().toString(36).substring(2, 7);
    const HUD_ID = rndId('tp');
    const DOT_ID = rndId('dt');
    const TXT_ID = rndId('tx');

    const createHUD = () => {
        if (document.getElementById(HUD_ID)) return;
        const h = document.createElement('div');
        h.id = HUD_ID;
        h.style.cssText = `position:fixed;bottom:15px;right:15px;z-index:9999999;display:flex;flex-direction:column;align-items:flex-end;gap:5px;font-family:sans-serif;pointer-events:none;`;
        h.innerHTML = `
            <div style="background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);border:1px solid rgba(0,255,102,0.3);border-radius:20px;padding:8px 16px;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;gap:10px;box-shadow:0 10px 40px rgba(0,0,0,0.7);">
                <div id="${DOT_ID}" style="width:8px;height:8px;background:#0f6;border-radius:50%;box-shadow:0 0 15px #0f6;transition:0.3s;"></div>
                <span id="${TXT_ID}">SHIELD ACTIVE</span>
            </div>
        `;
        (document.body || document.documentElement).appendChild(h);
    };

    const updateHUD = () => {
        const dot = document.getElementById(DOT_ID);
        const txt = document.getElementById(TXT_ID);
        if (dot) {
            dot.style.background = isTimeFreezeEnabled ? '#ff3b3b' : '#0f6';
            dot.style.boxShadow = isTimeFreezeEnabled ? '0 0 15px #ff3b3b' : '0 0 15px #0f6';
        }
        if (txt) txt.innerText = isTimeFreezeEnabled ? 'TIME FROZEN' : 'SHIELD ACTIVE';
    };

    window.addEventListener("ultra_cmd_freeze", (e) => { isTimeFreezeEnabled = e.detail; updateHUD(); });
    window.addEventListener("ultra_cmd_shield", (e) => { isGhostShieldEnabled = e.detail; });
    window.addEventListener("ultra_cmd_hud", (e) => { isHudEnabled = e.detail; const h = document.getElementById(HUD_ID); if (h) h.style.display = isHudEnabled ? 'flex' : 'none'; });


    // TIME FREEZE LOGIC: BILLIONS OF HOURS
    const HUGE_TIME = 9999999;

    setInterval(() => {
        if (isHudEnabled && !document.getElementById(HUD_ID) && document.body) createHUD();
        if (window.Testportal) {
            if (isGhostShieldEnabled) window.Testportal.isFocus = true;
            if (window.Testportal.Timer && !window.Testportal.Timer.__patched) {
                const timer = window.Testportal.Timer;
                timer.__patched = true;
                const orig = timer.getTimeLeft;
                if (typeof orig === 'function') {
                    patch(timer, 'getTimeLeft', _c(() => {
                        if (isTimeFreezeEnabled) {
                            return HUGE_TIME;
                        }
                        return orig.call(timer);
                    }, 'getTimeLeft'), true);
                }
            }
        }
        if (isGhostShieldEnabled) {
            window.cheat_detected = false;
            if (!window.checkWebExtension) window.checkWebExtension = _c(() => false, 'checkWebExtension');
        }
    }, 400);
})();
