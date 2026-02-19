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
    >>> SUPREME v1.0.8 GHOST ULTIMATE READY <<<
    `;

    console.log("%c" + BANNER, "color: #00ffcc; font-weight: bold;");

    let isGhostShieldEnabled = true;
    let isTimeFreezeEnabled = false;
    let isHudEnabled = true;

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

    // --- NUCLEAR STEALTH & EVENTS ---
    const blockedEvents = ['blur', 'visibilitychange', 'mouseleave', 'focusout', 'pagehide', 'beforeunload'];
    const originalAddEventListener = window.addEventListener;
    const documentAddEventListener = document.addEventListener;

    const wrapAddEventListener = (original: any, name: string) => {
        return _c(function (this: any, type: string, listener: any, options: any) {
            if (isGhostShieldEnabled && blockedEvents.includes(type)) {
                console.log(`%c[GHOST] Muted spy-event: ${type}`, "color: #00ffcc; opacity: 0.5;");
                return;
            }
            return original.apply(this, arguments);
        }, name);
    };

    window.addEventListener = wrapAddEventListener(originalAddEventListener, 'addEventListener');
    document.addEventListener = wrapAddEventListener(documentAddEventListener, 'addEventListener');

    patch(navigator, 'webdriver', false, true);
    patch(document, 'hasFocus', () => true);
    patch(document, 'visibilityState', () => isGhostShieldEnabled ? 'visible' : (document as any)._visibilityState, true);
    patch(document, 'hidden', () => isGhostShieldEnabled ? false : (document as any)._hidden, true);

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
        if (bg) bg.onclick = () => searchQuestion('google');
        if (ba) ba.onclick = () => searchQuestion('perplexity');
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

    window.addEventListener("ultra_sync", (e: any) => {
        const cfg = e.detail;
        isGhostShieldEnabled = cfg.antiAntiTampering;
        isTimeFreezeEnabled = cfg.timeFreeze;
        isHudEnabled = cfg.showHud;
        const h = document.getElementById(HUD_ID);
        if (h) h.style.display = isHudEnabled ? 'flex' : 'none';
        updateHUD();
    });

    const HUGE_TIME = 9999999;
    setInterval(() => {
        if (isHudEnabled && !document.getElementById(HUD_ID) && (document.body || document.documentElement)) createHUD();

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
