import "./style.css";
import { useState, useEffect } from "react";
import usePluginConfig from "~hooks/use-plugin-config";
import { KeyService, type LicenseKey } from "~services/KeyService";
const [activeTab, setActiveTab] = useState<Tab>("home");

// Admin State
const [keys, setKeys] = useState<LicenseKey[]>([]);

// Casino State
const [credits, setCredits] = useState(0);
const [slots, setSlots] = useState(["🍒", "🍒", "🍒"]);
const [isSpinning, setIsSpinning] = useState(false);

// Referral State
const [referralInput, setReferralInput] = useState("");

// Custom Gen State
const [genType, setGenType] = useState<'USER' | 'ADMIN'>('USER');
const [genDuration, setGenDuration] = useState<number>(24);
const [genUnit, setGenUnit] = useState<'HOURS' | 'DAYS' | 'PERM'>('HOURS');
const [genNote, setGenNote] = useState("");

useEffect(() => {
    const init = async () => {
        await KeyService.initDatabase();

        if (pluginConfig.shieldKey) {
            const validation = await KeyService.validateKey(pluginConfig.shieldKey);
            if (validation.valid) {
                setIsActivated(true);
                if (validation.type === 'ADMIN') setIsAdmin(true);

                // Load User Data
                const userData = KeyService.getUserData(pluginConfig.shieldKey);
                setCredits(userData.credits);
            }
        }
    };
    init();
}, [pluginConfig.shieldKey]);

// Refresh keys when entering admin tab
useEffect(() => {
    if (activeTab === 'admin') refreshKeys();
}, [activeTab]);

const refreshKeys = async () => {
    const allKeys = await KeyService.getAllKeys();
    setKeys(allKeys);
};

const showMessage = (text: string, type: "success" | "error") => {
    setUiMessage({ text, type });
    setTimeout(() => setUiMessage({ text: "", type: "" }), 3000);
};

const handleActivate = async () => {
    const key = inputKey.trim();
    const validation = await KeyService.validateKey(key);

    if (validation.valid) {
        pluginConfig.setShieldKey(key);
        setIsActivated(true);
        if (validation.type === 'ADMIN') setIsAdmin(true);

        // Load User Data
        const userData = KeyService.getUserData(key);
        setCredits(userData.credits);

        showMessage("WITAJ W ELICIE ULTRA 1.0 💎", "success");
    } else {
        showMessage(validation.reason || "BŁĘDNY KLUCZ LICENCYJNY", "error");
    }
};

const handleRedeemReferral = async () => {
    if (!pluginConfig.shieldKey) return;
    const res = await KeyService.redeemReferral(pluginConfig.shieldKey, referralInput);
    if (res.success) {
        showMessage(res.msg, "success");
        const userData = KeyService.getUserData(pluginConfig.shieldKey);
        setCredits(userData.credits);
        setReferralInput("");
    } else {
        showMessage(res.msg, "error");
    }
};

// --- ADMIN ACTIONS ---
const handleGenerateKey = async (type: 'ADMIN' | 'USER', durationHours: number | null) => {
    await KeyService.createKey(type, durationHours, "Generated via Admin Panel");
    showMessage(`WYGENEROWANO KLUCZ (${type})!`, "success");
    refreshKeys();
};

const handleCustomGenerate = async () => {
    let hours: number | null = null;
    if (genUnit === 'HOURS') hours = genDuration;
    if (genUnit === 'DAYS') hours = genDuration * 24;
    if (genUnit === 'PERM') hours = null;

    await KeyService.createKey(genType, hours, genNote || `Generated via Admin Panel (${genUnit})`);
    showMessage(`WYGENEROWANO KLUCZ (${genType}, ${genUnit})!`, "success");
    setGenNote("");
    refreshKeys();
};

const handleDeleteKey = async (code: string) => {
    if (code === "admin") {
        showMessage("NIE MOŻNA USUNĄĆ ADMINA!", "error");
        return;
    }
    await KeyService.deleteKey(code);
    refreshKeys();
};

// --- CASINO ---
const handleSpin = () => {
    if (credits < 10) {
        showMessage("Brak kredytów! (Koszt: 10)", "error");
        return;
    }

    // Optimistic update
    const newCredits = credits - 10;
    setCredits(newCredits);
    if (pluginConfig.shieldKey) KeyService.updateCredits(pluginConfig.shieldKey, -10);

    setIsSpinning(true);

    const symbols = ["🍒", "💎", "7️⃣", "🍋", "🔔"];
    let spins = 0;
    const interval = setInterval(() => {
        const newSlots = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
        setSlots(newSlots);
        spins++;
        if (spins > 10) {
            clearInterval(interval);
            setIsSpinning(false);
            checkWin(newSlots);
        }
    }, 100);
};

const checkWin = (finalSlots: string[]) => {
    if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
        const reward = finalSlots[0] === "💎" ? 500 : 100;
        const newCredits = credits + reward;
        setCredits(newCredits);
        if (pluginConfig.shieldKey) KeyService.updateCredits(pluginConfig.shieldKey, reward);
        showMessage(`WYGRANA! +${reward} Kredytów!`, "success");
    }
};

const handleClearTrace = async () => {
    try {
        await chrome.browsingData.remove({
            "origins": ["https://www.testportal.pl", "https://www.testportal.net", "https://www.testportal.online"]
        }, { "cache": true, "cookies": true, "localStorage": true });
        showMessage("🗑️ WYCZYSZCZONO ŚLADY I PRZEŁADOWANO! 🔄", "success");
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
            if (tab.url?.includes("testportal")) {
                if (tab.id) await chrome.tabs.reload(tab.id);
            }
        }
    } catch (e) {
        showMessage("❌ BŁĄD CZYSZCZENIA DANYCH", "error");
    }
};

const handleResetTimer = () => {
    pluginConfig.triggerReset();
    showMessage("⏱️ ZEGAR ZRESETOWANY POMYŚLNIE!", "success");
};

if (!isActivated) {
    return (
        <div className="popup-container">
            <div className="header">
                <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
                <div className="status-badge pulse">LOGIN</div>
            </div>
            {uiMessage.text && (
                <div className={`ui-alert ${uiMessage.type}`} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                    {uiMessage.text}
                </div>
            )}
            <div className="glass-card">
                <div className="input-group">
                    <label>Wpisz Klucz Licencyjny</label>
                    <input
                        type="text" value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="WPISZ KLUCZ..."
                    />
                </div>
                <button className="btn btn-primary" onClick={handleActivate}>AKTYWUJ KLUCZEM</button>
                <div className="support-links">
                    <p>Klucze: <b>admin</b> (Panel), <b>mikus</b></p>
                    <p>Instagram: <a href="https://instagram.com/76mikus" target="_blank">@76mikus</a></p>
                </div>
            </div>
            <div className="footer-info">mi1ku Systems 1.0 | @76mikus</div>
        </div>
    );
}

return (
    <div className="popup-container">
        <div className="header">
            <h1 className="logo">AntiTestportal <span>ULTRA</span></h1>
            <div className="status-badge pulse">{isAdmin ? 'ADMIN MODE' : 'PREMIUM 1.0'}</div>
        </div>

        <div className="tabs" style={{ display: 'flex', gap: '5px', marginBottom: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('home')} style={{ fontSize: '10px', padding: '5px 10px' }}>🏠 START</button>
            <button className={`btn ${activeTab === 'casino' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('casino')} style={{ fontSize: '10px', padding: '5px 10px' }}>🎰 CASINO</button>
            <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('settings')} style={{ fontSize: '10px', padding: '5px 10px' }}>⚙️ OPCJE</button>
            {isAdmin && (
                <button className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('admin')} style={{ fontSize: '10px', padding: '5px 10px', borderColor: '#ef4444', color: '#ef4444' }}>🛠️ ADMIN</button>
            )}
        </div>

        {uiMessage.text && (
            <div className={`ui-alert ${uiMessage.type}`} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                {uiMessage.text}
            </div>
        )}

        {activeTab === 'home' && (
            <>
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

                <div className="module-box" style={{ borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                    <div className="module-header">
                        <span className="module-title" style={{ color: '#34d399' }}>GHOST SHIELD</span>
                        <label className="switch">
                            <input type="checkbox" checked={pluginConfig.antiAntiTampering} onChange={(e) => pluginConfig.setAntiAntiTampering(e.target.checked)} />
                            <span className="slider" style={{ backgroundColor: pluginConfig.antiAntiTampering ? '#10b981' : '#334155' }}></span>
                        </label>
                    </div>
                </div>

                <div className="module-box" style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)' }}>
                    <div className="module-header" style={{ cursor: 'pointer' }} onClick={() => setShowGuide(!showGuide)}>
                        <span className="module-title" style={{ fontSize: '10px' }}>📘 PORADNIK & SKRÓTY (v1.0.3)</span>
                        <span style={{ fontSize: '10px' }}>{showGuide ? '▲' : '▼'}</span>
                    </div>
                    {showGuide && (
                        <div style={{ marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4' }}>
                            <p>❄️ <b>Mrożenie:</b> Ikona ❄️ to stop zegara. 🔥 to start.</p>
                            <p>🚀 <b>Reset:</b> "Reset Timer" cofa zegar do pełnej wartości (No-F5).</p>
                            <hr style={{ opacity: 0.1, margin: '6px 0' }} />
                            <p>🔍 <b>SZUKAJ CAŁE ZADANIE:</b></p>
                            <p>🧠 <b>Ctrl + Z:</b> Szukaj całego pytania w Perplexity AI.</p>
                            <p>Możesz też użyć przycisków w HUD na stronie.</p>
                        </div>
                    )}
                </div>
            </>
        )}

        {activeTab === 'casino' && (
            <div className="module-box" style={{ textAlign: 'center' }}>
                <div className="module-header">
                    <span className="module-title" style={{ color: '#fbbf24' }}>🎰 CASINO ROYAL 🎰</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{credits} 💎</span>
                </div>
                <div style={{ fontSize: '40px', margin: '20px 0', letterSpacing: '10px' }}>
                    {slots.join("")}
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSpin}
                    disabled={isSpinning}
                    style={{ background: isSpinning ? '#555' : 'linear-gradient(45deg, #fbbf24, #d97706)' }}
                >
                    {isSpinning ? 'KRĘCĘ...' : 'SPIN (10 💎)'}
                </button>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>Wygraj 500💎 aby odblokować PRO Themes!</p>
            </div>
        )}

        {activeTab === 'settings' && (
            <>
                <div className="glass-card" style={{ padding: '15px' }}>
                    <div className="module-title" style={{ marginBottom: '8px' }}>💎 POLEĆ ZNAJOMEGO (+200)</div>
                    <input
                        type="text"
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value)}
                        style={{ width: '100%', padding: '6px', fontSize: '11px', background: '#334155', border: 'none', borderRadius: '6px', color: 'white', marginBottom: '8px' }}
                        placeholder="Wpisz kod znajomego (jego klucz)..."
                    />
                    <button className="btn btn-primary" onClick={handleRedeemReferral} style={{ fontSize: '10px' }}>ODBIERZ NAGRODĘ</button>
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
                    <button className="btn btn-primary" style={{ background: '#ef4444', fontWeight: 'bold' }} onClick={handleClearTrace}>☢️ AWARYJNY RESET ŚLADÓW</button>
                </div>
                <div className="glass-card" style={{ padding: '15px', marginTop: '10px' }}>
                    <button className="btn btn-outline" style={{ fontSize: '10px', width: '100%' }} onClick={() => {
                        pluginConfig.setShieldKey("");
                        setIsActivated(false);
                        setIsAdmin(false);
                    }}>WYLOGUJ</button>
                </div>
            </>
        )}

        {activeTab === 'admin' && isAdmin && (
            <div className="module-box" style={{ borderColor: '#ef4444' }}>
                <div className="module-header">
                    <span className="module-title" style={{ color: '#ef4444' }}>ADMIN DASHBOARD</span>
                </div>

                {/* ... inside Admin Tab render ... */}
                <div className="glass-card" style={{ marginBottom: '15px', padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                        <select value={genType} onChange={(e) => setGenType(e.target.value as any)} style={{ flex: 1, padding: '4px', background: '#334155', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px' }}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        <select value={genUnit} onChange={(e) => setGenUnit(e.target.value as any)} style={{ flex: 1, padding: '4px', background: '#334155', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px' }}>
                            <option value="HOURS">GODZIN</option>
                            <option value="DAYS">DNI</option>
                            <option value="PERM">NA ZAWSZE</option>
                        </select>
                    </div>
                    {genUnit !== 'PERM' && (
                        <input
                            type="number"
                            value={genDuration}
                            onChange={(e) => setGenDuration(parseInt(e.target.value) || 0)}
                            style={{ width: '100%', padding: '4px', background: '#1e293b', border: '1px solid #475569', color: 'white', borderRadius: '4px', marginBottom: '8px', fontSize: '10px' }}
                            placeholder="Ilość..."
                        />
                    )}
                    <input
                        type="text"
                        value={genNote}
                        onChange={(e) => setGenNote(e.target.value)}
                        style={{ width: '100%', padding: '4px', background: '#1e293b', border: '1px solid #475569', color: 'white', borderRadius: '4px', marginBottom: '8px', fontSize: '10px' }}
                        placeholder="Notatka (opcjonalnie)..."
                    />
                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '10px', padding: '6px' }} onClick={handleCustomGenerate}>
                        ⚡ GENERUJ KLUCZ
                    </button>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '9px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'rgba(255,255,255,0.8)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ textAlign: 'left', padding: '4px' }}>CODE</th>
                                <th style={{ textAlign: 'left', padding: '4px' }}>TYPE</th>
                                <th style={{ textAlign: 'right', padding: '4px' }}>ACT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map(k => (
                                <tr key={k.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '4px' }}>{k.code}</td>
                                    <td style={{ padding: '4px' }}>{k.type} {k.expiresAt ? '(Temp)' : '∞'}</td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        <span style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDeleteKey(k.code)}>🗑️</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        <div className="footer-info">mi1ku Systems 1.0 | @76mikus</div>
    </div>
);
}

export default IndexPopup;
