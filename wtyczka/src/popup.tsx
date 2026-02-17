import "style.css";
import { useState, useEffect } from "react";
import usePluginConfig, { AutoSolveButtonVisibility } from "~hooks/use-plugin-config";

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
            // Storage is synced automatically via hook
            alert("DOSTĘP ULTRA AKTYWOWANY 💎");
        } else {
            alert("BŁĄD: NIEPRAWIDŁOWY KLUCZ");
        }
    };

    const handleClearTrace = async () => {
        if (confirm("CZY NA PEWNO WYCZYŚCIĆ WSZYSTKIE ŚLADY? ZOSTANIESZ WYLOGOWANY.")) {
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
            alert("ŚLADY WYCZYSZCZONE. MOŻESZ BEZPIECZNIE WEJŚĆ NA TEST.");
        }
    };

    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                <div className="status-badge">OCHRONA v10.0 GHOST COMMANDER</div>
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
                    <button className="btn btn-primary" onClick={handleActivate}>AKTYWUJ DOSTĘP</button>
                    <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '10px' }}>Wersja Plasma / GPT-Main Tech</p>
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
                            Zamraża licznik czasu na każdym pytaniu, dając Ci nieograniczony czas na szukanie.
                        </p>
                    </div>

                    <div className="module-box">
                        <div className="module-header">
                            <span className="module-title">ANTI-ANTI-TAMPERING</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={pluginConfig.antiAntiTampering}
                                    onChange={(e) => pluginConfig.setAntiAntiTampering(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <p className="module-desc">
                            Główna ochrona Ghost Commander. Ukrywa fakt posiadania wtyczek przed Testportalem.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '15px' }}>
                        <div className="input-group">
                            <label>API KEY OpenAI (Opcjonalnie)</label>
                            <input
                                type="text"
                                value={pluginConfig.apiKey}
                                onChange={(e) => pluginConfig.setApiKey(e.target.value)}
                                placeholder="sk-..."
                            />
                        </div>
                        <button className="btn btn-outline" style={{ color: '#ef4444' }} onClick={handleClearTrace}>
                            WYCZYŚĆ ŚLADY (ANTI-DETECT)
                        </button>
                    </div>

                    <div className="module-box" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span className="module-title" style={{ color: 'white', display: 'block', marginBottom: '8px' }}>INSTRUKCJA SKRÓTÓW:</span>
                        <p className="module-desc" style={{ color: '#94a3b8' }}>
                            • <b>CTRL + Klik</b>: Szukaj w Google<br />
                            • <b>ALT + Klik</b>: Rozwiązanie przez AI
                        </p>
                    </div>
                </>
            )}

            <div className="footer-info">Powered by Plasma Technology v10.0</div>
        </div>
    );
}

export default IndexPopup;
