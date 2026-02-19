import "./style.css";
import { useState, useEffect, useRef } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import useDatabase, { type DbKey } from "~hooks/use-database";

type Tab = "home" | "games" | "terminal" | "guide";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const { db, hwid, addKey, updateKey, deleteKey, validateKey, addPoints, isLoading, getRemainingTime, clearSession, toggleBan } = useDatabase();

    const [isActivated, setIsActivated] = useState(false);
    const [currentUser, setCurrentUser] = useState<DbKey | null>(null);
    const [inputKey, setInputKey] = useState("");
    const [referralInput, setReferralInput] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("home");

    // UI State
    const [toast, setToast] = useState<{ show: boolean, msg: string }>({ show: false, msg: "" });
    const [newKeyName, setNewKeyName] = useState("");
    const [isKeyAlreadyBound, setIsKeyAlreadyBound] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<DbKey | null>(null);
    const [editName, setEditName] = useState("");
    const [editPoints, setEditPoints] = useState(0);
    const [editHwid, setEditHwid] = useState("");
    const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
    const [editMaxHwids, setEditMaxHwids] = useState(3);
    const [editReflink, setEditReflink] = useState("");

    // Aviator Logic
    const [mult, setMult] = useState(1.00);
    const [isFlying, setIsFlying] = useState(false);
    const [cashedOut, setCashedOut] = useState(false);
    const [finalStats, setFinalStats] = useState<{ win: number, m: number } | null>(null);
    const [crashPoint, setCrashPoint] = useState(0);
    const [bet, setBet] = useState(10);
    const [cooldown, setCooldown] = useState(false);

    const timerRef = useRef<any>(null);

    const showToast = (msg: string) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: "" }), 3000);
    };

    useEffect(() => {
        const check = async () => {
            if (isLoading || !db) return;

            // 1. Spróbuj zalogować zapisany klucz
            if (pluginConfig.shieldKey) {
                const res = await validateKey(pluginConfig.shieldKey);
                if (res.success) {
                    setIsActivated(true);
                    setCurrentUser(res.user || null);
                    console.log("[Supreme] Auto-login with saved key success.");
                    return;
                } else {
                    pluginConfig.setShieldKey("");
                }
            }

            // 2. Jeśli brak klucza lub błędny, spróbuj AUTO-LOGIN po HWID
            const userByHwid = db.keys.find(k => k.boundHwids?.includes(hwid));
            if (userByHwid) {
                console.log("[Supreme] Auto-login by HWID success.");
                setIsActivated(true);
                setCurrentUser(userByHwid);
                // Zapisujemy klucz tego użytkownika dla spójności
                pluginConfig.setShieldKey(userByHwid.key);
            }
        };
        check();
    }, [isLoading, !!db, hwid]);

    useEffect(() => {
        if (db && inputKey) {
            const k = db.keys?.find(x => x.key === inputKey.trim());
            setIsKeyAlreadyBound(!!(k && k.boundHwids && k.boundHwids.length > 0));
        }
    }, [inputKey, db]);

    useEffect(() => {
        if (currentUser && db) {
            const found = db.keys?.find(k => k.id === currentUser.id);
            if (found) setCurrentUser(found);
        }
    }, [db, currentUser?.id]);

    const handleLogin = async () => {
        const res = await validateKey(inputKey.trim(), referralInput.trim());
        if (res.success) {
            pluginConfig.setShieldKey(inputKey.trim());
            // Auto-aktywacja po zalogowaniu
            pluginConfig.setShowHud(true);
            pluginConfig.setAntiAntiTampering(true);

            setIsActivated(true);
            setCurrentUser(res.user || null);
        } else {
            showToast(res.error || "BŁĄD LOGOWANIA");
        }
    };

    const handleClear = async () => {
        await clearSession();
        window.location.reload();
    };

    const copyRef = () => {
        if (!currentUser?.reflink || isCopying) return;
        navigator.clipboard.writeText(currentUser.reflink);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2500);
    };

    const startAviator = () => {
        if (!currentUser || currentUser.points < bet || isFlying || cooldown) return;
        setCooldown(true);
        addPoints(currentUser.id, -bet);
        setIsFlying(true);
        setCashedOut(false);
        setFinalStats(null);
        setMult(1.00);

        const r = Math.random();
        const cp = Math.max(1.01, Math.floor((100 / (1 - r)) / 100 * 100) / 100);
        setCrashPoint(cp);

        let cur = 1.00;
        timerRef.current = setInterval(() => {
            const speedFact = window.__tp_co ? 3.0 : 1.0;
            const step = (0.01 + cur * 0.007) * speedFact;
            cur += step;
            if (cur >= cp) {
                clearInterval(timerRef.current);
                setIsFlying(false);
                setMult(cp);
                window.__tp_co = false;
                setTimeout(() => setCooldown(false), 1500);
                return;
            }
            setMult(cur);
        }, 85);
    };

    const cashOut = () => {
        if (!isFlying || cashedOut) return;
        const winAmount = Math.floor(bet * mult);
        setCashedOut(true);
        setFinalStats({ win: winAmount, m: mult });
        addPoints(currentUser!.id, winAmount);
        window.__tp_co = true;
    };

    const openEditModal = (user: DbKey) => {
        setEditingUser(user);
        setEditName(user.ownerName || "");
        setEditPoints(user.points);
        setEditHwid(user.boundHwids?.join(", ") || "");
        setEditRole(user.role);
        setEditMaxHwids(user.maxHwids || 3);
        setEditReflink(user.reflink || "");
    };

    const saveUserChanges = async () => {
        if (!editingUser) return;
        const hwids = editHwid.split(",").map(h => h.trim()).filter(h => h.length > 0);
        await updateKey(editingUser.id, {
            ownerName: editName,
            points: editPoints,
            boundHwids: hwids,
            role: editRole,
            maxHwids: editMaxHwids,
            reflink: editReflink
        });
        setEditingUser(null);
        showToast("ZAPISANO ZMIANY");
    };

    // SAFETY CHECK: If still loading, show nice spinner
    if (isLoading || !db) return (
        <div className="app-container" style={{ background: '#050805' }}>
            <div className="loader-wrap"><div className="loader"></div></div>
        </div>
    );

    return (
        <div className="app-container">
            <div className="header">
                <span className="logo-anti">ANTI</span>
                <span className="logo-testportal">TESTPORTAL</span>
                <div className="logo-plus">+</div>
            </div>

            <div className={`tp-toast ${toast.show ? 'active' : ''}`}>{toast.msg}</div>

            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">EDYTUJ UŻYTKOWNIKA</div>
                        <div className="modal-input-group">
                            <label>NAZWA UŻYTKOWNIKA</label>
                            <input value={editName} onChange={e => setEditName(e.target.value)} />
                        </div>
                        <div className="modal-input-group">
                            <label>DIAMENTY (💎)</label>
                            <input type="number" value={editPoints} onChange={e => setEditPoints(parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: 9, opacity: 0.6 }}>HWIDs (po przecinku)</label>
                            <textarea value={editHwid} onChange={(e) => setEditHwid(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 4, color: '#fff', width: '100%', height: 50, fontSize: 10, padding: 5 }} />
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: 9, opacity: 0.6 }}>Max Urządzeń</label>
                            <input
                                type="number"
                                value={editMaxHwids}
                                onChange={(e) => setEditMaxHwids(Number(e.target.value))}
                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 4, color: '#fff', width: '100%', padding: 5, fontSize: 12 }}
                            />
                        </div>

                        <div className="modal-input-group">
                            <label>REFLINK UŻYTKOWNIKA</label>
                            <input value={editReflink} onChange={e => setEditReflink(e.target.value)} />
                        </div>
                        <div className="modal-input-group">
                            <label>RANGI SYSTEMOWEJ</label>
                            <select value={editRole} onChange={e => setEditRole(e.target.value as any)}>
                                <option value="user">USER (Standardowy)</option>
                                <option value="admin">ADMIN (Root)</option>
                            </select>
                        </div>
                        <div style={{ marginTop: 15, padding: 10, background: 'rgba(255,59,58,0.05)', borderRadius: 10, border: '1px solid rgba(255,59,58,0.2)', display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <div style={{ fontSize: 7, fontWeight: 900, color: 'var(--red-glow)', marginBottom: 2 }}>NARZĘDZIA KONTROLI</div>
                            <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--red-glow)', color: 'var(--red-glow)', fontSize: 9 }} onClick={async () => {
                                const hwids = editingUser.boundHwids || [];
                                for (const h of hwids) await toggleBan(h);
                                showToast("ZMIENIONO STATUS BANA");
                            }}>
                                {db?.bannedHwids?.includes(editingUser.boundHwids?.[0] || "") ? "ODBANUJ URZĄDZENIA" : "ZBANUJ WSZYSTKIE HWID"}
                            </button>
                            <button className="btn-secondary" style={{ width: '100%', borderColor: 'orange', color: 'orange', fontSize: 9 }} onClick={async () => {
                                if (confirm("Czy na pewno wyczyścić wszystkie przypisane urządzenia?")) {
                                    setEditHwid("");
                                    await updateKey(editingUser.id, { boundHwids: [] });
                                    showToast("WYCZYSZCZONO HWID");
                                }
                            }}>
                                WYCZYŚĆ LISTĘ HWID (RESET)
                            </button>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setEditingUser(null)}>ANULUJ</button>
                            <button className="btn-primary" style={{ padding: 10, fontSize: 11 }} onClick={saveUserChanges}>ZAPISZ</button>
                        </div>
                    </div>
                </div>
            )}


            {!isActivated ? (
                <div className="content">
                    <div style={{ textAlign: 'center', marginBottom: 15, marginTop: 10 }}>
                        <div style={{ fontSize: 18, fontWeight: 950, color: '#fff' }}>SYSTEM LOGIN</div>
                        <div style={{ fontSize: 8, opacity: 0.4 }}>ZALOGUJ SIĘ DO PANELU</div>
                    </div>
                    <div className="card" style={{ padding: 15 }}>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 8, fontWeight: 900, color: 'var(--green-glow)' }}>IDENTYFIKATOR HWID</label>
                            <input value={hwid} readOnly style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: 'var(--green-glow)', fontSize: 11, fontWeight: 900, textAlign: 'center', marginTop: 4, outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 8, fontWeight: 900, color: 'var(--green-glow)' }}>KLUCZ DOSTĘPU</label>
                            <input value={inputKey} onChange={e => setInputKey(e.target.value)} placeholder="Wklej swój klucz..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: '#fff', fontSize: 12, marginTop: 4, outline: 'none' }} />
                        </div>
                        {db && !isKeyAlreadyBound && (
                            <div style={{ marginBottom: 15 }}>
                                <label style={{ fontSize: 8, fontWeight: 900, color: 'var(--green-glow)' }}>REFLINK (+25💎)</label>
                                <input value={referralInput} onChange={e => setReferralInput(e.target.value)} placeholder="Opcjonalny kod polecającego" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, color: '#fff', fontSize: 12, marginTop: 4, outline: 'none' }} />
                            </div>
                        )}
                        <button className="btn-primary" onClick={handleLogin}>ZALOGUJ DO SYSTEMU</button>
                        <div style={{ marginTop: 15, textAlign: 'center', fontSize: 10, opacity: 0.7, cursor: 'pointer' }} onClick={() => window.open("https://www.instagram.com/76mikus/", "_blank")}>
                            Nie masz klucza? <span style={{ fontWeight: 900, textDecoration: 'underline', color: 'var(--green-glow)' }}>Napisz na IG: @76mikus</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '0 5px' }}>
                            <div style={{ fontSize: 10, fontWeight: 950, color: 'var(--green-glow)', background: 'rgba(0,0,0,0.4)', padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 10 }}>
                                {currentUser?.role === 'admin' ? '[ADM]' : '[USR]'} {currentUser?.points} 💎
                            </div>
                            <div style={{ fontSize: 9, opacity: 0.5, marginTop: 6 }}>{getRemainingTime(currentUser?.expiresAt || 0)}</div>
                        </div>

                        {activeTab === 'home' && (
                            <div className="fade-in">
                                <div className="card">
                                    <div className="switch-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 13, fontWeight: 800 }}>Ghost Shield EX</div>
                                        <div className={`toggle-io ${pluginConfig.antiAntiTampering ? 'active' : ''}`} onClick={() => pluginConfig.setAntiAntiTampering(!pluginConfig.antiAntiTampering)}>
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 9, opacity: 0.4, marginTop: 2 }}>Maskuj obecność wtyczki 1:1</div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                                        <div style={{ fontSize: 13, fontWeight: 800 }}>HUD Widoczny</div>
                                        <div className={`toggle-io ${pluginConfig.showHud ? 'active' : ''}`} onClick={() => pluginConfig.setShowHud(!pluginConfig.showHud)}>
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="switch-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 13, fontWeight: 800 }}>Nielimitowany Czas</div>
                                        <div className={`toggle-io ${pluginConfig.timeFreeze ? 'active' : ''}`} onClick={() => pluginConfig.setTimeFreeze(!pluginConfig.timeFreeze)}>
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 9, opacity: 0.4, marginTop: 2 }}>Zatrzymuje czas po stronie klienta.</div>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                        <button className="btn-primary" style={{ padding: 8, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#fff' }} onClick={() => pluginConfig.triggerReset()}>SYNC</button>
                                        <button className="btn-primary" style={{ padding: 8, fontSize: 10, background: 'rgba(255,69,58,0.1)', color: 'var(--red-glow)' }} onClick={handleClear}>RESET SESJI</button>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="switch-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 13, fontWeight: 800 }}>Auto-Answer Genius</div>
                                        <div className={`toggle-io ${pluginConfig.showAnswerBot ? 'active' : ''}`} onClick={() => pluginConfig.setShowAnswerBot(!pluginConfig.showAnswerBot)}>
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 9, opacity: 0.4, marginTop: 2 }}>Wyświetlaj podpowiedzi w treści pytania</div>

                                    <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                                        <button
                                            onClick={() => pluginConfig.setSearchEngine('google')}
                                            style={{
                                                flex: 1, padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                                                background: pluginConfig.searchEngine === 'google' ? 'var(--green-glow)' : 'transparent',
                                                color: pluginConfig.searchEngine === 'google' ? '#000' : '#fff',
                                                fontSize: 9, fontWeight: 800, cursor: 'pointer'
                                            }}
                                        >GOOGLE</button>
                                        <button
                                            onClick={() => pluginConfig.setSearchEngine('perplexity')}
                                            style={{
                                                flex: 1, padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                                                background: pluginConfig.searchEngine === 'perplexity' ? 'var(--green-glow)' : 'transparent',
                                                color: pluginConfig.searchEngine === 'perplexity' ? '#000' : '#fff',
                                                fontSize: 9, fontWeight: 800, cursor: 'pointer'
                                            }}
                                        >PERPLEXITY AI</button>
                                    </div>
                                </div>
                                <div className="card" style={{ padding: 10 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        <div style={{ background: '#000', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                                            <div style={{ fontSize: 7, opacity: 0.4, fontWeight: 900 }}>GOOGLE</div>
                                            <div style={{ fontSize: 10, fontWeight: 950 }}>CTRL + Z</div>
                                        </div>
                                        <div style={{ background: '#000', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                                            <div style={{ fontSize: 7, opacity: 0.4, fontWeight: 900 }}>PERPLEXITY</div>
                                            <div style={{ fontSize: 10, fontWeight: 950 }}>CTRL+SFT+Z</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'games' && (
                            <div className="fade-in">
                                <div className="game-viewport">
                                    <div className={`star-layer ${isFlying ? 'moving' : ''}`}></div>
                                    <div className={`rock-layer ${isFlying ? 'moving' : ''}`}></div>

                                    {cashedOut && finalStats && (
                                        <div className="cashout-badge">WYPŁACONO: {finalStats.win} 💎 ({finalStats.m.toFixed(2)}x)</div>
                                    )}

                                    {!(!isFlying && mult === crashPoint && mult > 1) && (
                                        <div className={`plane ${isFlying ? 'flying' : ''}`} style={{
                                            bottom: `${20 + Math.min(1, (mult - 1) / 4) * 55}%`,
                                            left: `${20 + Math.min(1, (mult - 1) / 4) * 60}%`
                                        }}>✈️</div>
                                    )}
                                    <div className={`multiplier ${(!isFlying && mult === crashPoint && mult > 1) ? 'crashed' : ''}`}>{mult.toFixed(2)}x</div>
                                </div>
                                <div className="card" style={{ padding: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 5 }}>
                                        <span style={{ opacity: 0.5 }}>STAWKA DIAMENTY</span>
                                        <span style={{ color: 'var(--green-glow)' }}>DOSTĘPNE: {currentUser?.points}</span>
                                    </div>
                                    <input type="number" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: '#fff', fontSize: 16, fontWeight: 950, marginBottom: 8, outline: 'none' }} value={bet} onChange={e => setBet(parseInt(e.target.value) || 0)} />
                                    {isFlying && !cashedOut ? (
                                        <button className="btn-primary" onClick={cashOut}>WYPŁAĆ ZYSK</button>
                                    ) : (
                                        <button className="btn-primary" onClick={startAviator} disabled={(currentUser?.points || 0) < bet || cooldown}>STAWIAJ {bet} 💎</button>
                                    )}
                                </div>
                                <div className="card" style={{ textAlign: 'center', cursor: 'pointer', padding: 18 }} onClick={copyRef}>
                                    {isCopying ? (
                                        <div style={{ fontSize: 11, fontWeight: 950, color: 'var(--green-glow)', animation: 'slide-up 0.3s forwards' }}>SKOPIOWANO KOD POLECAJĄCEGO!</div>
                                    ) : (
                                        <>
                                            <div style={{ fontSize: 7, opacity: 0.5, fontWeight: 900 }}>LINK REFERALNY (KLIKNIJ ABY SKOPIOWAĆ)</div>
                                            <div style={{ fontSize: 16, fontWeight: 950, color: 'var(--green-glow)', letterSpacing: 3, marginTop: 4 }}>{currentUser?.reflink}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'guide' && (
                            <div className="fade-in">
                                <div className="card" style={{ padding: 15 }}>
                                    <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 10, color: 'var(--green-glow)' }}>PORADNIK UŻYTKOWNIKA</div>

                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ fontSize: 11, fontWeight: 800 }}>🛡️ Ghost Shield EX</div>
                                        <div style={{ fontSize: 9, opacity: 0.6 }}>Ochrona przed detekcją. Włącz przed wejściem na test. Odśwież (F5) w razie problemów.</div>
                                    </div>

                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ fontSize: 11, fontWeight: 800 }}>⏳ Time Freeze</div>
                                        <div style={{ fontSize: 9, opacity: 0.6 }}>Zamraża licznik czasu (wizualnie 99:99). Używaj ostrożnie.</div>
                                    </div>

                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ fontSize: 11, fontWeight: 800 }}>🔎 Side Dock (AI Assistant)</div>
                                        <div style={{ fontSize: 9, opacity: 0.6 }}>Panel boczny z Google/Perplexity. Sterowanie przyciskami w HUD lub skrótami.</div>
                                    </div>

                                    <div style={{ marginBottom: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
                                        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 6 }}>⌨️ SKRÓTY KLAWISZOWE</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', fontSize: 9, opacity: 0.8 }}>
                                            <div style={{ color: 'var(--green-glow)', fontWeight: 900 }}>CTRL+SFT+Z</div>
                                            <div>Panic Mode (Ukryj HUD & Dock)</div>

                                            <div style={{ color: 'var(--green-glow)', fontWeight: 900 }}>CTRL+SFT+X</div>
                                            <div>Pokaż/Ukryj Side Dock</div>

                                            <div style={{ color: 'var(--green-glow)', fontWeight: 900 }}>CTRL+SFT+F</div>
                                            <div>Włącz/Wyłącz Time Freeze</div>

                                            <div style={{ color: '#aaa', fontWeight: 900 }}>CTRL+Z</div>
                                            <div>Quick Google (Nowa Karta)</div>

                                            <div style={{ color: '#aaa', fontWeight: 900 }}>CTRL+SFT+S</div>
                                            <div>Quick Perplexity (Nowa Karta)</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: 9, color: 'var(--red-glow)', border: '1px solid var(--red-glow)', padding: 8, borderRadius: 6, marginTop: 10 }}>
                                        <b>PORADA:</b> Jeśli coś nie działa po zmianie ustawień ➜ odśwież stronę (F5).
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'terminal' && (
                            <div className="fade-in">
                                <div className="card" style={{ padding: 10, display: 'flex', gap: 6, marginBottom: 8 }}>
                                    <input style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: '#fff', fontSize: 11 }} placeholder="ID klucza..." value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
                                    <button className="btn-primary" style={{ width: 40, padding: 0 }} onClick={() => { if (newKeyName) { addKey(newKeyName, 'user', 30, "SYSTEM"); setNewKeyName(""); } }}>+</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {db?.keys?.map(k => {
                                        const isBanned = k.boundHwids?.some(h => db.bannedHwids?.includes(h));
                                        return (
                                            <div key={k.id} className="admin-item" style={{ background: isBanned ? 'rgba(255,59,58,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isBanned ? 'rgba(255,59,58,0.3)' : 'var(--border)'}`, borderRadius: 12, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isBanned ? 0.7 : 1 }} onClick={() => openEditModal(k)}>
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 800, color: isBanned ? 'var(--red-glow)' : 'var(--green-glow)', fontSize: 11 }}>{k.ownerName || k.key} {isBanned && "(BANNED)"}</span>
                                                    <span style={{ fontSize: 7, opacity: 0.3 }}>{k.key}</span>
                                                    <span style={{ fontSize: 7, color: 'var(--ios-blue)' }}>{k.boundHwids?.length || 0}/{k.maxHwids || 3} URZĄDZEŃ</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <span style={{ fontSize: 9, fontWeight: 900 }}>💎 {k.points}</span>
                                                    <span style={{ fontSize: 10 }}>{k.role === 'admin' ? '👑' : '👤'}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); deleteKey(k.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10 }}>🗑️</button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        )}
                    </div>

                    <div className="tab-bar">
                        <div className={`tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            <svg style={{ width: 18 }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                            <span>SYSTEM</span>
                        </div>
                        <div className={`tab-item ${activeTab === 'games' ? 'active' : ''}`} onClick={() => setActiveTab('games')}>
                            <svg style={{ width: 18 }} viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.13c-.31.11-.64.11-.95 0l-7.97-4.13c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.13c.31-.11.64-.11.95 0l7.97 4.13c.32.17.53.5.53.88v9zM12 4.15L5.34 7.5 12 10.85l6.66-3.35L12 4.15z" /></svg>
                            <span>GRY</span>
                        </div>
                        <div className={`tab-item ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>
                            <svg style={{ width: 18 }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            <span>HELP</span>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <div className={`tab-item ${activeTab === 'terminal' ? 'active' : ''}`} onClick={() => setActiveTab('terminal')}>
                                <svg style={{ width: 18 }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.52 0-10 4.47-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm2 14.5c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5v-3.5h4v3.5zm0-4.5h-4v-4h4v4z" /></svg>
                                <span style={{ fontSize: 7 }}>PANEL</span>
                            </div>
                        )}
                        <div className="tab-item" style={{ opacity: 0.3 }} onClick={() => { pluginConfig.setShieldKey(""); setIsActivated(false); }}>
                            <svg style={{ width: 16 }} viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v10h2V3zM4.93 4.93L6.34 6.34C4.89 7.79 4 9.79 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.21-.89-4.21-2.34-5.66L19.07 4.93C21.1 6.66 22 9.21 22 12c0 5.52-4.48 10-10 10S2 17.52 2 12c0-2.79.9-5.34 2.93-7.07z" /></svg>
                            <span>OFF</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

declare global { interface Window { __tp_co: boolean; } }

export default IndexPopup;
