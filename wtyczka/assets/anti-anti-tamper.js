(function () {
    const rndId = (prefix) => prefix + '-' + Math.random().toString(36).substring(2, 9);
    const HUD_CONTAINER_ID = rndId('tp-hc');
    const DOT_ID = rndId('st');
    const STATUS_TEXT_ID = rndId('txt');
    const ACTIONS_ID = rndId('act');
    const BTN_AI_ID = rndId('bai');
    const BTN_G_ID = rndId('bgoo');

    let isHudEnabled = true;
    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false;

    // Better faking with Proxy/Object protection
    const fakedFunctions = new Map();
    const originalToString = Function.prototype.toString;

    const _c = (fn, n) => {
        if (!fn || typeof fn !== 'function') return fn;
        const name = n || fn.name || 'anonymous';
        fakedFunctions.set(fn, `function ${name}() { [native code] }`);
        try {
            if (name && name !== 'anonymous') Object.defineProperty(fn, 'name', { value: name, configurable: true });
        } catch (e) { }
        return fn;
    };

    Function.prototype.toString = _c(function () {
        if (fakedFunctions.has(this)) return fakedFunctions.get(this);
        return originalToString.call(this);
    }, 'toString');

    const smartSearch = (engine) => {
        const questionEl = document.querySelector('.question-container') || document.querySelector('.question') || document.body;
        let text = questionEl.innerText.split('\n').slice(0, 10).join(' ').replace(/\s+/g, ' ').trim();
        text = text.replace(/^(Pytanie\s*\d+\:?|\d+[\.\)\:]\s*)/i, '').trim();

        if (engine === 'ai') {
            window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(text)}`, '_blank');
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
        }
    };

    const createHUD = () => {
        if (document.getElementById(HUD_CONTAINER_ID)) return;
        const hud = document.createElement('div');
        hud.id = HUD_CONTAINER_ID;
        hud.style.cssText = `
            position: fixed; top: 12px; right: 12px; z-index: 2147483647;
            display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
            font-family: -apple-system, sans-serif; pointer-events: none;
        `;
        hud.innerHTML = `
            <div style="background: rgba(15, 15, 15, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); 
                        border-radius: 12px; padding: 8px 14px; color: #fff; font-size: 10px; font-weight: 800; display: flex; 
                        align-items: center; gap: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
                <div id="${DOT_ID}" style="width: 6px; height: 6px; background: #32D74B; border-radius: 50%;"></div>
                <span id="${STATUS_TEXT_ID}">SUPREME ACTIVE</span>
            </div>
            <div id="${ACTIONS_ID}" style="display: flex; gap: 4px; pointer-events: auto;">
                <button id="${BTN_AI_ID}" style="background: #0A84FF; border: none; border-radius: 10px; color: white; padding: 8px 12px; font-size: 9px; font-weight: 900; cursor: pointer;">PXL (AI)</button>
                <button id="${BTN_G_ID}" style="background: rgba(45, 45, 45, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: white; padding: 8px 12px; font-size: 9px; font-weight: 900; cursor: pointer;">GOOGLE</button>
            </div>
        `;
        (document.body || document.documentElement).appendChild(hud);

        document.getElementById(BTN_AI_ID).onclick = () => smartSearch('ai');
        document.getElementById(BTN_G_ID).onclick = () => smartSearch('google');
    };

    const patchTimer = () => {
        if (window.Testportal && window.Testportal.Timer) {
            const timer = window.Testportal.Timer;
            if (!timer.__patched) {
                timer.__patched = true;
                const originalGetTime = timer.getTimeLeft;
                if (typeof originalGetTime === 'function') {
                    Object.defineProperty(timer, 'getTimeLeft', {
                        get: () => _c(() => {
                            if (isTimeFreezeEnabled) {
                                if (!window.__tp_s_val) {
                                    try { window.__tp_s_val = originalGetTime.call(timer); }
                                    catch (e) { window.__tp_s_val = timer.timeRemaining || (timer.initialTime || 3600); }
                                }
                                return window.__tp_s_val;
                            }
                            return originalGetTime.call(timer);
                        }, 'getTimeLeft')
                    });
                }
            }
        }
    };

    // Anti-Detection bypass
    try {
        if (window.navigator) {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        }

        // Block Testportal from seeing specific properties
        const desc = {
            hasFocus: { value: _c(() => true, 'hasFocus'), configurable: true },
            visibilityState: { get: () => isGhostShieldEnabled ? 'visible' : document.visibilityState, configurable: true },
            hidden: { get: () => isGhostShieldEnabled ? false : document.hidden, configurable: true }
        };
        Object.defineProperties(document, desc);
    } catch (e) { console.warn("Supreme Bypass Warning [lvl1]"); }

    const silence = (e) => {
        if (isGhostShieldEnabled && ['blur', 'visibilitychange', 'mouseleave', 'focusout'].includes(e.type)) {
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    };

    ['blur', 'visibilitychange', 'mouseleave', 'focusout'].forEach(ev => {
        window.addEventListener(ev, silence, true);
        document.addEventListener(ev, silence, true);
    });

    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); smartSearch('google'); }
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); smartSearch('ai'); }
    }, true);

    window.addEventListener("ultra_cmd_freeze", (e) => { isTimeFreezeEnabled = e.detail; });
    window.addEventListener("ultra_cmd_shield", (e) => { isGhostShieldEnabled = e.detail; });
    window.addEventListener("ultra_cmd_hud", (e) => { isHudEnabled = e.detail; const h = document.getElementById(HUD_CONTAINER_ID); if (h) h.style.display = isHudEnabled ? 'flex' : 'none'; });

    setInterval(() => {
        if (isHudEnabled && !document.getElementById(HUD_CONTAINER_ID)) createHUD();
        patchTimer();
        if (isGhostShieldEnabled) {
            if (window.Testportal) window.Testportal.isFocus = true;
            window.cheat_detected = false;
            // Anti-detection dummy for their scanner
            if (!window.checkWebExtension) window.checkWebExtension = _c(() => false, 'checkWebExtension');
        }
    }, 400);
})();
