import "./style.css";
import { useState, useEffect } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import validKeys from "./valid_keys.json";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const [isActivated, setIsActivated] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [uiMessage, setUiMessage] = useState({ text: "", type: "" });
    const [showGuide, setShowGuide] = useState(false);

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
            showMessage("WITAJ W ELICIE ULTRA 1.0 💎", "success");
        } else {
            showMessage("BŁĘDNY KLUCZ LICENCYJNY", "error");
        }
    };

    const handleClearTrace = async () => {
        try {
            await chrome.browsingData.remove({
                "origins": ["https://www.testportal.pl", "https://www.testportal.net", "https://www.testportal.online"]
            }, { "cache": true, "cookies": true, "localStorage": true });
            showMessage("SYSTEM WYCZYSZCZONY 🛡️", "success");
            const tabs = await chrome.tabs.query({});
            for (const tab of tabs) {
                if (tab.url?.includes("testportal")) {
                    if (tab.id) await chrome.tabs.reload(tab.id);
                }
            }
        } catch (e) {
            showMessage("BŁĄD CZYSZCZENIA", "error");
        }
    };

    const handleResetTimer = () => {
        pluginConfig.triggerReset();
        showMessage("ZRESETOWANO ⏱️", "success");
    };

    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                <div className="status-badge pulse">PREMIUM 1.0</div>
            </div>

            {uiMessage.text && <div className={`ui-alert ${uiMessage.type}`}>{uiMessage.text}</div>}

            {!isActivated ? (
                <div className="glass-card">
                    <div className="input-group">
                        <label>Klucz Licencyjny</label>
                        <input
                            type="text" value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="WPISZ KLUCZ..."
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleActivate}>AKTYWUJ DOSTĘP</button>
                    <div className="support-links">
                        <p>Klucze: <b>mikus</b>, <b>zsa</b></p>
                        <p>Instagram: <a href="https://instagram.com/76mikus" target="_blank">@76mikus</a></p>
                    </div>
                </div>
            ) : (
                <>
                    {/* MODUŁ CZASU */}
                    <div className="module-box" style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(96, 165, 250, 0.2)'
                    }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: '#60a5fa' }}>KONTROLA CZASU EZ ULTRA</span>
                            <div
                                className={`status-pill ${pluginConfig.timeFreeze ? 'active' : ''}`}
                                style={{
                                    background: pluginConfig.timeFreeze
                                        ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                                        : 'linear-gradient(135deg, #10b981, #34d399)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '4px 10px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {pluginConfig.timeFreeze ? (
                                    <><span>❄️</span> ZAMROŻONY</>
                                ) : (
                                    <><span>🔥</span> ODMROŻONY</>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button
                                className={`btn ${pluginConfig.timeFreeze ? 'btn-outline' : 'btn-primary'}`}
                                style={{ flex: 1, fontSize: '9px', borderColor: '#3b82f6' }}
                                onClick={() => pluginConfig.setTimeFreeze(!pluginConfig.timeFreeze)}
                            >
                                {pluginConfig.timeFreeze ? '🔥 ODMROŹ' : '❄️ ZAMRÓŹ'}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, fontSize: '9px', background: 'linear-gradient(45deg, #8b5cf6, #d946ef)' }} onClick={handleResetTimer}>
                                ⏱️ RESET TIMER
                            </button>
                        </div>
                    </div>

                    {/* GHOST SHIELD */}
                    <div className="module-box" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: '#34d399' }}>GHOST SHIELD</span>
                            <label className="switch">
                                <input type="checkbox" checked={pluginConfig.antiAntiTampering} onChange={(e) => pluginConfig.setAntiAntiTampering(e.target.checked)} />
                                <span className="slider" style={{ backgroundColor: pluginConfig.antiAntiTampering ? '#10b981' : '#334155' }}></span>
                            </label>
                        </div>
                    </div>

                    {/* PORADNIK & POMOC */}
                    <div className="module-box" style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)' }}>
                        <div className="module-header" style={{ cursor: 'pointer' }} onClick={() => setShowGuide(!showGuide)}>
                            <span className="module-title" style={{ fontSize: '10px' }}>📘 PORADNIK & SKRÓTY (v1.0.2)</span>
                            <span style={{ fontSize: '10px' }}>{showGuide ? '▲' : '▼'}</span>
                        </div>
                        {showGuide && (
                            <div style={{ marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4' }}>
                                <p>💎 <b>SZUKAJ:</b> Na HUDzie masz dwa przyciski (✨ AI i 🌐 GOOGLE) dla całego zadania.</p>
                                <p>⌨️ <b>SKRÓTY:</b> Ctrl+Shift+X (AI) oraz Ctrl+Shift+Z (Google).</p>
                                <p>❄️ <b>Mrożenie:</b> "Freeze" zatrzymuje zegar (Ikona ❄️). Odmrażanie to (Ikona 🔥).</p>
                                <p>🚀 <b>Reset:</b> "Reset Timer" cofa zegar do pełnej wartości paska.</p>
                                <hr style={{ opacity: 0.1, margin: '6px 0' }} />
                                <p>🖱️ <b>Ctrl + Klik:</b> Szukaj zaznaczonego tekstu w Google.</p>
                                <p>🖱️ <b>Alt + Klik:</b> Szukaj zaznaczonego tekstu w AI.</p>
                            </div>
                        )}
                    </div>

                    <div className="module-box" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>POKAŻ STATUS NA STRONIE</span>
                            <label className="switch" style={{ transform: 'scale(0.8)' }}>
                                <input type="checkbox" checked={pluginConfig.showHud} onChange={(e) => pluginConfig.setShowHud(e.target.checked)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '15px' }}>
                        <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={handleClearTrace}>NUCLEAR CLEAN & RELOAD</button>
                    </div>
                </>
            )}
            <div className="footer-info">mi1ku Systems 1.0 | @76mikus</div>
        </div>
    );
}

export default IndexPopup;
