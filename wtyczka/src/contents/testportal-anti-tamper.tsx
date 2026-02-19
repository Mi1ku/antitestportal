import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: [
        "https://*.testportal.pl/*",
        "https://*.testportal.net/*",
        "https://*.testportal.online/*",
        "https://*.testportal.com/*",
        "https://teams.microsoft.com/*" // Dodano Teams
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
    // Działaj tylko na stronach egzaminu (testportal) lub Teams. Ignoruj panel managera i stronę główną.
    if (window.location.hostname.includes('testportal') && !window.location.href.includes('/exam/')) {
        console.log("[GHOST] Ignored non-exam page:", window.location.pathname);
        return;
    }

    console.log("%c" + BANNER, "color: #00ffcc; font-weight: bold;");

    let isGhostShieldEnabled = false; // Domyślnie wyłączone
    let isTimeFreezeEnabled = false;
    let isHudEnabled = false; // Domyślnie wyłączone
    let isAnswerBotEnabled = false;
    let searchEngine: 'google' | 'perplexity' = 'google';

    // --- TIME WARP ENGINE (NUCLEAR) ---
    let originalDateNow = Date.now;
    let frozenTimestamp = 0;
    let originalStartTime = 0;

    // ... reszta zmiennych ...

    // --- BRUTAL VISUAL FREEZE ---
    const freezeDomVisuals = () => {
        if (!isTimeFreezeEnabled) return;

        try {
            // Save original start time once
            if (originalStartTime === 0 && (window as any).startTime) {
                originalStartTime = (window as any).startTime;
            }

            // [LOGIC FREEZE] - Override global start/end times
            if ((window as any).startTime) {
                (window as any).startTime = new Date().getTime() + 999999999;
            }
            // (window as any).endTime = new Date().getTime() + 9999999999; // Don't touch end time excessively

            const h = document.getElementById('rem_hours');
            const m = document.getElementById('rem_minutes');
            const s = document.getElementById('rem_seconds');

            // Set to "99" as requested
            if (h) h.innerText = "99";
            if (m) m.innerText = "99";
            if (s) s.innerText = "99";
        } catch (e) { }

        requestAnimationFrame(freezeDomVisuals);
    };

    // --- SEKCJA SEARCH (GOOGLE / AI) ---
    const searchQuestion = (engine: 'google' | 'perplexity') => {
        // Bardziej agresywne szukanie treści pytania
        const selectors = [
            '.question-container',
            '.question-content',
            '.question-text',
            'h3',
            '[class*="question"]',
            '.test-content__query'
        ];

        let questionText = "";
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && (el as HTMLElement).innerText.trim().length > 5) {
                questionText = (el as HTMLElement).innerText.trim();
                break;
            }
        }

        if (!questionText) {
            // Próba pobrania z zaznaczenia jeśli nic nie znaleziono automatycznie
            questionText = window.getSelection()?.toString().trim() || "";
        }

        if (!questionText) return;

        let url = "";
        if (engine === 'google') url = `https://www.google.com/search?q=${encodeURIComponent(questionText)}`;
        else url = `https://www.perplexity.ai/search?q=${encodeURIComponent(questionText)}`;

        window.open(url, '_blank');
    };

    // Obsługa skrótów klawiszowych
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
            e.preventDefault();
            searchQuestion('google');
        }
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            searchQuestion('perplexity');
        }
    }, true);

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

    const patch = (obj: any, prop: string, value: any, asGetter = false) => {
        try {
            if (!obj) return;
            if (asGetter) {
                Object.defineProperty(obj, prop, { get: _c(value, prop), configurable: true });
            } else {
                Object.defineProperty(obj, prop, { value: _c(value, prop), configurable: true });
            }
        } catch (e) { }
    };

    // --- NUCLEAR STEALTH & EVENTS 3.0 (SAFE INSTANCE WRAP) ---
    const blockedEvents = ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'pagehide', 'beforeunload'];

    // Save original instance methods (not prototypes to avoid integrity checks on prototypes)
    const originalWinAdd = window.addEventListener;
    const originalDocAdd = document.addEventListener;

    const wrapAddEventListener = (original: Function, name: string) => {
        return _c(function (this: any, type: string, listener: any, options: any) {
            // DYNAMIC CHECK: If shield is ON and event is blocked -> MUTE IT
            if (isGhostShieldEnabled && blockedEvents.includes(type)) {
                // console.log(`%c[GHOST] Muted dynamic event: ${type}`, "color: #00ffcc; opacity: 0.5;");
                return;
            }
            // Otherwise -> PASS THROUGH
            return original.apply(this, arguments);
        }, name);
    };

    // Override instances directly (safer than prototype proxying)
    try {
        window.addEventListener = wrapAddEventListener(originalWinAdd, 'addEventListener');
        document.addEventListener = wrapAddEventListener(originalDocAdd, 'addEventListener');
    } catch (e) { }

    // --- PROPERTY SYNC (DYNAMIC) ---
    // Safely patch properties using Object.defineProperty on instances
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

        // Patch webdriver safely
        // Only patch if it exists or we want to hide it. 
        // Chrome default is undefined if not automated. Automated is true/false.
        // We force false if enabled, otherwise undefined.
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

    const HUD_ID = 'shield-v108-hud';
    const DOT_ID = 'shield-v108-dot';
    const TXT_ID = 'shield-v108-txt';

    const createHUD = () => {
        if (document.getElementById(HUD_ID) || !isHudEnabled) return;
        const h = document.createElement('div');
        h.id = HUD_ID;
        h.style.cssText = `position:fixed;bottom:15px;right:15px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none;`;
        h.innerHTML = `
            <div style="display:flex;gap:6px;pointer-events:auto;margin-bottom:2px;">
                <div id="btn-google" style="background:rgba(0,0,0,0.92);border:1px solid rgba(0,255,102,0.3);border-radius:12px;padding:6px 12px;color:#fff;font-family:sans-serif;font-size:10px;font-weight:900;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,0.5);">GOOGLE</div>
                <div id="btn-ai" style="background:rgba(0,0,0,0.92);border:1px solid rgba(0,255,102,0.3);border-radius:12px;padding:6px 12px;color:#fff;font-family:sans-serif;font-size:10px;font-weight:900;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,0.5);">AI Search</div>
            </div>
            <div style="background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);border:1px solid rgba(0,255,102,0.4);border-radius:24px;padding:10px 20px;color:#fff;font-family:sans-serif;font-size:10px;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 10px 40px rgba(0,0,0,0.8);">
                <div id="${DOT_ID}" style="width:8px;height:8px;background:#0f6;border-radius:50%;box-shadow:0 0 15px #0f6;transition:0.3s;"></div>
                <span id="${TXT_ID}">SHIELD ACTIVE</span>
            </div>
        `;
        (document.body || document.documentElement).appendChild(h);

        const bg = h.querySelector('#btn-google');
        const ba = h.querySelector('#btn-ai');
        if (bg) (bg as HTMLElement).onclick = () => searchQuestion('google');
        if (ba) (ba as HTMLElement).onclick = () => searchQuestion('perplexity');
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
                dot.style.background = '#888'; // Grey for OFF
                dot.style.boxShadow = 'none';
            }
        }
        if (txt) {
            if (isTimeFreezeEnabled) txt.innerText = 'TIME FROZEN';
            else if (isGhostShieldEnabled) txt.innerText = 'SHIELD ACTIVE';
            else txt.innerText = 'SHIELD OFF';
        }
    };

    // Synchronizacja stanu z Window dla hooków
    const syncState = () => {
        (window as any).__ghost_active = isGhostShieldEnabled;
        (window as any).__freeze_active = isTimeFreezeEnabled;
    };

    window.addEventListener("ultra_sync", (e: any) => {
        const cfg = e.detail;

        // SECURITY CHECK
        if (!cfg.shieldKey) {
            isGhostShieldEnabled = false;
            isTimeFreezeEnabled = false;
            // Restore time just in case
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
        // Detect engine change to force refresh
        if ((cfg.searchEngine || 'google') !== searchEngine) {
            searchEngine = cfg.searchEngine || 'google';
            lastQuestion = ""; // Force refresh frame
        }

        syncState(); // update window flags

        const h = document.getElementById(HUD_ID);
        if (h) h.style.display = isHudEnabled ? 'flex' : 'none';

        updateHUD();

        // [NUCLEAR TIME STOP]
        if (isTimeFreezeEnabled && !wasFrozen) {
            // STOP TIME
            frozenTimestamp = originalDateNow();
            Date.now = () => frozenTimestamp;
            console.log("%c[GHOST] Time STOPPED at " + frozenTimestamp, "color: red; font-weight: bold;");

            freezeDomVisuals();
        } else if (!isTimeFreezeEnabled && wasFrozen) {
            // RESUME TIME
            Date.now = originalDateNow;
            if (originalStartTime > 0) {
                (window as any).startTime = originalStartTime;
                originalStartTime = 0;
            }
            console.log("%c[GHOST] Time RESUMED.", "color: green; font-weight: bold;");
        }
    });

    // --- HOOKING TIMERS & DISPLAY ---
    // Hook na displayTime (Testportal function)
    let originalDisplayTime: any = null;
    Object.defineProperty(window, 'displayTime', {
        get: () => {
            return (e: any) => {
                if ((window as any).__freeze_active) {
                    // Update HUD status only, but DON'T update the DOM clock
                    // Opcjonalnie możemy wymusić wizualny "STOP" tutaj
                    const s = document.getElementById('rem_seconds');
                    if (s) s.innerText = "--";
                    return;
                }
                if (originalDisplayTime) originalDisplayTime(e);
            }
        },
        set: (fn) => {
            originalDisplayTime = fn;
        },
        configurable: true
    });


    const getQuestionText = () => {
        const selectors = [
            // Priority Selectors
            '.question_essence',
            '#question_essence',
            '.question-essence',
            '.question-text',

            // Fallbacks
            '.question-container',
            '.question-content',
            '[class*="questionBody"]', // New pattern
            '[class*="QuestionBody"]',
            'h3',
            '.test-content__query',
            '.question-view'
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
        // [FIX] Nie pokazuj bota na stronie wyników ani startowej
        if (window.location.href.includes('test-result') || window.location.href.includes('LoadTestStart')) {
            const existingPanel = document.getElementById('shield-smart-search');
            if (existingPanel) existingPanel.style.display = 'none';
            return;
        }

        const existingPanel = document.getElementById('shield-smart-search');

        // Jeśli bot wyłączony LUB brak ochrony (user wylogowany/shield off), chowamy panel
        if (!isAnswerBotEnabled || !isGhostShieldEnabled) {
            if (existingPanel) existingPanel.style.display = 'none';
            return;
        }

        const qText = getQuestionText();
        // Jeśli nie znaleziono tekstu, też chowamy (żeby nie wisiał pusty panel)
        if (!qText) {
            if (existingPanel) existingPanel.style.display = 'none';
            return;
        }

        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(qText)}`;
        const perplexityUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(qText)}`;

        if (!existingPanel) {
            // Próba znalezienia kontenera
            const qContainer =
                document.querySelector('.question-container') ||
                document.querySelector('.test-content') ||
                document.querySelector('.question_essence') ||
                document.querySelector('#question_essence') ||
                document.querySelector('.question-view');

            if (qContainer) {
                // Remove old iframe if exists
                const oldIframe = document.getElementById('shield-answer-frame');
                if (oldIframe) oldIframe.remove();

                const p = document.createElement('div');
                p.id = 'shield-smart-search';
                p.style.cssText = `
                    width: 100%;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 12px;
                    background: rgba(10, 10, 15, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    font-family: 'Inter', sans-serif;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    color: #fff;
                    transition: all 0.3s ease;
                `;

                p.innerHTML = `
                    <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                        🤖 AntiTestportal Smart Search
                    </div>
                    <div id="smart-q-preview" style="font-size: 13px; color: #ddd; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 95%;">
                        ${qText}
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 5px;">
                        <button id="btn-smart-google" style="
                            flex: 1;
                            background: linear-gradient(135deg, #4285F4, #34A853);
                            border: none;
                            padding: 8px 12px;
                            border-radius: 8px;
                            color: white;
                            font-weight: 600;
                            font-size: 12px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 6px;
                            transition: transform 0.2s;
                        ">
                            <span>🔎</span> Google
                        </button>
                        <button id="btn-smart-perplexity" style="
                            flex: 1;
                            background: linear-gradient(135deg, #229ba3, #156d73);
                            border: none;
                            padding: 8px 12px;
                            border-radius: 8px;
                            color: white;
                            font-weight: 600;
                            font-size: 12px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 6px;
                            transition: transform 0.2s;
                        ">
                            <span>🧠</span> Perplexity AI
                        </button>
                    </div>
                `;

                qContainer.appendChild(p);

                // Add hover effects via JS
                const b1 = p.querySelector('#btn-smart-google') as HTMLElement;
                const b2 = p.querySelector('#btn-smart-perplexity') as HTMLElement;

                if (b1) {
                    b1.onmouseover = () => b1.style.transform = "translateY(-2px)";
                    b1.onmouseout = () => b1.style.transform = "translateY(0)";
                    b1.onclick = () => window.open(googleUrl, 'GoogleSearch', 'width=500,height=800,menubar=0,toolbar=0,location=0,scrollbars=1,resizable=1');
                }
                if (b2) {
                    b2.onmouseover = () => b2.style.transform = "translateY(-2px)";
                    b2.onmouseout = () => b2.style.transform = "translateY(0)";
                    b2.onclick = () => window.open(perplexityUrl, 'PerplexitySearch', 'width=500,height=800,menubar=0,toolbar=0,location=0,scrollbars=1,resizable=1');
                }

            } else {
                console.log("[GHOST] Nie znaleziono kontenera dla Smart Search.");
            }
        } else {
            // Update existing panel
            existingPanel.style.display = 'flex';
            const preview = existingPanel.querySelector('#smart-q-preview');
            const b1 = existingPanel.querySelector('#btn-smart-google') as HTMLElement;
            const b2 = existingPanel.querySelector('#btn-smart-perplexity') as HTMLElement;

            if (preview && qText !== preview.innerHTML) preview.innerHTML = qText;

            // Update clicks with new question
            if (b1) b1.onclick = () => window.open(googleUrl, 'GoogleSearch', 'width=500,height=800,menubar=0,toolbar=0,location=0,scrollbars=1,resizable=1');
            if (b2) b2.onclick = () => window.open(perplexityUrl, 'PerplexitySearch', 'width=500,height=800,menubar=0,toolbar=0,location=0,scrollbars=1,resizable=1');
        }
    };

    setInterval(() => {
        if (isHudEnabled && !document.getElementById(HUD_ID) && (document.body || document.documentElement)) createHUD();
        updateAnswerFrame();

        // Wizualny Freeze DOM (żeby user widział że stoi) - Usunięto, bo displayTime hook to załatwia
        // if (isTimeFreezeEnabled) {
        //     try {
        //         const s = document.getElementById('rem_seconds');
        //         const m = document.getElementById('rem_minutes');
        //         const h = document.getElementById('rem_hours');

        //         if (s) (s as HTMLElement).innerText = "00";
        //         if (m) (m as HTMLElement).innerText = "--";
        //         if (h) (h as HTMLElement).innerText = "--";
        //     } catch (e) { }
        // }


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
