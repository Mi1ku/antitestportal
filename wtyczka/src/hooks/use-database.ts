import { Storage } from "@plasmohq/storage"
import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get, update, child } from "firebase/database";

const storage = new Storage();

// --- SUPREME ENCRYPTION LAYER ---
const SECRET_SALT = "mi1ku_supreme_76_ultra_safety_999";

const firebaseConfig = {
    apiKey: "AIzaSyDSnKsbPNCCmEKAO1r_PvvVldViGWQ1Sw",
    authDomain: "antitestportaldb.firebaseapp.com",
    projectId: "antitestportaldb",
    storageBucket: "antitestportaldb.firebasestorage.app",
    messagingSenderId: "99856592412",
    appId: "1:99856592412:web:b73e994dceb8d3561e4e3d9",
    measurementId: "G-PDM2VNPEZ9"
};

const app = initializeApp(firebaseConfig);
const fdb = getDatabase(app);

const encodeData = (data: any): string => {
    const json = JSON.stringify(data);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(json);
    const saltBytes = encoder.encode(SECRET_SALT);
    let result = "";
    for (let i = 0; i < bytes.length; i++) {
        const xored = bytes[i] ^ saltBytes[i % saltBytes.length];
        result += String.fromCharCode(xored);
    }
    return btoa(result);
};

const decodeData = (encoded: string): any => {
    try {
        const decoded = atob(encoded);
        const saltBytes = new TextEncoder().encode(SECRET_SALT);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
            bytes[i] = decoded.charCodeAt(i) ^ saltBytes[i % saltBytes.length];
        }
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) { return null; }
};

const getOrCreateHWID = async (): Promise<string> => {
    let hwid = await storage.get("supreme_hwid_v1");
    if (!hwid) {
        const fingerprint = [navigator.userAgent.replace(/\d+/g, ''), screen.height, screen.width, navigator.language].join('|');
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
            hash |= 0;
        }
        hwid = `SUPREME-${Math.abs(hash).toString(16).toUpperCase()}`;
        await storage.set("supreme_hwid_v1", hwid);
    }
    return hwid as string;
};

export interface DbKey {
    id: string;
    key: string;
    role: 'user' | 'admin';
    expiresAt: number | 'never';
    points: number;
    ownerName?: string;
    reflink: string;
    boundHwids?: string[];
}

export interface DatabaseSchema {
    keys: DbKey[];
    version: string;
}

const INITIAL_KEYS: DbKey[] = [
    { id: "1", key: "mikus", role: "admin", expiresAt: "never", points: 9999, ownerName: "Mikuś", reflink: "MIKUS76", boundHwids: [] }
];

export default function useDatabase() {
    const [db, setDb] = useState<DatabaseSchema | null>(null);
    const [hwid, setHwid] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const dbRef = ref(fdb, 'supreme_v1');

        getOrCreateHWID().then(setHwid);

        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDb(data);
            } else {
                // Initialize cloud DB if empty
                set(dbRef, { keys: INITIAL_KEYS, version: "1.5.0" });
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateDb = async (newDb: DatabaseSchema) => {
        await set(ref(fdb, 'supreme_v1'), newDb);
    };

    const addKey = async (key: string, role: 'user' | 'admin' = 'user', days: number | 'never' = 30, ownerName: string = "") => {
        if (!db) return;
        const newKey: DbKey = {
            id: Math.random().toString(36).substr(2, 9),
            key,
            role,
            expiresAt: days === 'never' ? 'never' : Date.now() + days * 24 * 60 * 60 * 1000,
            points: 0,
            ownerName,
            reflink: key.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 999),
            boundHwids: []
        };
        await updateDb({ ...db, keys: [...db.keys, newKey] });
    };

    const updateKey = async (id: string, updates: Partial<DbKey>) => {
        if (!db) return;
        const nextKeys = db.keys.map(k => k.id === id ? { ...k, ...updates } : k);
        await updateDb({ ...db, keys: nextKeys });
    };

    const deleteKey = async (id: string) => {
        if (!db) return;
        const nextKeys = db.keys.filter(k => k.id !== id);
        await updateDb({ ...db, keys: nextKeys });
    };

    const validateKey = async (key: string, referralCode?: string): Promise<{ success: boolean; user?: DbKey; error?: string }> => {
        if (!db) return { success: false, error: "DB NOT READY" };
        const found = db.keys.find(k => k.key === key);
        if (!found) return { success: false, error: "BŁĘDNY KLUCZ" };

        if (found.expiresAt !== 'never' && found.expiresAt < Date.now()) {
            return { success: false, error: "KLUCZ WYGASŁ" };
        }

        const myHwid = await getOrCreateHWID();
        const isBound = found.boundHwids?.includes(myHwid);
        const canBind = !found.boundHwids || found.boundHwids.length === 0;

        if (!isBound && !canBind) return { success: false, error: "LICENCJA PRZYPISANA DO INNEGO PC" };

        if (canBind) {
            let pts = found.points || 0;
            let nextKeys = [...db.keys];
            if (referralCode) {
                const refIdx = nextKeys.findIndex(k => k.reflink.toLowerCase() === referralCode.toLowerCase().trim());
                if (refIdx !== -1 && nextKeys[refIdx].id !== found.id) {
                    pts += 25;
                    nextKeys[refIdx].points += 50;
                }
            }
            const updatedUser = { ...found, boundHwids: [myHwid], points: pts };
            const finalKeys = nextKeys.map(k => k.id === found.id ? updatedUser : k);
            await updateDb({ ...db, keys: finalKeys });
            return { success: true, user: updatedUser };
        }

        return { success: true, user: found };
    };

    const addPoints = async (id: string, amount: number) => {
        if (!db) return;
        const nextKeys = db.keys.map(k => k.id === id ? { ...k, points: (k.points || 0) + amount } : k);
        await updateDb({ ...db, keys: nextKeys });
    };

    const getRemainingTime = (exp: number | 'never'): string => {
        if (exp === 'never') return "NIESKOŃCZONOŚĆ";
        const diff = exp - Date.now();
        if (diff <= 0) return "WYGASŁO";
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        return d > 0 ? `${d}d ${h}h` : `${h}h`;
    };

    const clearSession = async () => {
        if (typeof chrome !== 'undefined' && chrome.browsingData) {
            await chrome.browsingData.remove({
                origins: ["https://www.testportal.pl", "https://www.testportal.net", "https://www.testportal.online"]
            }, { "cookies": true, "localStorage": true, "cache": true });
        }
    };

    return { db, hwid, isLoading, addKey, updateKey, deleteKey, addPoints, validateKey, getRemainingTime, clearSession };
}
