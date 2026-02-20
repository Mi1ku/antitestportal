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
    let isAnswerBotEnabled = false;
    let isDockVisible = true;
    let searchEngine: 'google' | 'perplexity' = 'google';

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

    const triggerSideDock = (engine: 'google' | 'perplexity') => {
        searchEngine = engine;
        isDockVisible = true;
        updateAnswerFrame();
    };

    const searchNewTab = (engine: 'google' | 'perplexity') => {
        const selectors = [
            '.question-container', '.question-content', '.question-text', 'h3',
            '[class*="question"]', '.test-content__query'
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
        if (!questionText) return;

        let url = "";
        if (engine === 'google') url = `https://www.google.com/search?q=${encodeURIComponent(questionText)}`;
        else url = `https://www.perplexity.ai/search?q=${encodeURIComponent(questionText)}`;
        window.open(url, '_blank');
    }

    window.addEventListener('keydown', (e) => {
        // [PANIC MODE] Toggle HUD: Ctrl + Shift + Z
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
            e.preventDefault();
            isHudEnabled = !isHudEnabled;
            const h = document.getElementById(HUD_ID);
            if (h) h.style.display = isHudEnabled ? 'flex' : 'none';
            // Also toggle dock if hud disabled
            if (!isHudEnabled) {
                isDockVisible = false;
                updateAnswerFrame();
            }
            sendStateUpdate({ showHud: isHudEnabled });
            console.log(`[GHOST] HUD Toggled: ${isHudEnabled}`);
            return;
        }

        // [SIDE DOCK] Toggle Dock: Ctrl + Shift + X
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyX') {
            e.preventDefault();
            isDockVisible = !isDockVisible;
            updateAnswerFrame();
            console.log(`[GHOST] Dock Toggled: ${isDockVisible}`);
            return;
        }

        // [TIME FREEZE] Toggle Freeze: Ctrl + Shift + F
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            e.preventDefault();
            isTimeFreezeEnabled = !isTimeFreezeEnabled;
            updateHUD();
            sendStateUpdate({ timeFreeze: isTimeFreezeEnabled });
            console.log(`[GHOST] Time Freeze Toggled: ${isTimeFreezeEnabled}`);
            return;
        }

        // Legacy Shortcuts (New Tab)
        // Ctrl + Z -> Google
        if (e.ctrlKey && !e.shiftKey && e.code === 'KeyZ') {
            // e.preventDefault(); // Optional, might conflict with Undo
            searchNewTab('google');
        }
        // Ctrl + Shift + S -> Perplexity
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
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
            <div style="background:rgba(10, 10, 10, 0.95); backdrop-filter:blur(20px); border:1px solid rgba(50, 255, 100, 0.2); border-radius:50px; padding:8px 20px; color:#fff; font-family:'Segoe UI Emoji', 'Apple Color Emoji', 'Inter', sans-serif; font-size:11px; font-weight:800; display:flex; align-items:center; gap:16px; box-shadow:0 10px 40px rgba(0,0,0,0.6); pointer-events:auto; transition: all 0.3s ease;">
                
                <!-- Status Icon -->
                <div style="display:flex; align-items:center; opacity:0.8; font-size:16px;" title="Ochrona Aktywna">
                    🛡️
                </div>

                <!-- Divider -->
                <div style="width:1px; height:16px; background:rgba(255,255,255,0.1);"></div>

                <!-- Status Text -->
                <div style="display:flex; align-items:center; gap:8px; min-width:100px; justify-content:center;">
                    <div id="${DOT_ID}" style="width:6px; height:6px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6; transition:0.3s;"></div>
                    <span id="${TXT_ID}" style="letter-spacing:1px; font-family:'Inter', sans-serif;">ACTIVE</span>
                </div>

                <!-- Divider -->
                <div style="width:1px; height:16px; background:rgba(255,255,255,0.1);"></div>

                <!-- Dock Toggle -->
                <div id="btn-toggle-dock" title="Pokaż/Ukryj Asystenta (AI)" style="cursor:pointer; font-size:16px; opacity:0.8; transition:transform 0.2s; display:flex; align-items:center;" onmouseover="this.style.opacity=1;this.style.transform='scale(1.1)'" onmouseout="this.style.opacity=0.8;this.style.transform='scale(1)'">
                    👁️
                </div>
            </div>
        `;
        (document.body || document.documentElement).appendChild(h);

        const bd = h.querySelector('#btn-toggle-dock');
        if (bd) (bd as HTMLElement).onclick = () => {
            isDockVisible = !isDockVisible;
            updateAnswerFrame();
        };
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
            isAnswerBotEnabled = false;
            const h = document.getElementById(HUD_ID);
            if (h) h.style.display = 'none';
            syncState();
            return;
        }

        const wasFrozen = isTimeFreezeEnabled;
        isGhostShieldEnabled = cfg.antiAntiTampering;
        isTimeFreezeEnabled = cfg.timeFreeze;
        isHudEnabled = cfg.showHud;
        isAnswerBotEnabled = cfg.showAnswerBot;

        if ((cfg.searchEngine || 'google') !== searchEngine) {
            searchEngine = cfg.searchEngine || 'google';
            lastQuestion = "";
            updateAnswerFrame(); // INSTANT REFRESH
        }

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

    // --- SIDE DOCK / ANSWER FRAME ---
    const getQuestionText = () => {
        const selectors = [
            '.question_essence', '#question_essence', '.question-essence', '.question-text',
            '.question-container', '.question-content', '[class*="questionBody"]', '[class*="QuestionBody"]',
            'h3', '.test-content__query', '.question-view'
        ];
        for (const selector of selectors) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    const txt = (el as HTMLElement).innerText;
                    if (txt && txt.trim().length > 5) return txt.trim();
                }
            } catch (e) { }
        }
        return "";
    };

    const HUGE_TIME = 9999999;
    let lastQuestion = "";

    const updateAnswerFrame = () => {
        if (window.location.href.includes('test-result') || window.location.href.includes('LoadTestStart')) {
            const existingFrame = document.getElementById('shield-answer-container');
            if (existingFrame) existingFrame.style.display = 'none';
            return;
        }

        const existingContainer = document.getElementById('shield-answer-container');

        if (!isAnswerBotEnabled || !isGhostShieldEnabled) {
            if (existingContainer) existingContainer.style.display = 'none';
            return;
        }

        const qText = getQuestionText();
        if (!qText) {
            if (existingContainer) existingContainer.style.display = 'none';
            return;
        }

        const googleUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(qText)}`;
        const perplexityUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(qText)}`;

        const oldPanel = document.getElementById('shield-smart-search');
        if (oldPanel) oldPanel.remove();

        if (!existingContainer) {
            const c = document.createElement('div');
            c.id = 'shield-answer-container';
            c.style.cssText = `
                position: fixed; top: 15%; right: 20px; width: 380px; height: 600px;
                z-index: 2147483647; display: flex; flex-direction: column;
                background: rgba(15, 15, 20, 0.95); backdrop-filter: blur(15px);
                box-shadow: -10px 0 40px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px; overflow: hidden; font-family: 'Inter', system-ui, sans-serif;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(90deg, #1a1a2e, #16213e); padding: 12px 16px;
                display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);
            `;
            header.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                     <div style="width:8px; height:8px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6;"></div>
                     <span id="shield-engine-title" style="color:#fff; font-size:12px; font-weight:800; letter-spacing:1px;">AI ASSISTANT</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button id="btn-copy-q" title="Kopiuj Pytanie" style="background:transparent; border:none; color:#aaa; cursor:pointer; font-size:14px; transition:0.2s;">📋</button>
                    <button id="btn-close-dock" title="Zamknij" style="background:transparent; border:none; color:#aaa; cursor:pointer; font-size:14px; transition:0.2s;">✕</button>
                </div>
            `;
            c.appendChild(header);

            const content = document.createElement('div');
            content.id = 'shield-answer-content';
            content.style.cssText = `flex: 1; position: relative; background: #fff;`;
            c.appendChild(content);
            document.body.appendChild(c);

            const closeBtn = header.querySelector('#btn-close-dock') as HTMLElement;
            if (closeBtn) closeBtn.onclick = () => {
                isDockVisible = false;
                updateAnswerFrame();
            };
            const copyBtn = header.querySelector('#btn-copy-q') as HTMLElement;
            if (copyBtn) copyBtn.onclick = () => {
                navigator.clipboard.writeText(lastQuestion);
                copyBtn.innerHTML = "✅";
                setTimeout(() => copyBtn.innerHTML = "📋", 1000);
            };
        }

        const container = document.getElementById('shield-answer-container');
        if (container) {
            container.style.display = isDockVisible ? 'flex' : 'none';
        }

        if (!isDockVisible) return;

        const contentArea = document.getElementById('shield-answer-content');
        if (!contentArea) return;

        const titleEl = document.getElementById('shield-engine-title');
        if (titleEl) titleEl.innerText = searchEngine === 'google' ? 'GOOGLE SEARCH' : 'PERPLEXITY AI';

        if (qText !== lastQuestion) {
            lastQuestion = qText;
            contentArea.innerHTML = '';
            const targetUrl = searchEngine === 'perplexity' ? perplexityUrl : googleUrl;
            const iframe = document.createElement('iframe');
            iframe.src = targetUrl;
            iframe.style.cssText = "width:100%; height:100%; border:none;";
            iframe.allow = "clipboard-write; clipboard-read;";
            contentArea.appendChild(iframe);
        }
    };

    // --- MAIN LOOP ---
    setInterval(() => {
        if (isHudEnabled && !document.getElementById(HUD_ID) && (document.body || document.documentElement)) createHUD();
        updateAnswerFrame();

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
