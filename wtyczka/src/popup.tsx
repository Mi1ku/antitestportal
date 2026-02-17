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
        const key = inputKey.trim();
        if (validKeys.includes(key)) {
            pluginConfig.setShieldKey(key);
            setIsActivated(true);
            showMessage("DOSTĘP ULTRA AKTYWOWANY 💎", "success");
        } else {
            showMessage("BŁĄD: NIEPOPRAWNY KLUCZ LICENCYJNY", "error");
        }
    };

    const handleClearTrace = async () => {
        try {
            await chrome.browsingData.remove({
                "origins": [
                    "https://www.testportal.pl",
                    "https://www.testportal.net",
                    "https://www.testportal.online",
                    "https://testportal.pl",
                    "https://testportal.net"
                ]
            }, {
                "cache": true,
                "cookies": true,
                "localStorage": true
            });

            showMessage("ŚLADY WYCZYSZCZONE 🛡️", "success");

            const tabs = await chrome.tabs.query({});
            for (const tab of tabs) {
                if (tab.url && (tab.url.includes("testportal.pl") || tab.url.includes("testportal.net") || tab.url.includes("testportal.online"))) {
                    if (tab.id) await chrome.tabs.reload(tab.id);
                }
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

    const toggleFreeze = () => {
        const newState = !pluginConfig.timeFreeze;
        pluginConfig.setTimeFreeze(newState);
        showMessage(newState ? "CZAS ZAMROŻONY ❄️" : "ZAMRAŻANIE WYŁĄCZONE 🔥", "success");
    };

    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                <div className="status-badge pulse">SUPREME v11.8.5</div>
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
                        <p>KUP KLUCZ / KONTAKT:</p>
                        <a href="https://instagram.com/76mikus" target="_blank" className="ig-link">IG: @76mikus</a>
                    </div>
                </div>
            ) : (
                <>
                    {/* MODUŁ CZASU - Poprawiony z dwoma przyciskami */}
                    <div className="module-box" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: '#60a5fa' }}>SYSTEM KONTROLI CZASU</span>
                            <div className={`status-pill ${pluginConfig.timeFreeze ? 'active' : ''}`}>
                                {pluginConfig.timeFreeze ? 'ZAMROŻONY' : 'AKTYWNY'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button
                                className={`btn ${pluginConfig.timeFreeze ? 'btn-outline' : 'btn-primary'}`}
                                style={{ flex: 1, fontSize: '10px', height: '36px' }}
                                onClick={toggleFreeze}
                            >
                                {pluginConfig.timeFreeze ? 'ODMROŹ CZAS' : 'ZAMRÓŹ CZAS'}
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, fontSize: '10px', height: '36px', background: 'linear-gradient(45deg, #8b5cf6, #d946ef)' }}
                                onClick={handleResetTimer}
                            >
                                RESETUJ TIMER
                            </button>
                        </div>
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
                        <p className="module-desc">Anti-Tamper & Uczciwy Respondenta.</p>
                    </div>

                    <div className="module-box" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>POKAŻ STATUS NA STRONIE</span>
                            <label className="switch" style={{ transform: 'scale(0.8)' }}>
                                <input
                                    type="checkbox"
                                    checked={pluginConfig.showHud}
                                    onChange={(e) => pluginConfig.setShowHud(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '15px' }}>
                        <button className="btn btn-primary" style={{ background: '#ef4444', marginBottom: '10px' }} onClick={handleClearTrace}>
                            WYCZYŚĆ ŚLADY & RELOAD
                        </button>
                        <div className="support-links" style={{ textAlign: 'center' }}>
                            <a href="https://instagram.com/76mikus" target="_blank" style={{ fontSize: '10px' }}>Support: @76mikus</a>
                        </div>
                    </div>
                </>
            )}

            <div className="footer-info">mi1ku Systems © 2026</div>
        </div>
    );
}

export default IndexPopup;
