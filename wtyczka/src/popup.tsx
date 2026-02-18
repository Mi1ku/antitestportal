import "./style.css";
import { useState, useEffect } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import useDatabase from "~hooks/use-database";

type ActiveTab = "home" | "admin" | "casino";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const { db, hwid, addKey, deleteKey, validateKey, addPoints, isLoading, checkForUpdates } = useDatabase();

    const [isActivated, setIsActivated] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [inputKey, setInputKey] = useState("");
    const [referralInput, setReferralInput] = useState("");
    const [uiMessage, setUiMessage] = useState({ text: "", type: "" });
    const [showGuide, setShowGuide] = useState(false);
    const [showAdminGuide, setShowAdminGuide] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>("home");
    const [updateStatus, setUpdateStatus] = useState<string>("v1.2.0 (Supreme)");

    // Casino state
    const [isGambling, setIsGambling] = useState(false);
    const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);

    // Admin State
    const [newKeyVal, setNewKeyVal] = useState("");
    const [newKeyRole, setNewKeyRole] = useState<'user' | 'admin'>("user");
    const [newKeyDays, setNewKeyDays] = useState<string>("30");

    useEffect(() => {
        const checkExisting = async () => {
            if (pluginConfig.shieldKey && !isLoading && db) {
                const result = await validateKey(pluginConfig.shieldKey);
                if (result.success) {
                    setIsActivated(true);
                    setCurrentUser(result.user);
                } else {
                    pluginConfig.setShieldKey("");
                }
            }
        };
        checkExisting();
    }, [pluginConfig.shieldKey, isLoading, db]);

    const showMessage = (text: string, type: "success" | "error") => {
        setUiMessage({ text, type });
        setTimeout(() => setUiMessage({ text: "", type: "" }), 3000);
    };

    const handleActivate = async () => {
        const key = inputKey.trim();
        const ref = referralInput.trim();
        const result = await validateKey(key, ref);

        if (result.success) {
            pluginConfig.setShieldKey(key);
            setIsActivated(true);
            setCurrentUser(result.user);
            showMessage(`WITAJ ${result.user.role.toUpperCase()} 💎`, "success");
        } else {
            showMessage(result.error || "BŁĄD AUTORYZACJI", "error");
        }
    };

    const handleGamble = () => {
        if (!currentUser || currentUser.points < 10 || isGambling) return;

        setIsGambling(true);
        addPoints(currentUser.id, -10);

        setTimeout(() => {
            const chance = Math.random();
            let win = 0;
            let mult = 0;

            if (chance > 0.95) { mult = 10; win = 100; }
            else if (chance > 0.8) { mult = 3; win = 30; }
            else if (chance > 0.5) { mult = 1.5; win = 15; }
            else { mult = 0; win = 0; }

            if (win > 0) {
                addPoints(currentUser.id, win);
                showMessage(`WIN! x${mult} (+${win} 💎)`, "success");
            } else {
                showMessage("LOSE! SPRÓBUJ PONOWNIE 💀", "error");
            }

            setLastMultiplier(mult);
            setIsGambling(false);
        }, 800);
    };

    const handleCheckUpdate = async () => {
        setUpdateStatus("SPRAWDZANIE...");
        const res = await checkForUpdates();
        setTimeout(() => {
            if (res.hasUpdate) {
                setUpdateStatus(`NOWA WERSJA: ${res.version}`);
                if (confirm(`Dostępna jest nowa wersja ${res.version}. Czy chcesz przejść do pobierania?`)) {
                    window.open(res.url, "_blank");
                }
            } else {
                setUpdateStatus("MASZ NAJNOWSZĄ WERSJĘ ✅");
                setTimeout(() => setUpdateStatus("v1.2.0 (Supreme)"), 3000);
            }
        }, 1000);
    };

    const handleLogout = () => {
        pluginConfig.setShieldKey("");
        setIsActivated(false);
        setCurrentUser(null);
        setActiveTab("home");
    };

    const handleResetTimer = () => {
        pluginConfig.triggerReset();
        showMessage("⏱️ ZEGAR ZRESETOWANY!", "success");
    };

    const handleCreateKey = () => {
        if (!newKeyVal) return;
        const days = newKeyDays === "never" ? "never" : parseInt(newKeyDays);
        addKey(newKeyVal, newKeyRole, days as any, "Generated");
        setNewKeyVal("");
        showMessage("KLUCZ UTWORZONY!", "success");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showMessage("SKOPIOWANO!", "success");
    };

    if (isLoading) return <div className="popup-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="pulse" style={{ color: 'white' }}>INIT CORE...</div></div>;

    if (!isActivated) {
        return (
            <div className="popup-container">
                <div className="header">
                    <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                    <div className="status-badge pulse">ENCRYPTED CORE</div>
                </div>
                {uiMessage.text && <div className={`ui-alert ${uiMessage.type}`}>{uiMessage.text}</div>}
                <div className="glass-card">
                    <div className="input-group">
                        <label>Hardware ID (Twój Sprzęt)</label>
                        <div style={{ fontSize: '9px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px', color: '#60a5fa', fontFamily: 'monospace', marginBottom: '10px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                            {hwid}
                        </div>
                        <label>Klucz Licencyjny</label>
                        <input
                            type="text" value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="WPISZ KLUCZ..."
                        />
                        <label>Kod Polecenia (Opcjonalnie +25 💎)</label>
                        <input
                            type="text" value={referralInput}
                            onChange={(e) => setReferralInput(e.target.value)}
                            placeholder="REFLINK..."
                            style={{ border: '1px dashed rgba(255,255,255,0.2)', fontSize: '10px' }}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleActivate}>AKTYWUJ SUPREME</button>
                </div>

                <div className="module-box" style={{ background: 'rgba(255,255,255,0.02)', marginTop: '5px' }}>
                    <div className="module-header" onClick={() => setShowGuide(!showGuide)} style={{ cursor: 'pointer' }}>
                        <span className="module-title" style={{ fontSize: '10px' }}>📦 INSTRUKCJA INSTALACJI</span>
                        <span style={{ fontSize: '10px' }}>{showGuide ? '▲' : '▼'}</span>
                    </div>
                    {showGuide && (
                        <div style={{ marginTop: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                            <p>1. Skopiuj swój <b>HWID</b> powyżej.</p>
                            <p>2. Wyślij go do <b>@76mikus</b> na Instagramie.</p>
                            <p>3. Po otrzymaniu klucza, wklej go i aktywuj.</p>
                        </div>
                    )}
                </div>

                <div className="footer-info">mi1ku Premium Systems | @76mikus</div>
            </div>
        );
    }

    return (
        <div className="popup-container">
            <div className="header" style={{ marginBottom: '15px' }}>
                <h1 className="logo">Supreme <span>CORE</span></h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <div className="status-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>{currentUser?.role.toUpperCase()}</div>
                    <div className="status-badge" style={{ borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>{currentUser?.points} 💎</div>
                </div>
            </div>

            {uiMessage.text && <div className={`ui-alert ${uiMessage.type}`}>{uiMessage.text}</div>}

            <div className="tab-container">
                <button className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>🏠 SILNIK</button>
                <button className={`tab-btn ${activeTab === 'casino' ? 'active' : ''}`} onClick={() => setActiveTab('casino')}>🎰 KASYNO</button>
                {currentUser?.role === 'admin' && (
                    <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>⚙️ ADMIN</button>
                )}
            </div>

            {activeTab === 'home' && (
                <div className="active-section">
                    <div className="module-box" style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: '#60a5fa' }}>SYSTEM FREEZE 2.0</span>
                            <div className={`status-pill ${pluginConfig.timeFreeze ? 'active' : ''}`} style={{ background: pluginConfig.timeFreeze ? '#3b82f6' : '#10b981' }}>
                                {pluginConfig.timeFreeze ? 'FROZEN ❄️' : 'WARM 🔥'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button className="btn btn-outline" style={{ flex: 1, fontSize: '9px' }} onClick={() => pluginConfig.setTimeFreeze(!pluginConfig.timeFreeze)}>
                                {pluginConfig.timeFreeze ? '🔥 ODMROŹ' : '❄️ ZAMRÓŹ'}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, fontSize: '9px' }} onClick={handleResetTimer}>⏱️ RESET</button>
                        </div>
                    </div>

                    <div className="module-box" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="module-header" onClick={() => setShowGuide(!showGuide)} style={{ cursor: 'pointer' }}>
                            <span className="module-title" style={{ fontSize: '10px' }}>⌨️ SKRÓTY KLAWISZOWE</span>
                            <span style={{ fontSize: '10px' }}>{showGuide ? '▲' : '▼'}</span>
                        </div>
                        {showGuide && (
                            <div style={{ marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                                <p>🚀 <b>Ctrl + Z:</b> Szukaj zadania w Google.</p>
                                <p>🖼️ <b>Alt + Z:</b> Snapshot zadania do schowka + AI.</p>
                                <p>❄️ <b>Ctrl + Alt + F:</b> Przełącz mrożenie czasu.</p>
                                <p>🖱️ <b>Ctrl + Klik:</b> Szukaj zaznaczenia w Google.</p>
                            </div>
                        )}
                    </div>

                    <div className="module-box" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="module-header" onClick={handleCheckUpdate} style={{ cursor: 'pointer' }}>
                            <span className="module-title" style={{ fontSize: '10px', color: '#a78bfa' }}>⬆️ SPRAWDŹ AKTUALIZACJE</span>
                            <span style={{ fontSize: '9px', opacity: 0.7 }}>{updateStatus}</span>
                        </div>
                    </div>

                    <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', marginTop: '10px', padding: '6px' }} onClick={handleLogout}>WYLOGUJ I WYCZYŚĆ SESJĘ</button>
                </div>
            )}

            {activeTab === 'casino' && (
                <div className="active-section casino-section animated-bg">
                    <div className="casino-card glass-premium">
                        <div className="diamond-header">
                            <span className="diamond-icon">💎</span>
                            <span className="pts-count">{currentUser?.points}</span>
                            <p style={{ fontSize: '8px', opacity: 0.6, margin: '2px 0' }}>SUPREME VAULT</p>
                        </div>

                        <div className="slot-machine">
                            <div className={`slot-window ${isGambling ? 'slot-spinning' : ''}`}>
                                {isGambling ? "🎰" : (lastMultiplier === 0 ? "💀" : (lastMultiplier ? `x${lastMultiplier}` : "💎"))}
                            </div>
                        </div>

                        <button
                            className={`btn btn-primary gamble-btn ${isGambling ? 'disabled' : ''}`}
                            style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', border: 'none', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)' }}
                            onClick={handleGamble}
                            disabled={isGambling}
                        >
                            {isGambling ? "LOSOWANIE..." : "🎰 GRAJ (10 💎)"}
                        </button>

                        <div className="reflink-section">
                            <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>💎 SYSTEM POLECEŃ (REFLINKI) 💎</p>
                            <div className="reflink-box-premium" onClick={() => copyToClipboard(currentUser?.reflink)}>
                                <span style={{ opacity: 0.6 }}>TWÓJ KOD:</span>
                                <strong>{currentUser?.reflink}</strong>
                                <span className="copy-hint">KLIKNIJ ABY SKOPIOWAĆ</span>
                            </div>
                            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>
                                Każdy kto użyje Twojego kodu przy aktywacji daje Ci +50 💎, a sam dostaje +25 💎 na start!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'admin' && (
                <div className="active-section admin-section">
                    <div className="module-box" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)' }}>
                        <span className="module-title" style={{ color: 'var(--primary-bright)' }}>GENERATOR LICENCJI</span>
                        <div style={{ marginTop: '10px' }}>
                            <input type="text" placeholder="KLUCZ..." value={newKeyVal} onChange={(e) => setNewKeyVal(e.target.value)} style={{ marginBottom: '8px' }} />
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                                <select value={newKeyRole} onChange={(e) => setNewKeyRole(e.target.value as any)} style={{ background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '4px', flex: 1, fontSize: '10px' }}>
                                    <option value="user">USER</option>
                                    <option value="admin">ADMIN</option>
                                </select>
                                <select value={newKeyDays} onChange={(e) => setNewKeyDays(e.target.value)} style={{ background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '4px', flex: 1, fontSize: '10px' }}>
                                    <option value="1">1 DZIEŃ</option>
                                    <option value="30">30 DNI</option>
                                    <option value="never">NA ZAWSZE</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={handleCreateKey}>DODAJ DO BAZY</button>
                        </div>
                    </div>

                    <div className="data-list" style={{ marginTop: '10px' }}>
                        {db?.keys.map(k => (
                            <div key={k.id} className="data-item">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span className="key-tag" onClick={() => copyToClipboard(k.key)}>{k.key}</span>
                                        <span style={{ fontSize: '8px', background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '3px' }}>REF: {k.reflink}</span>
                                    </div>
                                    {k.boundHwid && <span style={{ fontSize: '7px', color: '#60a5fa' }}>🔒 {k.boundHwid.substring(0, 10)}... | {k.points} 💎</span>}
                                </div>
                                <button onClick={() => deleteKey(k.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>❌</button>
                            </div>
                        ))}
                    </div>

                    <div className="module-box" style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px dashed var(--primary)', marginTop: '10px' }}>
                        <div className="module-header" onClick={() => setShowAdminGuide(!showAdminGuide)} style={{ cursor: 'pointer' }}>
                            <span className="module-title" style={{ fontSize: '10px' }}>👑 PORADNIK ADMINISTRATORA</span>
                            <span style={{ fontSize: '10px' }}>{showAdminGuide ? '▲' : '▼'}</span>
                        </div>
                        {showAdminGuide && (
                            <div style={{ marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                                <p>🔑 <b>Generowanie:</b> Wpisz klucz, wybierz rolę i czas. Kliknij "DODAJ".</p>
                                <p>🔒 <b>HWID:</b> Klucze `user` blokują się na pierwszym użytej maszynie (ikona kłódki 🔒).</p>
                                <p>💻 <b>DevTools:</b> Użyj `window.__SUPREME_DEV__` w konsoli popupu do zarządzania bazą "z palca".</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="footer-info">Supreme Engine | mi1ku Systems v1.2</div>
        </div>
    );
}

export default IndexPopup;
