import "./style.css";
import { useState, useEffect, useRef } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import useDatabase, { type DbKey } from "~hooks/use-database";

type Tab = "home" | "games" | "terminal";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const { db, hwid, addKey, updateKey, deleteKey, validateKey, addPoints, isLoading, getRemainingTime, clearSession } = useDatabase();

    const [isActivated, setIsActivated] = useState(false);
    const [currentUser, setCurrentUser] = useState<DbKey | null>(null);
    const [inputKey, setInputKey] = useState("");
    const [referralInput, setReferralInput] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("home");
    const [showCopyFb, setShowCopyFb] = useState(false);
    const [winOverlay, setWinOverlay] = useState<{ show: boolean, amount: number }>({ show: false, amount: 0 });

    // Aviator Logic
    const [mult, setMult] = useState(1.00);
    const [isFlying, setIsFlying] = useState(false);
    const [cashedOut, setCashedOut] = useState(false);
    const [crashPoint, setCrashPoint] = useState(0);
    const [bet, setBet] = useState(10);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        const check = async () => {
            if (pluginConfig.shieldKey && !isLoading && db) {
                const res = await validateKey(pluginConfig.shieldKey);
                if (res.success) {
                    setIsActivated(true);
                    setCurrentUser(res.user || null);
                } else {
                    pluginConfig.setShieldKey("");
                }
            }
        };
        check();
    }, [pluginConfig.shieldKey, isLoading, db]);

    useEffect(() => {
        if (currentUser && db) {
            const found = db.keys.find(k => k.id === currentUser.id);
            if (found) setCurrentUser(found);
        }
    }, [db]);

    const handleActivate = async () => {
        const res = await validateKey(inputKey.trim(), referralInput.trim());
        if (res.success) {
            pluginConfig.setShieldKey(inputKey.trim());
            setIsActivated(true);
            setCurrentUser(res.user || null);
        } else {
            alert(res.error || "BŁĄD DOSTĘPU");
        }
    };

    const handleClear = async () => {
        await clearSession();
        window.location.reload();
    };

    const copyRef = () => {
        if (!currentUser?.reflink) return;
        navigator.clipboard.writeText(currentUser.reflink);
        setShowCopyFb(true);
        setTimeout(() => setShowCopyFb(false), 1500);
    };

    const startAviator = () => {
        if (!currentUser || currentUser.points < bet || isFlying) return;
        addPoints(currentUser.id, -bet);
        setIsFlying(true);
        setCashedOut(false);
        setMult(1.00);

        const r = Math.random();
        const cp = Math.max(1.01, Math.floor((100 / (1 - r)) / 100 * 100) / 100);
        setCrashPoint(cp);

        timerRef.current = setInterval(() => {
            setMult(prev => {
                const next = prev + (0.01 + prev * 0.008);
                if (next >= cp) {
                    clearInterval(timerRef.current);
                    setIsFlying(false);
                    return cp;
                }
                return next;
            });
        }, 80);
    };

    const cashOut = () => {
        if (!isFlying || cashedOut) return;
        setCashedOut(true);
        const win = Math.floor(bet * mult);
        addPoints(currentUser!.id, win);
        setWinOverlay({ show: true, amount: win });
        setTimeout(() => setWinOverlay({ show: false, amount: 0 }), 2000);
    };

    const getPlaneStyle = () => {
        if (!isFlying && mult === 1) return { bottom: '20%', left: '20%' };
        const progress = Math.min(1, (mult - 1) / 3.5);
        return {
            bottom: `${20 + progress * 55}%`,
            left: `${20 + progress * 60}%`,
            opacity: (!isFlying && mult === crashPoint) ? 0 : 1,
            transform: `scale(${1 + progress * 0.4}) rotate(${-5 - progress * 10}deg)`
        };
    };

    if (isLoading) return <div className="loader-wrap"><div className="loader"></div></div>;

    return (
        <div className="app-container">
            <div className="header">
                <div className="brand">ANTITESTPORTAL<span>+</span></div>
            </div>

            {winOverlay.show && (
                <div className="overlay-success">
                    <div className="icon">💎</div>
                    <div className="text">WYGRANA: {winOverlay.amount}</div>
                </div>
            )}

            {!isActivated ? (
                <div className="content">
                    <div className="card">
                        <div style={{ fontSize: 9, opacity: 0.5, fontWeight: 800, textAlign: 'center', marginBottom: 5 }}>MOJE ID URZĄDZENIA</div>
                        <div style={{ fontSize: 11, fontWeight: 900, textAlign: 'center', color: 'var(--ios-blue)', fontFamily: 'monospace' }}>{hwid}</div>
                    </div>
                    <div className="card">
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--ios-text-sec)' }}>KLUCZ DOSTĘPU</label>
                            <input style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#fff', fontSize: 12, marginTop: 4 }} value={inputKey} onChange={e => setInputKey(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--ios-text-sec)' }}>KOD POLECAJĄCEGO</label>
                            <input style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#fff', fontSize: 12, marginTop: 4 }} placeholder="Opcjonalnie" value={referralInput} onChange={e => setReferralInput(e.target.value)} />
                        </div>
                        <button className="btn" onClick={handleActivate}>AKTYWUJ SUPREME</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, padding: '0 5px' }}>
                            <div style={{ fontSize: 10, fontWeight: 900, background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ color: 'var(--ios-blue)' }}>{currentUser?.role === 'admin' ? 'SYSTEM ADMIN' : 'USER'}</span>
                                <span style={{ marginLeft: 8 }}>💎 {currentUser?.points}</span>
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 900, opacity: 0.5 }}>{getRemainingTime(currentUser?.expiresAt || "")}</div>
                        </div>

                        {activeTab === 'home' && (
                            <div className="fade-in">
                                <div className="card">
                                    <div className="row">
                                        <div className="info">
                                            <div className="row-label">Ghost Shield EX</div>
                                            <div className="row-sub">Całkowita niewidoczność</div>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" checked={pluginConfig.antiAntiTampering} onChange={e => pluginConfig.setAntiAntiTampering(e.target.checked)} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="row" style={{ marginBottom: 12 }}>
                                        <div className="info">
                                            <div className="row-label">Zatrzymaj Czas</div>
                                            <div className="row-sub">Blokada licznika locally</div>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" checked={pluginConfig.timeFreeze} onChange={e => pluginConfig.setTimeFreeze(e.target.checked)} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-outline" style={{ flex: 1, padding: 8, fontSize: 10 }} onClick={() => pluginConfig.triggerReset()}>SYNC CZAS</button>
                                        <button className="btn btn-red" style={{ flex: 1, padding: 8, fontSize: 10 }} onClick={handleClear}>CZYŚĆ SESJĘ</button>
                                    </div>
                                </div>
                                <div className="card" style={{ padding: '12px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        <div style={{ background: '#000', padding: 10, borderRadius: 10, textAlign: 'center' }}>
                                            <div style={{ fontSize: 7, opacity: 0.4, fontWeight: 900 }}>GOOGLE</div>
                                            <div style={{ fontSize: 10, fontWeight: 900 }}>CTRL + Z</div>
                                        </div>
                                        <div style={{ background: '#000', padding: 10, borderRadius: 10, textAlign: 'center' }}>
                                            <div style={{ fontSize: 7, opacity: 0.4, fontWeight: 900 }}>PERPLEXITY</div>
                                            <div style={{ fontSize: 10, fontWeight: 900 }}>CTRL+SFT+Z</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'games' && (
                            <div className="fade-in">
                                <div className="aviator-window">
                                    <div className={`mountains ${isFlying ? 'moving' : ''}`}></div>
                                    <div className={`plane ${isFlying ? 'flying' : ''}`} style={getPlaneStyle()}>✈️</div>
                                    <div className={`mult ${(!isFlying && mult === crashPoint && mult > 1) ? 'crashed' : ''}`}>
                                        {mult.toFixed(2)}x
                                    </div>
                                </div>
                                <div className="card" style={{ padding: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '4px 12px', marginBottom: 10 }}>
                                        <span style={{ fontSize: 16 }}>💎</span>
                                        <input type="number" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 900, outline: 'none' }} value={bet} onChange={e => setBet(parseInt(e.target.value) || 0)} />
                                    </div>
                                    {isFlying && !cashedOut ? (
                                        <button className="btn" style={{ background: 'var(--ios-green)' }} onClick={cashOut}>WYPŁAĆ</button>
                                    ) : (
                                        <button className="btn" onClick={startAviator} disabled={(currentUser?.points || 0) < bet}>STAWIAJ {bet} 💎</button>
                                    )}
                                </div>
                                <div className="card" style={{ textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={copyRef}>
                                    <div className={`copy-fb ${showCopyFb ? 'show' : ''}`} style={{ top: -20, left: '50%', transform: 'translateX(-50%)' }}>SKOPIOWANO!</div>
                                    <div style={{ fontSize: 8, fontWeight: 900, opacity: 0.5 }}>TWÓJ KOD POLECAJĄCEGO</div>
                                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ios-blue)', letterSpacing: 3 }}>{currentUser?.reflink}</div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'terminal' && (
                            <div className="fade-in">
                                <div className="card" style={{ padding: 8, display: 'flex', gap: 6, marginBottom: 12 }}>
                                    <input style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: 8, padding: 8, color: '#fff', fontSize: 11 }} placeholder="Nazwa klucza..." value={newKeyVal} onChange={e => setNewKeyVal(e.target.value)} />
                                    <button className="btn" style={{ width: 35, padding: 0 }} onClick={() => { if (newKeyVal) { addKey(newKeyVal, 'user', 30, "ROOT"); setNewKeyVal(""); } }}>+</button>
                                </div>
                                {db?.keys.map(k => (
                                    <div key={k.id} className="card" style={{ padding: '10px 12px', margin: '0 0 8px 0' }}>
                                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--ios-blue)' }}>{k.key}</span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <span style={{ fontSize: 10, opacity: 0.4 }}>💎 {k.points}</span>
                                                <button onClick={() => deleteKey(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10 }}>🗑️</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="nav">
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                            <span>SYSTEM</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'games' ? 'active' : ''}`} onClick={() => setActiveTab('games')}>
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.13c-.31.11-.64.11-.95 0l-7.97-4.13c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.13c.31-.11.64-.11.95 0l7.97 4.13c.32.17.53.5.53.88v9zM12 4.15L5.34 7.5 12 10.85l6.66-3.35L12 4.15z" /></svg>
                            <span>GRY</span>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <div className={`nav-item ${activeTab === 'terminal' ? 'active' : ''}`} onClick={() => setActiveTab('terminal')}>
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.52 0-10 4.47-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm2 14.5c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5v-3.5h4v3.5zm0-4.5h-4v-4h4v4z" /></svg>
                                <span>TERMINAL</span>
                            </div>
                        )}
                        <div className="nav-item" style={{ opacity: 0.3 }} onClick={() => { pluginConfig.setShieldKey(""); setIsActivated(false); }}>
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.833z" /></svg>
                            <span>OFF</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default IndexPopup;
