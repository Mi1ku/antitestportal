import "style.css";
import { useState, useEffect } from "react";
import usePluginConfig from "~hooks/use-plugin-config";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const [isActivated, setIsActivated] = useState(false);

    useEffect(() => {
        if (pluginConfig.shieldKey && pluginConfig.shieldKey.length > 5) {
            setIsActivated(true);
        }
    }, [pluginConfig.shieldKey]);

    const handleActivate = () => {
        if (pluginConfig.shieldKey.trim().length > 5) {
            setIsActivated(true);
            alert("DOSTĘP ULTRA PREMIUM AKTYWOWANY 💎");
        } else {
            alert("BŁĄD: KLUCZ MUSI MIEĆ MIN. 6 ZNAKÓW");
        }
    };

    const handleClearTrace = async () => {
        if (confirm("CZY NA PEWNO WYCZYŚCIĆ ŚLADY? ZOSTANIESZ WYLOGOWANY.")) {
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
            alert("ŚLADY WYCZYSZCZONE 🛡️");
        }
    };

    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                <div className="status-badge pulse">GHOST COMMANDER v11.0 ACTIVE</div>
            </div>

            {!isActivated ? (
                <div className="glass-card">
                    <div className="input-group">
                        <label>Klucz Licencyjny</label>
                        <input
                            type="text"
                            value={pluginConfig.shieldKey}
                            onChange={(e) => pluginConfig.setShieldKey(e.target.value)}
                            placeholder="WPISZ SWÓJ KLUCZ..."
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleActivate}>ODBLOKUJ POTĘGĘ</button>
                    <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                        Wymagana licencja premium Midway.gg
                    </p>
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
                            Zatrzymuje zegar Testportalu. Masz nieograniczony czas na każde pytanie.
                        </p>
                    </div>

                    <div className="module-box" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: '#34d399' }}>EKSTREMALNY STEALTH</span>
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
                            Zaawansowane maskowanie native-code. Wtyczka jest niewidoczna dla skanerów.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '15px' }}>
                        <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={handleClearTrace}>
                            WYCZYŚĆ ŚLADY (ANTI-DETECT)
                        </button>
                    </div>

                    <div className="module-box" style={{ background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                        <span className="module-title" style={{ color: 'white', display: 'block', marginBottom: '8px', fontSize: '10px' }}>INTELIGENTNE SKRÓTY:</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div className="shortcut-item"><span>CTRL + Klik</span> <small>Google Search</small></div>
                            <div className="shortcut-item"><span>ALT + Klik</span> <small>AI Solution</small></div>
                        </div>
                    </div>
                </>
            )}

            <div className="footer-info">Midway Protection Systems © 2026</div>
        </div>
    );
}

export default IndexPopup;
