(function () {
    console.log("%c [AntiTestportal Ultra] 1.0 Supreme initialized ", "background: #8b5cf6; color: white; font-weight: bold; border-radius: 4px; padding: 4px 12px;");

    let isHudEnabled = true;
    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false; // Default to FALSE to avoid immediate detection/issues
    let timeFreezeStartTimestamp = 0;
    let performanceFreezeStart = 0;

    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    // --- NAJWAŻNIEJSZE: MROŻENIE CZASU (Data + Performance) ---
    const originalDateNow = Date.now;
    const originalPerformanceNow = performance.now.bind(performance);

    Date.now = _c(() => {
        if (isTimeFreezeEnabled && timeFreezeStartTimestamp > 0) {
            return timeFreezeStartTimestamp + Math.floor(Math.random() * 100); // Slight jitter to look alive
        }
        return originalDateNow();
    }, 'now');

    performance.now = _c(() => {
        if (isTimeFreezeEnabled && performanceFreezeStart > 0) {
            return performanceFreezeStart + (Math.random() * 2);
        }
        return originalPerformanceNow();
    }, 'now');


    const smartSearch = (engine) => {
        const questionEl = document.querySelector('.question-container') || document.querySelector('.question') || document.body;
        let text = questionEl.innerText.split('\n').slice(0, 15).join(' ').replace(/\s+/g, ' ').trim();
        // Remove common prefixes
        text = text.replace(/^(Pytanie\s*\d+\:?|\d+[\.\)\:]\s*)/i, '').trim();

        if (text) {
            const query = text; // Just the text, user can add context if needed
            const url = engine === 'ai'
                ? `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`
                : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(url, '_blank');
        }
    };

    const createHUD = () => {
        if (document.getElementById('mikus-hud-container')) return;
        const hud = document.createElement('div');
        hud.id = 'mikus-hud-container';
        hud.style.cssText = "position: fixed; top: 12px; right: 12px; z-index: 2147483647; transition: opacity 0.3s ease; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;";
        hud.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px);
                        border: 1px solid rgba(139, 92, 246, 0.5); border-radius: 12px;
                        padding: 10px 16px; color: #a78bfa; font-family: 'Outfit', sans-serif;
                        font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 8px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5); pointer-events: none;">
                <div id="mikus-dot" style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 15px #10b981; animation: pulseDot 2s infinite;"></div>
                <span style="letter-spacing: 0.5px;">ULTRA 1.0: <span id="mikus-status-text">INIT...</span></span>
            </div>
            <div id="mikus-actions" style="display: flex; gap: 8px; pointer-events: auto;">
                <button id="mikus-btn-ai" title="Perplexity Search (Ctrl+Z)" style="background: #22d3ee; border: none; border-radius: 8px; color: black; padding: 8px 14px; font-size: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3); transition: all 0.2s;">
                    🧠 AI
                </button>
                <button id="mikus-btn-google" title="Google Search" style="background: #3b82f6; border: none; border-radius: 8px; color: white; padding: 8px 14px; font-size: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); transition: all 0.2s;">
                    🌐 GOOGLE
                </button>
            </div>
            <style>
                @keyframes pulseDot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
                #mikus-actions button:hover { transform: translateY(-2px); filter: brightness(1.1); }
            </style>
        `;
        (document.body || document.documentElement).appendChild(hud);

        document.getElementById('mikus-btn-ai').onclick = () => smartSearch('ai');
        document.getElementById('mikus-btn-google').onclick = () => smartSearch('google');
    };

    const updateHudDisplay = () => {
        const hud = document.getElementById('mikus-hud-container');
        if (!hud) return;
        const shouldShow = isHudEnabled; // Always show if enabled, let status text change
        hud.style.opacity = shouldShow ? "1" : "0";
        hud.style.visibility = shouldShow ? "visible" : "hidden";
        hud.style.pointerEvents = shouldShow ? "auto" : "none";

        const statusText = document.getElementById('mikus-status-text');
        if (statusText) {
            if (isTimeFreezeEnabled) {
                statusText.innerText = "TIME FROZEN ❄️";
                statusText.style.color = "#60a5fa";
            } else if (isGhostShieldEnabled) {
                statusText.innerText = "SECURE 🛡️";
                statusText.style.color = "#34d399";
            } else {
                statusText.innerText = "READY";
                statusText.style.color = "#94a3b8";
            }
        }
    };

    // --- TIMER PATCHING ---
    const patchTestportalTimer = () => {
        if (!window.Testportal || !window.Testportal.Timer) return;

        const timer = window.Testportal.Timer;
        if (timer.__ultra_patched) return; // Prevent double patch

        console.log("[Ultra] Patching Testportal Timer...");

        // Backup original methods
        timer._originalGetTimeLeft = timer.getTimeLeft;
        timer._originalInit = timer.init;

        // Override getTimeLeft
        // To jest główna funkcja którą Testportal sprawdza czas
        timer.getTimeLeft = _c(function () {
            if (isTimeFreezeEnabled && window.__ultra_frozen_val) {
                return window.__ultra_frozen_val;
            }
            // If we are not frozen, or dont have a value, return real time
            // But we can also cap it to "safe" limits if needed
            if (this._originalGetTimeLeft) {
                return this._originalGetTimeLeft.apply(this, arguments);
            }
            return 3600; // Fallback
        }, 'getTimeLeft');

        timer.__ultra_patched = true;
    };


    // Listeners
    // Listeners
    window.addEventListener('keydown', (e) => {
        // PERPLEXITY SEARCH (Całe pytanie): Ctrl + Z
        if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            smartSearch('ai');
        }
    }, true);

    // Block standard detection methods
    window.logToServer = _c(() => false, 'logToServer');

    // Focus/Blur blocker
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: () => {
                if (isGhostShieldEnabled) return true; // Always focused
                return true;
            },
            configurable: true
        });
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true
        });
        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true
        });
    } catch (e) { }

    const stopEvent = (e) => {
        if (!isGhostShieldEnabled) return;
        e.stopImmediatePropagation();
        e.stopPropagation();
    };

    ['blur', 'focusout', 'mouseleave', 'visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange'].forEach(evt => {
        window.addEventListener(evt, stopEvent, true);
        document.addEventListener(evt, stopEvent, true);
    });

    // --- COMMUNICATION HUB ---
    window.addEventListener("ultra_cmd_reset", () => {
        console.log("[Ultra] CMD: RESET TIMER");
        window.__ultra_frozen_val = null;
        if (window.Testportal && window.Testportal.Timer) {
            // Force re-init if possible or just unfreeze logic
            // W Testportalu reset często jest zablokowany, więc symulujemy odświeżenie stanu
            if (window.Testportal.Timer.init) window.Testportal.Timer.init();
        }
        // Force refresh page to sync with server time if heavily recognized? 
        // No, better just unfreeze locally.
    });

    window.addEventListener("ultra_cmd_freeze", (e) => {
        const newVal = e.detail;
        console.log(`[Ultra] CMD: FREEZE = ${newVal}`);

        isTimeFreezeEnabled = newVal;

        if (isTimeFreezeEnabled) {
            // Capture current state
            timeFreezeStartTimestamp = originalDateNow();
            performanceFreezeStart = originalPerformanceNow();

            if (window.Testportal?.Timer?.getTimeLeft) {
                window.__ultra_frozen_val = window.Testportal.Timer.getTimeLeft();
            } else {
                window.__ultra_frozen_val = 3600; // Default safe backup
            }
        } else {
            timeFreezeStartTimestamp = 0;
            performanceFreezeStart = 0;
            window.__ultra_frozen_val = null;
        }
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

    // Main Loop
    setInterval(() => {
        if (!document.getElementById('mikus-hud-container')) createHUD();
        patchTestportalTimer();
        updateHudDisplay();

        // Anti-Anti-Cheat variable sync
        // @ts-ignore
        if (typeof window.cheat_detected !== 'undefined') window.cheat_detected = false;

        // Force visible variables if site checks them
        if (isTimeFreezeEnabled && window.__ultra_frozen_val) {
            // Update global variable if exists
            // @ts-ignore
            if (typeof window.remainingTime !== 'undefined') window.remainingTime = window.__ultra_frozen_val;
        }

    }, 500);

})();
