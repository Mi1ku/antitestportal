(function () {
    console.log("%c [AntiTestportal Ultra] 1.0 Supreme initialized ", "background: #8b5cf6; color: white; font-weight: bold; border-radius: 4px; padding: 4px 12px;");

    let isHudEnabled = true;
    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false;

    const _c = (fn, n) => {
        const w = function () { return fn.apply(this, arguments); };
        Object.defineProperty(w, 'name', { value: n || fn.name });
        w.toString = () => `function ${n || ''}() { [native code] }`;
        return w;
    };

    // --- 1. GHOST HUD (v1.0 Ready) ---
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
                <span style="letter-spacing: 0.5px;">ULTRA 1.0: <span id="mikus-status-text">GHOST ACTIVE</span></span>
            </div>
            <div id="mikus-actions" style="display: flex; gap: 8px; pointer-events: auto;">
                <button id="mikus-btn-search" title="Smart Search" style="background: #8b5cf6; border: none; border-radius: 8px; color: white; padding: 8px 14px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); transition: all 0.2s;">
                    🔍 SZUKAJ AI
                </button>
            </div>
            <style>
                @keyframes pulseDot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
                #mikus-btn-search:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5); filter: brightness(1.1); }
            </style>
        `;
        (document.body || document.documentElement).appendChild(hud);

        document.getElementById('mikus-btn-search').onclick = () => {
            // Smart Scrape: bierze treść zadania, usuwa numery pytań (np. "1.", "Pytanie 1:")
            const questionEl = document.querySelector('.question-container') || document.querySelector('.question') || document.body;
            let text = questionEl.innerText.split('\n').slice(0, 6).join(' ').replace(/\s+/g, ' ').trim();

            // Regex do usuwania numeru pytania na początku
            text = text.replace(/^(Pytanie\s*\d+\:?|\d+[\.\)\:]\s*)/i, '').trim();

            if (text) {
                // Perplexity jest lepsze do AI - otwiera bezpośrednio
                window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent("Rozwiąż to zadanie z Testportalu: " + text)}`, '_blank');
            }
        };
    };

    const updateHudDisplay = () => {
        const hud = document.getElementById('mikus-hud-container');
        if (!hud) return;
        const shouldShow = isHudEnabled && (isGhostShieldEnabled || isTimeFreezeEnabled);
        hud.style.opacity = shouldShow ? "1" : "0";
        hud.style.visibility = shouldShow ? "visible" : "hidden";
        hud.style.pointerEvents = shouldShow ? "auto" : "none";
        const statusText = document.getElementById('mikus-status-text');
        if (statusText) statusText.innerText = isTimeFreezeEnabled ? "TIME WARPED" : "GHOST ACTIVE";
    };

    // --- 2. THE NUCLEAR TIMER (Fix for Reset/Freeze/Unfreeze) ---
    // Definiujemy getter/setter na globalnym obiekcie, którego Testportal nie podmieni łatwo
    const setupNuclearTimer = () => {
        if (!window.Testportal || !window.Testportal.Timer) return;
        const timer = window.Testportal.Timer;

        // Zapobiegamy wielokrotnemu definiowaniu
        if (timer.__is_patched) return;
        timer.__is_patched = true;

        // Hack dla timerów opartych na instancjach i setInterval
        // Próbujemy nadpisać TimeLeft, żeby zwracał nasze mrożenie ALBO oryginał
        const originalGetTimeLeft = timer.getTimeLeft;

        Object.defineProperty(timer, 'getTimeLeft', {
            get: () => {
                return _c(() => {
                    if (isTimeFreezeEnabled) {
                        return window.__ultra_frozen_val || 3600; // 1h
                    }
                    return originalGetTimeLeft ? originalGetTimeLeft.call(timer) : 3600;
                }, 'getTimeLeft');
            },
            configurable: true
        });

        // Obsługa resetu
        timer.originalReset = timer.reset;
        timer.reset = _c(function () {
            window.__ultra_frozen_val = null;
            if (this.originalReset) this.originalReset();
            console.log("[Ultra] Hard timer reset executed");
        }, 'reset');
    };

    // --- 3. ANTI-TAMPER ---
    window.logToServer = _c(() => false, 'logToServer');
    try {
        Object.defineProperty(document, 'hasFocus', {
            get: () => { if (isGhostShieldEnabled) throw new ReferenceError("antiTestportalFeature"); return true; },
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

    // --- 4. COMMAND LISTENERS ---
    window.addEventListener("ultra_cmd_reset", () => {
        if (window.Testportal && window.Testportal.Timer) {
            window.Testportal.Timer.init?.();
            window.Testportal.Timer.reset?.();
            window.Testportal.Timer.start?.();
            window.__ultra_frozen_val = null;
        }
    });

    window.addEventListener("ultra_cmd_freeze", (e) => {
        isTimeFreezeEnabled = e.detail;
        if (isTimeFreezeEnabled && window.Testportal?.Timer?.getTimeLeft) {
            // Zapisujemy obecny czas jako punkt mrożenia
            try {
                window.__ultra_frozen_val = window.Testportal.Timer.getTimeLeft();
            } catch (e) { window.__ultra_frozen_val = 3600; }
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

    // Pętla synchronizacji
    setInterval(() => {
        if (!document.getElementById('mikus-hud-container')) createHUD();
        setupNuclearTimer();
        updateHudDisplay();

        // Blokada cheat_detected
        // @ts-ignore
        window.cheat_detected = false;
        // @ts-ignore
        window.remainingTime = isTimeFreezeEnabled ? 3600 : (window.remainingTime || 3600);
    }, 500);

})();
