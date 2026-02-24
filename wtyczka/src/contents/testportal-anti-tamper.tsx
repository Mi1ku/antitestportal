import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*",
        "https://*.testportal.com/*",
        "https://teams.microsoft.com/*"
    ],
    all_frames: true,
    run_at: "document_start",
    world: "MAIN"
};

(function () {
    const BANNER = `
    ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗
    ██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝
    ██║  ███╗███████║██║   ██║███████╗   ██║   
    ██║   ██║██╔══██║██║   ██║╚════██║   ██║   
    ╚██████╔╝██║  ██║╚██████╔╝███████║   ██║   
     ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   
    >>> ANTITESTPORTAL+ v1.0 GHOST READY <<<
    `;

    // --- SCOPE GUARD ---
    if (window.location.hostname.includes('testportal') && !window.location.href.includes('/exam/')) {
        console.log("[GHOST] Ignored non-exam page:", window.location.pathname);
        return;
    }

    console.log("%c" + BANNER, "color: #00ffcc; font-weight: bold;");

    // --- GLOBAL STATE ---
    let isGhostShieldEnabled = false;
    let isTimeFreezeEnabled = false;
    let isHudEnabled = false;

    // --- SYSTEM UTILS & STEALTH CORE ---
    const fakedFunctions = new Map();
    const originalToString = Function.prototype.toString;
    const _c = (fn: any, n?: string) => {
        if (!fn || typeof fn !== 'function') return fn;
        const name = n || fn.name || 'anonymous';
        fakedFunctions.set(fn, `function ${name}() { [native code] }`);
        try { Object.defineProperty(fn, 'name', { value: name, configurable: true }); } catch (e) { }
        return fn;
    };

    Function.prototype.toString = _c(function (this: any) {
        if (fakedFunctions.has(this)) return fakedFunctions.get(this);
        return originalToString.call(this);
    }, 'toString');

    const blockedEvents = ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'pagehide', 'beforeunload'];
    const originalWinAdd = window.addEventListener;
    const originalDocAdd = document.addEventListener;

    const wrapAddEventListener = (original: Function, name: string) => {
        return _c(function (this: any, type: string, listener: any, options: any) {
            if (isGhostShieldEnabled && blockedEvents.includes(type)) {
                return;
            }
            return original.apply(this, arguments);
        }, name);
    };

    try {
        window.addEventListener = wrapAddEventListener(originalWinAdd, 'addEventListener');
        document.addEventListener = wrapAddEventListener(originalDocAdd, 'addEventListener');
    } catch (e) { }

    try {
        const docProto = Document.prototype;
        const origVisDesc = Object.getOwnPropertyDescriptor(docProto, 'visibilityState');
        const origHiddenDesc = Object.getOwnPropertyDescriptor(docProto, 'hidden');

        Object.defineProperty(document, 'visibilityState', {
            get: _c(function () {
                if (isGhostShieldEnabled) return 'visible';
                return origVisDesc ? origVisDesc.get?.call(this) : 'visible';
            }, 'get visibilityState'),
            configurable: true
        });

        Object.defineProperty(document, 'hidden', {
            get: _c(function () {
                if (isGhostShieldEnabled) return false;
                return origHiddenDesc ? origHiddenDesc.get?.call(this) : false;
            }, 'get hidden'),
            configurable: true
        });

        const origHasFocus = document.hasFocus;
        document.hasFocus = _c(function () {
            if (isGhostShieldEnabled) return true;
            return origHasFocus.apply(this);
        }, 'hasFocus');

        Object.defineProperty(navigator, 'webdriver', {
            get: _c(function () {
                if (isGhostShieldEnabled) return false;
                return undefined;
            }, 'get webdriver'),
            configurable: true
        });

    } catch (e) {
        console.error("[GHOST] Patch error:", e);
    }

    // --- SEARCH & HOTKEYS ---
    const sendStateUpdate = (u: any) => {
        try { window.dispatchEvent(new CustomEvent("ultra_sync_update", { detail: u })); } catch (e) { }
    };

    const getEnhancedQuestionText = () => {
        const selectors = [
            '.question-container', '.question-content', '.question-text', 'h3',
            '[class*="question"]', '.test-content__query', '.question-view'
        ];
        let questionText = "";
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && (el as HTMLElement).innerText.trim().length > 5) {
                questionText = (el as HTMLElement).innerText.trim();
                break;
            }
        }
        if (!questionText) questionText = window.getSelection()?.toString().trim() || "";

        const answers = Array.from(document.querySelectorAll('.answer_container, .answer-label')).map(el => (el as HTMLElement).innerText.trim()).filter(t => t.length > 0);
        if (answers.length > 0) {
            questionText += "\n\nOdpowiedzi:\n" + answers.map(a => "- " + a).join("\n");
        }
        return questionText;
    };

    const searchNewTab = (engine: 'google' | 'perplexity') => {
        const questionText = getEnhancedQuestionText();
        if (!questionText) return;

        let url = "";
        if (engine === 'google') url = `https://www.google.com/search?q=${encodeURIComponent(questionText)}`;
        else url = `https://www.perplexity.ai/search?q=${encodeURIComponent(questionText)}`;
        window.open(url, '_blank', 'width=800,height=600');
    }

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
            e.preventDefault();
            isHudEnabled = !isHudEnabled;
            const h = document.getElementById(HUD_ID);
            if (h) h.style.display = isHudEnabled ? 'flex' : 'none';
            sendStateUpdate({ showHud: isHudEnabled });
            return;
        }

        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            e.preventDefault();
            isTimeFreezeEnabled = !isTimeFreezeEnabled;
            updateHUD();
            sendStateUpdate({ timeFreeze: isTimeFreezeEnabled });
            return;
        }

        if (e.altKey && e.code === 'KeyC') {
            e.preventDefault();
            const text = getEnhancedQuestionText();
            if (text) navigator.clipboard.writeText(text);
        }
        if (e.altKey && e.code === 'KeyG') {
            e.preventDefault();
            searchNewTab('google');
        }
        if (e.altKey && e.code === 'KeyP') {
            e.preventDefault();
            searchNewTab('perplexity');
        }
    }, true);

    // --- HUD ---
    const HUD_ID = 'shield-v108-hud';
    const DOT_ID = 'shield-v108-dot';
    const TXT_ID = 'shield-v108-txt';

    const createHUD = () => {
        if (document.getElementById(HUD_ID) || !isHudEnabled) return;
        const h = document.createElement('div');
        h.id = HUD_ID;
        // Nowy styl: Kompaktowa pigułka na dole ekranu
        h.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;pointer-events:none;`;

        h.innerHTML = `
            <div style="background:rgba(10, 10, 10, 0.95); backdrop-filter:blur(20px); border:1px solid rgba(50, 255, 100, 0.2); border-radius:50px; padding:8px 20px; color:#fff; font-family:'Inter', sans-serif; font-size:11px; font-weight:800; display:flex; align-items:center; gap:16px; box-shadow:0 10px 40px rgba(0,0,0,0.6); pointer-events:auto; transition: all 0.3s ease;">
                
                <!-- Status Icon (Shield SVG) -->
                <div style="display:flex; align-items:center; opacity:0.9;" title="Ochrona Aktywna">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 12.17l6.59-6.59L18 7l-8 10z"/>
                    </svg>
                </div>

                <!-- Divider -->
                <div style="width:1px; height:16px; background:rgba(255,255,255,0.1);"></div>

                <!-- Status Text -->
                <div style="display:flex; align-items:center; gap:8px; min-width:80px; justify-content:center;">
                    <div id="${DOT_ID}" style="width:6px; height:6px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6; transition:0.3s;"></div>
                    <span id="${TXT_ID}" style="letter-spacing:1px;">ACTIVE</span>
                </div>

            </div>
        `;
        (document.body || document.documentElement).appendChild(h);
    };

    const updateHUD = () => {
        const dot = document.getElementById(DOT_ID);
        const txt = document.getElementById(TXT_ID);
        if (dot) {
            if (isTimeFreezeEnabled) {
                dot.style.background = '#ff3b3b';
                dot.style.boxShadow = '0 0 15px #ff3b3b';
            } else if (isGhostShieldEnabled) {
                dot.style.background = '#0f6';
                dot.style.boxShadow = '0 0 15px #0f6';
            } else {
                dot.style.background = '#888';
                dot.style.boxShadow = 'none';
            }
        }
        if (txt) {
            if (isTimeFreezeEnabled) txt.innerText = 'TIME FROZEN';
            else if (isGhostShieldEnabled) txt.innerText = 'SHIELD ACTIVE';
            else txt.innerText = 'SHIELD OFF';
        }
    };

    // --- TIME & SYNC ---
    let originalDateNow = Date.now;
    let frozenTimestamp = 0;
    let originalStartTime = 0;

    const syncState = () => {
        (window as any).__ghost_active = isGhostShieldEnabled;
        (window as any).__freeze_active = isTimeFreezeEnabled;
    };

    window.addEventListener("ultra_sync", (e: any) => {
        const cfg = e.detail;
        if (!cfg.shieldKey) {
            isGhostShieldEnabled = false;
            isTimeFreezeEnabled = false;
            Date.now = originalDateNow;
            isHudEnabled = false;
            const h = document.getElementById(HUD_ID);
            if (h) h.style.display = 'none';
            syncState();
            return;
        }

        const wasFrozen = isTimeFreezeEnabled;
        isGhostShieldEnabled = cfg.antiAntiTampering;
        isTimeFreezeEnabled = cfg.timeFreeze;
        isHudEnabled = cfg.showHud;

        syncState();

        const h = document.getElementById(HUD_ID);
        if (h) h.style.display = isHudEnabled ? 'flex' : 'none';

        updateHUD();

        if (isTimeFreezeEnabled && !wasFrozen) {
            frozenTimestamp = originalDateNow();
            Date.now = () => frozenTimestamp;
            freezeDomVisuals();
        } else if (!isTimeFreezeEnabled && wasFrozen) {
            Date.now = originalDateNow;
            if (originalStartTime > 0) {
                (window as any).startTime = originalStartTime;
                originalStartTime = 0;
            }
        }
    });

    const freezeDomVisuals = () => {
        if (!isTimeFreezeEnabled) return;
        try {
            if (originalStartTime === 0 && (window as any).startTime) {
                originalStartTime = (window as any).startTime;
            }
            if ((window as any).startTime) {
                (window as any).startTime = new Date().getTime() + 999999999;
            }
            const h = document.getElementById('rem_hours');
            const m = document.getElementById('rem_minutes');
            const s = document.getElementById('rem_seconds');
            if (h) h.innerText = "99";
            if (m) m.innerText = "99";
            if (s) s.innerText = "99";
        } catch (e) { }
        requestAnimationFrame(freezeDomVisuals);
    };

    let originalDisplayTime: any = null;
    Object.defineProperty(window, 'displayTime', {
        get: () => {
            return (e: any) => {
                if ((window as any).__freeze_active) {
                    const s = document.getElementById('rem_seconds');
                    if (s) s.innerText = "--";
                    return;
                }
                if (originalDisplayTime) originalDisplayTime(e);
            }
        },
        set: (fn) => { originalDisplayTime = fn; },
        configurable: true
    });

    // --- ON-PAGE TOOLS INJECTOR ---
    const injectTools = () => {
        if (!isGhostShieldEnabled) return;

        // Toolbar
        const qContainer = document.querySelector('.question-container') || document.querySelector('.question-view');
        if (qContainer && !document.getElementById('shield-tools-bar')) {
            const bar = document.createElement('div');
            bar.id = 'shield-tools-bar';
            bar.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 8px; display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap;';
            bar.innerHTML = `
                <button id="btn-t-copy" style="padding: 6px 12px; background: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; color: #333;">📋 Kopiuj Test (Alt+C)</button>
                <button id="btn-t-g" style="padding: 6px 12px; background: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; color: #333;">🔍 Google (Alt+G)</button>
                <button id="btn-t-p" style="padding: 6px 12px; background: #fff; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; color: #333;">🧠 Perplexity (Alt+P)</button>
            `;
            qContainer.appendChild(bar);

            bar.querySelector('#btn-t-copy')?.addEventListener('click', (e) => {
                e.preventDefault();
                const text = getEnhancedQuestionText();
                if (text) navigator.clipboard.writeText(text);
                (e.target as HTMLElement).innerText = "✅ Skopiowano!";
                setTimeout(() => { if (e.target) (e.target as HTMLElement).innerText = "📋 Kopiuj Test (Alt+C)"; }, 2000);
            });
            bar.querySelector('#btn-t-g')?.addEventListener('click', (e) => { e.preventDefault(); searchNewTab('google'); });
            bar.querySelector('#btn-t-p')?.addEventListener('click', (e) => { e.preventDefault(); searchNewTab('perplexity'); });
        }

        // Otwartych Odpowiedzi Kopiowanie
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(ta => {
            if (!ta.parentElement?.querySelector('.btn-copy-ans')) {
                const btn = document.createElement('button');
                btn.className = 'btn-copy-ans';
                btn.innerText = '📋 Kopiuj Twoją Odpowiedź';
                btn.style.cssText = 'display: block; margin-top: 5px; padding: 4px 8px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 11px;';
                btn.onclick = (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(ta.value);
                    btn.innerText = '✅ Skopiowano!';
                    setTimeout(() => btn.innerText = '📋 Kopiuj Twoją Odpowiedź', 2000);
                };
                ta.parentElement?.insertBefore(btn, ta.nextSibling);
            }
        });

        // Zamkniętych - Zaznaczanie
        const labels = document.querySelectorAll('label.answer-label, .answer_container label');
        labels.forEach(lbl => {
            if (!lbl.parentElement?.querySelector('.btn-mark-ans')) {
                const btn = document.createElement('button');
                btn.className = 'btn-mark-ans';
                btn.innerHTML = '🖍️ Zaznacz';
                btn.style.cssText = 'margin-left: 10px; padding: 2px 6px; background: transparent; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 10px; opacity: 0.6;';
                btn.onmouseover = () => btn.style.opacity = '1';
                btn.onmouseout = () => btn.style.opacity = '0.6';
                btn.onclick = (e) => {
                    e.preventDefault();
                    const isMarked = (lbl as HTMLElement).style.textDecoration === 'underline';
                    (lbl as HTMLElement).style.textDecoration = isMarked ? 'none' : 'underline';
                    (lbl as HTMLElement).style.textDecorationColor = isMarked ? 'transparent' : '#0f6';
                    (lbl as HTMLElement).style.textDecorationThickness = '2px';
                    (lbl as HTMLElement).style.backgroundColor = isMarked ? '' : 'rgba(0, 255, 100, 0.1)';
                };
                lbl.parentElement?.appendChild(btn);
            }
        });
    };

    const HUGE_TIME = 9999999;

    // --- MAIN LOOP ---
    setInterval(() => {
        if (isHudEnabled && !document.getElementById(HUD_ID) && (document.body || document.documentElement)) createHUD();
        injectTools();

        const tp = (window as any).Testportal;
        if (tp && tp.Timer && !tp.Timer.__patched) {
            tp.Timer.__patched = true;
            const timer = tp.Timer;
            const orig = timer.getTimeLeft;
            if (typeof orig === 'function') {
                Object.defineProperty(timer, 'getTimeLeft', {
                    get: () => _c(() => isTimeFreezeEnabled ? HUGE_TIME : orig.call(timer), 'getTimeLeft'),
                    configurable: true
                });
                console.log("%c[GHOST] Time Freeze Engine Hooked!", "color: #00ffcc;");
            }
        }
        if (isGhostShieldEnabled) {
            (window as any).cheat_detected = false;
        }
    }, 500);

})();

export default () => null;
