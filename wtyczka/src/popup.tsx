import "./style.css";
import { useState, useEffect } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import validKeys from "./valid_keys.json";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const [isActivated, setIsActivated] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [uiMessage, setUiMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (pluginConfig.shieldKey && validKeys.includes(pluginConfig.shieldKey)) {
            setIsActivated(true);
        }
    }, [pluginConfig.shieldKey]);

    const showMessage = (text: string, type: "success" | "error") => {
        setUiMessage({ text, type });
        setTimeout(() => setUiMessage({ text: "", type: "" }), 3000);
    };

    const handleActivate = () => {
        if (validKeys.includes(inputKey.trim())) {
            pluginConfig.setShieldKey(inputKey.trim());
            setIsActivated(true);
            showMessage("DOSTĘP ULTRA AKTYWOWANY 💎", "success");
        } else {
            showMessage("BŁĄD: NIEPRAWIDŁOWY KLUCZ LICENCYJNY", "error");
        }
    };

    const handleClearTrace = async () => {
        try {
            await chrome.browsingData.remove({
                "origins": [
                    "https://www.testportal.pl",
                    "https://www.testportal.net",
                    "https://www.testportal.online"
                ]
            }, {
                "cache": true,
                "cookies": true,
                "localStorage": true
            });

            showMessage("ŚLADY WYCZYSZCZONE 🛡️", "success");

            // Force reload ANY tab that matches Testportal domains
            const tabs = await chrome.tabs.query({
                url: [
                    "https://*.testportal.pl/*",
                    "https://*.testportal.net/*",
                    "https://*.testportal.online/*"
                ]
            });

            for (const tab of tabs) {
                if (tab.id) chrome.tabs.reload(tab.id);
            }

            // Fallback: reload active tab if not caught by query
            if (tabs.length === 0) {
                const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (activeTab?.id) chrome.tabs.reload(activeTab.id);
            }

        } catch (e) {
            showMessage("BŁĄD PODCZAS CZYSZCZENIA", "error");
        }
    };

    const handleResetTimer = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { type: "RESET_TIMER" });
            showMessage("TIMER ZRESETOWANY ⏱️", "success");
        }
    };

    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                <div className="status-badge pulse">MI1KU SUPREME v11.3</div>
            </div>

            {uiMessage.text && (
                <div className={`ui-alert ${uiMessage.type}`}>
                    {uiMessage.text}
                </div>
            )}

            {!isActivated ? (
                <div className="glass-card">
                    <div className="input-group">
                        <label>Klucz Licencyjny</label>
                        <input
                            type="text"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="WPISZ SWÓJ KLUCZ..."
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleActivate}>ODBLOKUJ POTĘGĘ</button>
                    <div className="support-links">
                        <p>KUP KLUCZ / WSPARCIE:</p>
                        <a href="https://instagram.com/76mikus" target="_blank" className="ig-link">INSTAGRAM: @76mikus</a>
                    </div>
                </div>
            ) : (
                <>
                    <div className="module-box">
                        <div className="module-header">
                            <span className="module-title">MODUŁ CZASU (TIME WARP)</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={pluginConfig.timeFreeze}
                                    onChange={(e) => pluginConfig.setTimeFreeze(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <p className="module-desc">
                            Zatrzymuje zegar. Resetuj czas przed startem lub w razie potrzeby.
                        </p>
                        <button className="btn btn-outline" style={{ marginTop: '10px', fontSize: '10px', padding: '6px' }} onClick={handleResetTimer}>
                            RESETUJ TIMER PYTANIA
                        </button>
                    </div>

                    <div className="module-box" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: '#34d399' }}>GHOST SHIELD (SUPREME)</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={pluginConfig.antiAntiTampering}
                                    onChange={(e) => pluginConfig.setAntiAntiTampering(e.target.checked)}
                                />
                                <span className="slider" style={{ backgroundColor: pluginConfig.antiAntiTampering ? '#10b981' : '#334155' }}></span>
                            </label>
                        </div>
                        <p className="module-desc">
                            Absolute Stealth Mode & Honest Respondent. Testportal widzi Cię jako uczciwego gracza.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '15px' }}>
                        <button className="btn btn-primary" style={{ background: '#ef4444', marginBottom: '10px' }} onClick={handleClearTrace}>
                            WYCZYŚĆ ŚLADY & RELOAD
                        </button>
                        <div className="support-links" style={{ textAlign: 'center' }}>
                            <a href="https://instagram.com/76mikus" target="_blank" style={{ fontSize: '10px' }}>SUPPORT: @76mikus</a>
                        </div>
                    </div>

                    <div className="module-box" style={{ background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                        <span className="module-title" style={{ color: 'white', display: 'block', marginBottom: '8px', fontSize: '10px' }}>SKRÓTY MI1KU:</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div className="shortcut-item"><span>CTRL + Klik</span> <small>Google Search</small></div>
                            <div className="shortcut-item"><span>ALT + Klik</span> <small>AI Solution (Perplexity)</small></div>
                        </div>
                    </div>
                </>
            )}

            <div className="footer-info">mi1ku Systems © 2026</div>
        </div>
    );
}

export default IndexPopup;
