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
                setUpdateStatus("NAJNOWSZA ✅");
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
                    <div className="status-badge pulse">ENCRYPTED CORE ACTIVE</div>
                </div>

                {uiMessage.text && <div className={`ui-alert ${uiMessage.type}`}>{uiMessage.text}</div>}

                <div className="glass-card">
                    <div className="hwid-display-box" onClick={() => copyToClipboard(hwid)}>
                        <span className="hwid-label">TWÓJ UNIKALNY HARDWARE ID</span>
                        <span className="hwid-value">{hwid}</span>
                        <div style={{ fontSize: '7px', opacity: 0.4, marginTop: '4px' }}>KLIKNIJ ABY SKOPIOWAĆ</div>
                    </div>

                    <div className="input-group">
                        <label>KLUCZ LICENCYJNY</label>
                        <input
                            type="text" value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="WPISZ KLUCZ..."
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label>KOD POLECENIA (OPCJONALNIE +25 💎)</label>
                        <input
                            type="text" value={referralInput}
                            onChange={(e) => setReferralInput(e.target.value)}
                            placeholder="NP. MIKUS76"
                            style={{ borderStyle: 'dashed' }}
                        />
                    </div>

                    <button className="btn btn-primary" onClick={handleActivate}>AKTYWUJ LICENCJĘ</button>
                </div>

                <div className="module-box" style={{ background: 'transparent', marginTop: '10px', borderStyle: 'dashed' }}>
                    <div className="module-header" onClick={() => setShowGuide(!showGuide)} style={{ cursor: 'pointer' }}>
                        <span className="module-title" style={{ fontSize: '9px' }}>📦 INSTRUKCJA PIERWSZEJ AKTYWACJI</span>
                        <span style={{ fontSize: '10px' }}>{showGuide ? '▲' : '▼'}</span>
                    </div>
                    {showGuide && (
                        <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                            <p>1. Kliknij w pole <b>Hardware ID</b> powyżej, aby skopiować.</p>
                            <p>2. Wyślij ID do <b>@76mikus</b> w celu wygenerowania klucza.</p>
                            <p>3. Wklej otrzymany klucz i kliknij aktywuj.</p>
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
                    <div className="status-badge" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>{currentUser?.role.toUpperCase()}</div>
                    <div className="status-badge" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>{currentUser?.points} 💎</div>
                </div>
            </div>

            {uiMessage.text && <div className={`ui-alert ${uiMessage.type}`}>{uiMessage.text}</div>}

            <div className="tab-container">
                <button className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>SILNIK</button>
                <button className={`tab-btn ${activeTab === 'casino' ? 'active' : ''}`} onClick={() => setActiveTab('casino')}>🎰 KASYNO</button>
                {currentUser?.role === 'admin' && (
                    <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>⚙️ ADMIN</button>
                )}
            </div>

            {activeTab === 'home' && (
                <div className="active-section">
                    <div className="module-box" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div className="module-header">
                            <span className="module-title" style={{ color: 'var(--accent-blue)' }}>SYSTEM FREEZE 2.0</span>
                            <div className={`status-pill ${pluginConfig.timeFreeze ? 'active' : ''}`}
                                style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: 'bold', background: pluginConfig.timeFreeze ? '#3b82f6' : '#10b981' }}>
                                {pluginConfig.timeFreeze ? 'FROZEN' : 'ACTIVE'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button className="btn btn-outline" style={{ flex: 1, padding: '8px' }} onClick={() => pluginConfig.setTimeFreeze(!pluginConfig.timeFreeze)}>
                                {pluginConfig.timeFreeze ? '🔥 ODMROŹ' : '❄️ ZAMRÓŹ'}
                            </button>
                            <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }} onClick={handleResetTimer}>⏱️ RESET</button>
                        </div>
                    </div>

                    <div className="module-box">
                        <div className="module-header">
                            <span className="module-title" style={{ color: 'var(--accent-cyan)' }}>GHOST SHIELD EX</span>
                            <label className="switch">
                                <input type="checkbox" checked={pluginConfig.antiAntiTampering} onChange={(e) => pluginConfig.setAntiAntiTampering(e.target.checked)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="module-box" style={{ background: 'transparent', borderStyle: 'dotted' }}>
                        <div className="module-header" onClick={() => setShowGuide(!showGuide)} style={{ cursor: 'pointer' }}>
                            <span className="module-title" style={{ fontSize: '9px' }}>⌨️ SKRÓTY KLAWISZOWE</span>
                            <span style={{ fontSize: '10px' }}>{showGuide ? '▲' : '▼'}</span>
                        </div>
                        {showGuide && (
                            <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                                <p>🚀 <b>Ctrl + Z:</b> Szukaj zadania w Google.</p>
                                <p>🖼️ <b>Alt + Z:</b> Snapshot zadania do schowka + AI.</p>
                                <p>❄️ <b>Ctrl + Alt + F:</b> Przełącz mrożenie czasu.</p>
                            </div>
                        )}
                    </div>

                    <div className="module-box" style={{ background: 'transparent', padding: '8px' }}>
                        <div className="module-header" onClick={handleCheckUpdate} style={{ cursor: 'pointer' }}>
                            <span className="module-title" style={{ fontSize: '8px', opacity: 0.6 }}>SYSTEM UPDATE</span>
                            <span style={{ fontSize: '8px', opacity: 0.6 }}>{updateStatus}</span>
                        </div>
                    </div>

                    <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', marginTop: '5px', padding: '8px' }} onClick={handleLogout}>WYLOGUJ I WYCZYŚĆ SESJĘ</button>
                </div>
            )}

            {activeTab === 'casino' && (
                <div className="active-section">
                    <div className="casino-card glass-premium">
                        <div className="diamond-header">
                            <span className="diamond-icon">💎</span>
                            <span className="pts-count">{currentUser?.points}</span>
                            <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>DIAMENTY SUPREME</p>
                        </div>

                        <div className="slot-machine">
                            <div className={`slot-window ${isGambling ? 'slot-spinning' : ''}`}>
                                {isGambling ? "🎰" : (lastMultiplier === 0 ? "💀" : (lastMultiplier ? `x${lastMultiplier}` : "💎"))}
                            </div>
                        </div>

                        <button
                            className={`btn btn-primary gamble-btn ${isGambling ? 'disabled' : ''}`}
                            onClick={handleGamble}
                            disabled={isGambling}
                        >
                            {isGambling ? "LOSOWANIE..." : "🎰 GRAJ (10 💎)"}
                        </button>

                        <div className="reflink-box-premium" onClick={() => copyToClipboard(currentUser?.reflink)}>
                            <span style={{ fontSize: '8px', color: 'var(--primary-bright)', fontWeight: 'bold' }}>TWÓJ KOD POLECENIA</span>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: '#fff', letterSpacing: '4px', margin: '4px 0' }}>{currentUser?.reflink}</div>
                            <span className="copy-hint" style={{ fontSize: '7px', opacity: 0.4 }}>KLIKNIJ ABY SKOPIOWAĆ</span>
                        </div>
                        <p style={{ fontSize: '8px', color: 'var(--text-dim)', marginTop: '10px' }}>
                            Poleć znajomego i zgarnij <b>+50 💎</b> za każdą aktywację!
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'admin' && (
                <div className="active-section">
                    <div className="glass-card" style={{ padding: '15px' }}>
                        <span className="module-title" style={{ color: 'var(--primary-bright)', marginBottom: '10px', display: 'block' }}>GENERATOR LICENCJI</span>
                        <input type="text" placeholder="KLUCZ..." value={newKeyVal} onChange={(e) => setNewKeyVal(e.target.value)} style={{ marginBottom: '10px' }} />
                        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                            <select value={newKeyRole} onChange={(e) => setNewKeyRole(e.target.value as any)}
                                style={{ background: 'var(--bg-dark)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', flex: 1, padding: '8px', fontSize: '10px' }}>
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                            </select>
                            <select value={newKeyDays} onChange={(e) => setNewKeyDays(e.target.value)}
                                style={{ background: 'var(--bg-dark)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', flex: 1, padding: '8px', fontSize: '10px' }}>
                                <option value="1">1 DZIEŃ</option>
                                <option value="30">30 DNI</option>
                                <option value="never">FOREVER</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={handleCreateKey}>DODAJ KLUCZ</button>
                    </div>

                    <div className="data-list" style={{ marginTop: '15px', maxHeight: '120px' }}>
                        {db?.keys.map(k => (
                            <div key={k.id} className="data-item">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span className="key-tag" onClick={() => copyToClipboard(k.key)}>{k.key}</span>
                                    {k.boundHwid && <span style={{ fontSize: '7px', color: 'var(--accent-blue)' }}>🔒 {k.boundHwid.substring(0, 12)}...</span>}
                                </div>
                                <span style={{ fontSize: '9px', fontWeight: 'bold' }}>{k.points}💎</span>
                                <button onClick={() => deleteKey(k.id)} style={{ padding: '4px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>❌</button>
                            </div>
                        ))}
                    </div>

                    <div className="module-box" style={{ background: 'transparent', borderStyle: 'dashed', marginTop: '10px' }}>
                        <div className="module-header" onClick={() => setShowAdminGuide(!showAdminGuide)} style={{ cursor: 'pointer' }}>
                            <span className="module-title" style={{ fontSize: '9px' }}>👑 ADMIN TOOLS GUIDE</span>
                            <span style={{ fontSize: '10px' }}>{showAdminGuide ? '▲' : '▼'}</span>
                        </div>
                        {showAdminGuide && (
                            <div style={{ marginTop: '10px', fontSize: '9px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                                <p>• <b>Icons:</b> 🔒 oznacza klucz przypisany do sprzętu.</p>
                                <p>• <b>Admin:</b> Klucze admina nie mają blokady HWID.</p>
                                <p>• <b>Dev:</b> Użyj konsoli dla `window.__SUPREME_DEV__`.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="footer-info">mi1ku Supreme Engine v1.2.0</div>
        </div>
    );
}

export default IndexPopup;
