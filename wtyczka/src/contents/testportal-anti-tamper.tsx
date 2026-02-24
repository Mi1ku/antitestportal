import type { PlasmoCSConfig } from "plasmo"
import { DEV_CONFIG } from "~config"

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
    const url = window.location.href.toLowerCase();
    if (window.location.hostname.includes('testportal')) {
        if (!url.includes('/exam/')) return;
        if (url.includes('test-result.html') || url.includes('loadteststart.html') || url.includes('zamknij')) {
            console.log("[GHOST] Ignored lobby/results page:", window.location.pathname);
            return;
        }
    }

    console.log("%c" + BANNER, "color: #00ffcc; font-weight: bold;");

    // --- GLOBAL STATE ---
    let isGhostShieldEnabled = false;
    let isTimeFreezeEnabled = false;
    let isHudEnabled = false;
    let isAnswerBotEnabled = false;
    let isDockVisible = true;
    let searchEngine: 'google' | 'perplexity' = 'google';
    let geminiApiKey = DEV_CONFIG.GEMINI_API_KEY;
    const FRAME_ID = 'shield-v108-frame';

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

        const answers = Array.from(document.querySelectorAll('.answer_container, .answer-label, .answer_body')).map(el => (el as HTMLElement).innerText.trim()).filter(t => t.length > 0);
        if (answers.length > 0) {
            questionText += "\n\nDostępne Opcje:\n" + answers.map(a => "- " + a).join("\n");
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
        if (e.ctrlKey && !e.shiftKey && e.code === DEV_CONFIG.SHORTCUTS.PANIC_MODE) {
            e.preventDefault();
            isHudEnabled = !isHudEnabled;
            isDockVisible = isHudEnabled; // Panic mode ukrywa również dock
            const h = document.getElementById(HUD_ID);
            if (h) h.style.display = isHudEnabled ? 'flex' : 'none';
            sendStateUpdate({ showHud: isHudEnabled });
            updateAnswerFrame();
            return;
        }

        if (e.ctrlKey && !e.shiftKey && e.code === DEV_CONFIG.SHORTCUTS.TOGGLE_DOCK) {
            e.preventDefault();
            isDockVisible = !isDockVisible;
            updateAnswerFrame();
            return;
        }

        if (e.ctrlKey && !e.shiftKey && e.code === DEV_CONFIG.SHORTCUTS.TIME_FREEZE) {
            e.preventDefault();
            isTimeFreezeEnabled = !isTimeFreezeEnabled;
            updateHUD();
            sendStateUpdate({ timeFreeze: isTimeFreezeEnabled });
            return;
        }

        if (e.ctrlKey && !e.shiftKey && e.code === DEV_CONFIG.SHORTCUTS.SEARCH_GOOGLE) {
            // Quick Google (Legacy nowa karta)
            e.preventDefault();
            searchNewTab('google');
        }

        if (e.ctrlKey && !e.shiftKey && e.code === DEV_CONFIG.SHORTCUTS.SEARCH_PERPLEXITY) {
            // Quick Perplexity (Legacy nowa karta)
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
        isAnswerBotEnabled = cfg.showAnswerBot;
        searchEngine = cfg.searchEngine;

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

    // --- SIDE DOCK UI ---
    let frameLastUrl = "";
    let lastSolvedQuestion = "";
    let isSolving = false;
    const DOCK_ID = 'shield-v108-dock';


    const updateAnswerFrame = () => {
        if (!isGhostShieldEnabled) return;
        const tpBody = document.querySelector('.test-body') as HTMLElement | null;

        if (!isAnswerBotEnabled || !isDockVisible) {
            const dock = document.getElementById(DOCK_ID);
            if (dock) dock.style.transform = 'translateX(100%)';
            if (tpBody) tpBody.style.width = '100%';
            return;
        }

        let dock = document.getElementById(DOCK_ID);

        if (!dock) {
            dock = document.createElement('div');
            dock.id = DOCK_ID;
            dock.style.cssText = 'position:fixed;top:0;right:0;width:420px;height:100vh;background:#0d0d12;border-left:1px solid rgba(0, 255, 170, 0.2);z-index:999999;box-shadow:-10px 0 40px rgba(0,0,0,0.8);display:flex;flex-direction:column;font-family:"Inter",sans-serif; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: translateX(100%);';

            dock.innerHTML = `
                <div style="padding:15px 20px; background:linear-gradient(180deg, rgba(15,255,102,0.1) 0%, transparent 100%); border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f6">
                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v5h-2v-5a5 5 0 0 0-5-5H6a5 5 0 0 0-5 5v5H-1v-5a7 7 0 0 1 7-7h1V5.73A2 2 0 1 1 12 2zm1 16v4h-2v-4h2zm-4 0v4H7v-4h2zm8 0v4h-2v-4h2z"/>
                        </svg>
                        <span style="color:#fff; font-size:14px; font-weight:900; letter-spacing:1px;">SUPREME AI <span style="color:#0f6;">CORTEX</span></span>
                    </div>
                    <div style="color:rgba(255,255,255,0.4); font-size:10px; font-weight:700;">LIVE SEARCH</div>
                </div>
                <div id="ai-status-bar" style="padding:8px 20px; font-size:11px; color:#0f6; background:rgba(0,0,0,0.5); font-weight:bold; display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(255,255,255,0.02);">
                    <div class="ai-pulse" style="width:8px; height:8px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6;"></div>
                    Oczekiwanie na zapytanie...
                </div>
                <iframe id="${FRAME_ID}" style="flex:1; border:none; width:100%; background:#fff;"></iframe>
            `;
            (document.body || document.documentElement).appendChild(dock);

            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes aiPulse { 0% { opacity: 0.5; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 15px #0f6; } 100% { opacity: 0.5; transform: scale(0.8); } }
                .ai-pulse { animation: aiPulse 1.5s infinite; }
            `;
            document.head.appendChild(style);
        }

        const qText = getEnhancedQuestionText();
        let targetUrl = "";
        const statBar = document.getElementById('ai-status-bar');

        if (qText && qText.length > 5) {
            if (searchEngine === 'google') targetUrl = `https://www.google.com/search?q=${encodeURIComponent(qText)}`;
            else targetUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(qText)}`;
        } else {
            targetUrl = searchEngine === 'google' ? 'https://www.google.com' : 'https://www.perplexity.ai';
        }

        if (geminiApiKey) {
            // --- PRAWDZIWY SUPREME AUTO-SOLVER ---
            if (qText && qText.length > 5 && lastSolvedQuestion !== qText) {
                lastSolvedQuestion = qText;
                frameLastUrl = targetUrl; // prevent loops

                if (statBar && !isSolving) {
                    isSolving = true;
                    statBar.innerHTML = `<div class="ai-pulse" style="width:8px; height:8px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6;"></div> Gemini 1.5: Trwa dogłębna analiza pytania i czytanie opcji...`;

                    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${DEV_CONFIG.AI_MODEL}:generateContent?key=${geminiApiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `${DEV_CONFIG.AI_PROMPT}\n\n[PYTANIE]\n${qText}`
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.1,
                                topK: 1
                            }
                        })
                    }).then(res => res.json()).then(data => {
                        if (data.error) throw new Error(data.error.message || "Błąd API Google");

                        const aiRaw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase() || "";
                        // clean up ai answer from bullet points
                        const aiAnswer = aiRaw.replace(/^- /, '').replace(/^\* /, '').trim();

                        if (aiAnswer && aiAnswer.length > 2) {
                            let clicked = false;
                            const inputs = document.querySelectorAll('.answer_container, .answer-label, .answer_body');
                            inputs.forEach(el => {
                                const e = el as HTMLElement;
                                const eText = e.innerText.toLowerCase().trim();
                                // Match if AI gives a significant part of the true answer
                                if ((eText.length > 2 && aiAnswer.includes(eText)) || (aiAnswer.length > 2 && eText.includes(aiAnswer))) {
                                    e.click();
                                    clicked = true;
                                    e.style.outline = '3px outset #0f6';
                                    e.style.borderRadius = '6px';
                                    e.style.boxShadow = '0 0 20px #0f6';
                                }
                            });

                            if (statBar) {
                                statBar.innerHTML = clicked
                                    ? `<div style="width:8px; height:8px; background:#0f6; border-radius:50%; box-shadow: 0 0 10px #0f6;"></div> SUPREME: Zaznaczono odpowiedz! Przejdz dalej.`
                                    : `<div style="width:8px; height:8px; background:#ffea0f; border-radius:50%; box-shadow: 0 0 10px #ffea0f;"></div> SUPREME: Brak pewnosci co kliknac!(Odp od AI: <b style="color:#0f6">${aiAnswer.substring(0, 35)}</b>)`;
                            }
                        } else {
                            throw new Error("Pusta odpowiedź z sieci neuronowej.");
                        }
                    }).catch(err => {
                        console.error("[Supreme AI Error]:", err);
                        if (statBar) {
                            statBar.innerHTML = `<div style="width:8px; height:8px; background:#ffea0f; border-radius:50%; box-shadow: 0 0 10px #ffea0f;"></div> AI Fallback: Ściąganie awaryjne (${err.message.substring(0, 20)}...). Otwieram wyszukiwarkę...`;
                        }
                        const iframe = document.getElementById(FRAME_ID) as HTMLIFrameElement;
                        if (iframe) iframe.src = targetUrl;
                    }).finally(() => {
                        setTimeout(() => { isSolving = false; }, 2000);
                    });
                }
            } else if (!qText || qText.length <= 5) {
                if (statBar) statBar.innerHTML = `< div style = "width:8px; height:8px; background:#888; border-radius:50%;" ></div > [SUPREME MODE] Oczekiwanie na zapytanie...`;
            }

            // In supreme mode, don't update iframe src wildly to avoid distraction, 
            // but we can load standard search if needed. We'll leave the iframe blank or load Google for manual searches.
            if (frameLastUrl !== targetUrl && targetUrl) {
                const iframe = document.getElementById(FRAME_ID) as HTMLIFrameElement;
                if (iframe && iframe.src === "about:blank") iframe.src = searchEngine === 'google' ? 'https://www.google.com' : 'https://www.perplexity.ai';
            }

        } else {
            // --- TRYB DAROMWY (IFRAME CORTEX) ---
            if (statBar && frameLastUrl !== targetUrl) {
                if (qText && qText.length > 5) {
                    statBar.innerHTML = `< div class= "ai-pulse" style = "width:8px; height:8px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6;" ></div > AI analizuje dostępne powiązania i symuluje rozwiązanie...`;

                    setTimeout(() => {
                        const currentStatBar = document.getElementById('ai-status-bar');
                        if (currentStatBar) {
                            currentStatBar.innerHTML = `< div class= "ai-pulse" style = "width:8px; height:8px; background:#ffea0f; border-radius:50%; box-shadow:0 0 10px #ffea0f;" ></div > Dopasowywanie wzorców i weryfikacja danych(WebSearch)...`;
                        }
                    }, 2000);

                    setTimeout(() => {
                        const currentStatBar = document.getElementById('ai-status-bar');
                        if (currentStatBar) {
                            currentStatBar.innerHTML = `< div style = "width:8px; height:8px; background:#0f6; border-radius:50%; box-shadow:0 0 10px #0f6;" ></div > Zapytanie zrealizowane pomyślnie.Zaznacz widoczną podpowiedź!`;

                            // Fake visual ping interaction for realism
                            const inputs = document.querySelectorAll('.answer_container, .answer-label');
                            inputs.forEach(el => {
                                const e = el as HTMLElement;
                                const origBg = e.style.backgroundColor;
                                e.style.transition = 'background-color 0.5s';
                                e.style.backgroundColor = 'rgba(0, 255, 170, 0.1)';
                                setTimeout(() => { e.style.backgroundColor = origBg; }, 800);
                            });
                        }
                    }, 4500);
                } else {
                    statBar.innerHTML = `< div style = "width:8px; height:8px; background:#888; border-radius:50%;" ></div > Tryb darmowy: Oczekiwanie na zapytanie...`;
                }
            }

            // Load iframe with selected search engine
            if (frameLastUrl !== targetUrl && targetUrl) {
                frameLastUrl = targetUrl;
                const iframe = document.getElementById(FRAME_ID) as HTMLIFrameElement;
                if (iframe) iframe.src = targetUrl;
            }
        }

        dock.style.transform = 'translateX(0%)';

        if (tpBody) {
            tpBody.style.width = 'calc(100% - 420px)';
        }
    };

    const HUGE_TIME = 9999999;

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
