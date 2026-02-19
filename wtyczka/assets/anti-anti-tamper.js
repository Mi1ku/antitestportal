(function () {
    // Generate random seed for IDs to avoid detection by ID string
    const rndId = (prefix) => prefix + '-' + Math.random().toString(36).substring(2, 9);
    const HUD_CONTAINER_ID = rndId('tp-analytics');
    const DOT_ID = rndId('st');
    const STATUS_TEXT_ID = rndId('txt');
    const ACTIONS_ID = rndId('act');
    const BTN_GPT_ID = rndId('bgpt');
    const BTN_GOOGLE_ID = rndId('bgoo');

    let isHudEnabled = true;
    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false;

    // Better toString faking
    const originalToString = Function.prototype.toString;
    const fakedFunctions = new Map();

    Function.prototype.toString = function () {
        if (fakedFunctions.has(this)) {
            return fakedFunctions.get(this);
        }
        return originalToString.call(this);
    };

    const _c = (fn, n) => {
        const name = n || fn.name;
        fakedFunctions.set(fn, `function ${name}() { [native code] }`);
        if (name) Object.defineProperty(fn, 'name', { value: name });
        return fn;
    };

    const smartSearch = (engine) => {
        const questionEl = document.querySelector('.question-container') || document.querySelector('.question') || document.body;
        let text = questionEl.innerText.split('\n').slice(0, 10).join(' ').replace(/\s+/g, ' ').trim();
        text = text.replace(/^(Pytanie\s*\d+\:?|\d+[\.\)\:]\s*)/i, '').trim();

        if (engine === 'ai') {
            // Using Perplexity as a reliable free alternative that "works" better for questions
            const query = "Solution for this Testportal task: " + text;
            window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`, '_blank');
            return;
        }

        if (engine === 'gpt') {
            // Existing GPT flow with screenshot
            window.dispatchEvent(new CustomEvent("ultra_req_capture"));
            return;
        }

        if (text) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank');
        }
    };

    const createHUD = () => {
        if (document.getElementById(HUD_CONTAINER_ID)) return;
        const hud = document.createElement('div');
        hud.id = HUD_CONTAINER_ID;
        // Apple style HUD: Glassmorphism, Rounded, Clean
        hud.style.cssText = "position: fixed; top: 16px; right: 16px; z-index: 2147483647; transition: opacity 0.3s ease; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;";
        hud.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 16px;
                        padding: 8px 16px; color: #1d1d1f; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 8px;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.12); pointer-events: none;">
                <div id="${DOT_ID}" style="width: 8px; height: 8px; background: #34c759; border-radius: 50%; box-shadow: 0 0 10px #34c759;"></div>
                <span id="${STATUS_TEXT_ID}">GHOST ACTIVE</span>
            </div>
            <div id="${ACTIONS_ID}" style="display: flex; gap: 8px; pointer-events: auto;">
                <button id="${BTN_GPT_ID}" style="background: #1d1d1f; border: none; border-radius: 12px; color: white; padding: 10px 18px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: all 0.2s;">
                    AI SEARCH
                </button>
                <button id="${BTN_GOOGLE_ID}" style="background: #0071e3; border: none; border-radius: 12px; color: white; padding: 10px 18px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(0,113,227,0.2); transition: all 0.2s;">
                    GOOGLE
                </button>
            </div>
            <style>
                #${ACTIONS_ID} button:hover { transform: scale(1.03); filter: brightness(1.2); }
                #${ACTIONS_ID} button:active { transform: scale(0.97); }
            </style>
        `;
        (document.body || document.documentElement).appendChild(hud);

        document.getElementById(BTN_GPT_ID).onclick = () => smartSearch('ai');
        document.getElementById(BTN_GOOGLE_ID).onclick = () => smartSearch('google');
    };

    const updateHudDisplay = () => {
        const hud = document.getElementById(HUD_CONTAINER_ID);
        if (!hud) return;
        const shouldShow = isHudEnabled;
        hud.style.opacity = shouldShow ? "1" : "0";
        hud.style.visibility = shouldShow ? "visible" : "hidden";
        hud.style.pointerEvents = shouldShow ? "auto" : "none";

        const statusText = document.getElementById(STATUS_TEXT_ID);
        const dot = document.getElementById(DOT_ID);
        if (statusText) statusText.innerText = isTimeFreezeEnabled ? "TIME FROZEN" : "SYSTEM SECURE";
        if (dot) dot.style.background = isTimeFreezeEnabled ? "#0071e3" : "#34c759";
        if (dot) dot.style.boxShadow = isTimeFreezeEnabled ? "0 0 10px #0071e3" : "0 0 10px #34c759";
    };

    const patchTimer = () => {
        if (window.Testportal && window.Testportal.Timer) {
            const timer = window.Testportal.Timer;
            if (!timer.__patched) {
                timer.__patched = true;
                const originalGetTime = timer.getTimeLeft;
                Object.defineProperty(timer, 'getTimeLeft', {
                    get: () => _c(() => {
                        if (isTimeFreezeEnabled) {
                            if (!window.__tp_s_val) {
                                try { window.__tp_s_val = originalGetTime.call(timer); }
                                catch (e) { window.__tp_s_val = timer.timeRemaining || 3600; }
                            }
                            return window.__tp_s_val;
                        }
                        return originalGetTime ? originalGetTime.call(timer) : 3600;
                    }, 'getTimeLeft')
                });
            }
        }
    };

    // Advanced Bypass
    _c(document.hasFocus, 'hasFocus');
    _c(window.logToServer, 'logToServer');

    try {
        const descriptors = {
            hasFocus: { get: () => true },
            visibilityState: { get: () => isGhostShieldEnabled ? 'visible' : document.visibilityState },
            hidden: { get: () => isGhostShieldEnabled ? false : document.hidden }
        };
        Object.defineProperties(document, descriptors);
    } catch (e) { }

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
        if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); smartSearch('google'); }
        if (e.altKey && e.key.toLowerCase() === 'z') { e.preventDefault(); smartSearch('ai'); }
    }, true);

    window.addEventListener("ultra_cmd_freeze", (e) => { isTimeFreezeEnabled = e.detail; updateHudDisplay(); });
    window.addEventListener("ultra_cmd_shield", (e) => { isGhostShieldEnabled = e.detail; updateHudDisplay(); });
    window.addEventListener("ultra_cmd_hud", (e) => { isHudEnabled = e.detail; updateHudDisplay(); });

    setInterval(() => {
        if (!document.getElementById(HUD_CONTAINER_ID)) createHUD();
        patchTimer();
        if (isGhostShieldEnabled) {
            if (window.Testportal) window.Testportal.isFocus = true;
            // @ts-ignore
            window.cheat_detected = false;
        }
        if (isTimeFreezeEnabled && window.__tp_s_val) {
            // @ts-ignore
            if (window.remainingTime) window.remainingTime = window.__tp_s_val;
            // @ts-ignore
            if (window.timeRemaining) window.timeRemaining = window.__tp_s_val;
        }
    }, 500);

})();
