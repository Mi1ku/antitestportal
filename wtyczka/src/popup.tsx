import "./style.css";
import { useState, useEffect, useRef } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import useDatabase, { type DbKey } from "~hooks/use-database";

type ActiveTab = "home" | "admin" | "casino";

function IndexPopup() {
    const { pluginConfig } = usePluginConfig();
    const { db, hwid, addKey, updateKey, deleteKey, validateKey, addPoints, isLoading, checkForUpdates } = useDatabase();

    const [isActivated, setIsActivated] = useState(false);
    const [currentUser, setCurrentUser] = useState<DbKey | null>(null);
    const [inputKey, setInputKey] = useState("");
    const [referralInput, setReferralInput] = useState("");
    const [uiMessage, setUiMessage] = useState({ text: "", type: "" });
    const [activeTab, setActiveTab] = useState<ActiveTab>("home");
    const [updateStatus, setUpdateStatus] = useState<string>("v1.3.0 (Supreme)");

    // Crash Casino State
    const [crashMultiplier, setCrashMultiplier] = useState(1.00);
    const [isCrashRunning, setIsCrashRunning] = useState(false);
    const [hasCashedOut, setHasCashedOut] = useState(false);
    const [crashPoint, setCrashPoint] = useState(0);
    const [betAmount, setBetAmount] = useState(10);
    const crashIntervalRef = useRef<any>(null);

    // Admin Edit State
    const [editingKey, setEditingKey] = useState<DbKey | null>(null);
    const [newKeyVal, setNewKeyVal] = useState("");
    const [newKeyRole, setNewKeyRole] = useState<'user' | 'admin'>("user");
    const [newKeyDays, setNewKeyDays] = useState<string>("30");

    useEffect(() => {
        const checkExisting = async () => {
            if (pluginConfig.shieldKey && !isLoading && db) {
                const result = await validateKey(pluginConfig.shieldKey);
                if (result.success) {
                    setIsActivated(true);
                    setCurrentUser(result.user || null);
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
            setCurrentUser(result.user || null);
            showMessage(`WITAJ ${result.user?.role.toUpperCase()} 💎`, "success");
        } else {
            showMessage(result.error || "BŁĄD AUTORYZACJI", "error");
        }
    };

    // --- CRASH GAME LOGIC ---
    const startCrash = () => {
        if (!currentUser || currentUser.points < betAmount || isCrashRunning) return;

        addPoints(currentUser.id, -betAmount);
        setIsCrashRunning(true);
        setHasCashedOut(false);
        setCrashMultiplier(1.00);

        // Calculate crash point (more realistic)
        const r = Math.random();
        const point = Math.max(1.00, Math.floor((100 / (1 - r)) / 100 * 100) / 100);
        setCrashPoint(point);

        crashIntervalRef.current = setInterval(() => {
            setCrashMultiplier(prev => {
                const next = prev + 0.01 + (prev * 0.005); // Accelerate
                if (next >= point) {
                    clearInterval(crashIntervalRef.current);
                    setIsCrashRunning(false);
                    if (!hasCashedOut) {
                        showMessage(`CRASH @ ${point.toFixed(2)}x 💥`, "error");
                    }
                    return point;
                }
                return next;
            });
        }, 80);
    };

    const cashOut = () => {
        if (!isCrashRunning || hasCashedOut) return;
        setHasCashedOut(true);
        if (crashMultiplier < crashPoint) {
            const winAmount = Math.floor(betAmount * crashMultiplier);
            addPoints(currentUser!.id, winAmount);
            showMessage(`CASHED OUT: ${winAmount} 💎 (x${crashMultiplier.toFixed(2)})`, "success");
        }
    };

    useEffect(() => {
        return () => { if (crashIntervalRef.current) clearInterval(crashIntervalRef.current); };
    }, []);

    // --- ADMIN ACTIONS ---
    const handleCreateKey = () => {
        if (!newKeyVal) return;
        const days = newKeyDays === "never" ? "never" : parseInt(newKeyDays);
        addKey(newKeyVal, newKeyRole, days as any, "Generated");
        setNewKeyVal("");
        showMessage("KLUCZ UTWORZONY!", "success");
    };

    const handleUpdateKey = () => {
        if (!editingKey) return;
        updateKey(editingKey.id, editingKey);
        setEditingKey(null);
        showMessage("ZAPISANO ZMIANY!", "success");
    };

    const handleLogout = () => {
        pluginConfig.setShieldKey("");
        setIsActivated(false);
        setCurrentUser(null);
        setActiveTab("home");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showMessage("SKOPIOWANO!", "success");
    };

    if (isLoading) return <div className="apple-loader"><span></span></div>;

    if (!isActivated) {
        return (
            <div className="apple-popup">
                <div className="apple-header">
                    <h1 className="apple-logo">AntiTestportal <span>ULTRA</span></h1>
                    <div className="apple-status pulse">SECURE</div>
                </div>

                {uiMessage.text && <div className={`apple-toast ${uiMessage.type}`}>{uiMessage.text}</div>}

                <div className="apple-card">
                    <div className="apple-hwid-box" onClick={() => copyToClipboard(hwid)}>
                        <div className="label">TWÓJ HARDWARE ID</div>
                        <div className="value">{hwid}</div>
                    </div>

                    <div className="apple-input-group">
                        <label>KLUCZ LICENCYJNY</label>
                        <input
                            type="text" value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="WPISZ KLUCZ..."
                        />
                    </div>

                    <div className="apple-input-group">
                        <label>KOD POLECENIA (OPCJONALNIE)</label>
                        <input
                            type="text" value={referralInput}
                            onChange={(e) => setReferralInput(e.target.value)}
                            placeholder="NP. MIKUS76"
                        />
                    </div>

                    <button className="apple-button primary" onClick={handleActivate}>AKTYWUJ</button>
                </div>
            </div>
        );
    }

    return (
        <div className="apple-popup">
            <div className="apple-header-main">
                <div className="user-info">
                    <span className="role-tag">{currentUser?.role}</span>
                    <span className="points-tag">💎 {currentUser?.points}</span>
                </div>
                <h2 className="title">Supreme <span>CORE</span></h2>
            </div>

            <div className="apple-tabs">
                <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Engine</button>
                <button className={activeTab === 'casino' ? 'active' : ''} onClick={() => setActiveTab('casino')}>Crash</button>
                {currentUser?.role === 'admin' && (
                    <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}>Admin</button>
                )}
            </div>

            {uiMessage.text && <div className={`apple-toast ${uiMessage.type}`}>{uiMessage.text}</div>}

            <div className="apple-content">
                {activeTab === 'home' && (
                    <div className="tab-pane">
                        <div className="apple-module">
                            <div className="module-row">
                                <div>
                                    <div className="m-title">SYSTEM FREEZE 2.0</div>
                                    <div className="m-desc">Zatrzymuje czas Testportalu</div>
                                </div>
                                <label className="apple-switch">
                                    <input type="checkbox" checked={pluginConfig.timeFreeze} onChange={(e) => pluginConfig.setTimeFreeze(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <button className="apple-button secondary small" onClick={() => pluginConfig.triggerReset()}>RESET TIMERA</button>
                        </div>

                        <div className="apple-module">
                            <div className="module-row">
                                <div>
                                    <div className="m-title">GHOST SHIELD EX</div>
                                    <div className="m-desc">Ukrywa przełączanie kart</div>
                                </div>
                                <label className="apple-switch">
                                    <input type="checkbox" checked={pluginConfig.antiAntiTampering} onChange={(e) => pluginConfig.setAntiAntiTampering(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="apple-module-info">
                            <div className="m-title">SKRÓTY KLAWISZOWE</div>
                            <div className="kbd-row"><span>Ctrl + Z</span> Google</div>
                            <div className="kbd-row"><span>Alt + Z</span> AI Solver</div>
                            <div className="kbd-row"><span>Ctrl+Alt+F</span> Freeze</div>
                        </div>

                        <button className="apple-button ghost danger" onClick={handleLogout}>WYLOGUJ</button>
                    </div>
                )}

                {activeTab === 'casino' && (
                    <div className="tab-pane casino">
                        <div className="crash-display">
                            <div className={`mult ${(crashMultiplier === crashPoint && !isCrashRunning) ? 'crashed' : ''}`}>
                                {crashMultiplier.toFixed(2)}x
                            </div>
                            <div className="crash-status">
                                {isCrashRunning ? (hasCashedOut ? "CASHED OUT ✅" : "RUNNING...") : "WAITING"}
                            </div>
                        </div>

                        <div className="crash-controls">
                            <input type="number" value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)} className="bet-input" />
                            {isCrashRunning && !hasCashedOut ? (
                                <button className="apple-button primary cashout" onClick={cashOut}>CASH OUT</button>
                            ) : (
                                <button className="apple-button primary" onClick={startCrash} disabled={currentUser!.points < betAmount}>PLAY (10 💎)</button>
                            )}
                        </div>

                        <div className="referral-box" onClick={() => copyToClipboard(currentUser?.reflink || "")}>
                            <span className="label">KOD POLECENIA</span>
                            <span className="code">{currentUser?.reflink}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'admin' && (
                    <div className="tab-pane admin">
                        {editingKey ? (
                            <div className="apple-card admin-edit">
                                <h3>Edytuj Klucz: {editingKey.key}</h3>
                                <div className="input-group">
                                    <label>Punkty</label>
                                    <input type="number" value={editingKey.points} onChange={(e) => setEditingKey({ ...editingKey, points: parseInt(e.target.value) })} />
                                </div>
                                <div className="input-group">
                                    <label>HWIDs (po przecinku)</label>
                                    <textarea
                                        value={editingKey.boundHwids?.join(', ')}
                                        onChange={(e) => setEditingKey({ ...editingKey, boundHwids: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                                    />
                                </div>
                                <div className="edit-actions">
                                    <button className="apple-button primary small" onClick={handleUpdateKey}>ZAPISZ</button>
                                    <button className="apple-button ghost small" onClick={() => setEditingKey(null)}>ANULUJ</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="apple-card admin-add">
                                    <input type="text" placeholder="KLUCZ..." value={newKeyVal} onChange={(e) => setNewKeyVal(e.target.value)} />
                                    <select value={newKeyRole} onChange={(e) => setNewKeyRole(e.target.value as any)}>
                                        <option value="user">USER</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                    <button className="apple-button primary small" onClick={handleCreateKey}>DODAJ</button>
                                </div>

                                <div className="admin-list">
                                    {db?.keys.map(k => (
                                        <div key={k.id} className="admin-item">
                                            <div className="info">
                                                <div className="key">{k.key}</div>
                                                <div className="hwids">
                                                    {k.boundHwids?.length ? `${k.boundHwids.length} HWID` : 'NO HWID'}
                                                </div>
                                            </div>
                                            <div className="pts">{k.points}💎</div>
                                            <div className="actions">
                                                <button onClick={() => setEditingKey(k)}>✏️</button>
                                                <button onClick={() => deleteKey(k.id)} className="danger">❌</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="apple-footer">v1.3.0 | BY MIKUS</div>
        </div>
    );
}

export default IndexPopup;
