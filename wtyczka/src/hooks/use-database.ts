import { Storage } from "@plasmohq/storage"
import { useState, useEffect } from "react"

const storage = new Storage();

// --- SUPREME ENCRYPTION LAYER ---
// This is a professional-grade (for browser) obfuscation layer
const SECRET_SALT = "mi1ku_supreme_76_ultra_safety_999";

const encodeData = (data: any): string => {
    const json = JSON.stringify(data);
    let result = "";
    for (let i = 0; i < json.length; i++) {
        result += String.fromCharCode(json.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length));
    }
    return btoa(result);
};

const decodeData = (encoded: string): any => {
    try {
        const decoded = atob(encoded);
        let result = "";
        for (let i = 0; i < decoded.length; i++) {
            result += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length));
        }
        return JSON.parse(result);
    } catch (e) {
        console.error("Database Decryption Failed! Data might be corrupted or tampered with.");
        return null;
    }
};

// --- HWID GENERATOR ---
const getOrCreateHWID = async (): Promise<string> => {
    let hwid = await storage.get("supreme_hwid_v1");
    if (!hwid) {
        // Generate a pseudo-HWID based on browser/screen features + random
        const fingerprint = [
            navigator.userAgent,
            screen.height,
            screen.width,
            navigator.language,
            new Date().getTimezoneOffset(),
            Math.random().toString(36).substring(7)
        ].join('|');

        // Simple hash function
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        hwid = `SUPREME-${Math.abs(hash).toString(16)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
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
    reflink?: string;
    boundHwid?: string; // HWID Lockdown
}

export interface DatabaseSchema {
    keys: DbKey[];
    referrals: any[];
    version: number;
}

const DB_KEY = "supreme_secure_db_v2"; // Renamed for fresh start

const INITIAL_KEYS: DbKey[] = [
    { id: "1", key: "mikus", role: "admin", expiresAt: "never", points: 999, ownerName: "Mikuś" },
    { id: "admin_secret", key: "SUPREME_ADMIN_76", role: "admin", expiresAt: "never", points: 0, ownerName: "System" }
];

export default function useDatabase() {
    const [db, setDb] = useState<DatabaseSchema | null>(null);
    const [hwid, setHwid] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const myHwid = await getOrCreateHWID();
            setHwid(myHwid);

            let rawData = await storage.get(DB_KEY);
            let data: DatabaseSchema;

            if (!rawData) {
                data = {
                    keys: INITIAL_KEYS,
                    referrals: [],
                    version: 1
                };
                await storage.set(DB_KEY, encodeData(data));
            } else {
                data = decodeData(rawData as string);
                if (!data) {
                    // Fallback if decode fails (e.g. key changed or theft attempt)
                    data = { keys: [], referrals: [], version: 1 };
                }
            }
            setDb(data);
            setIsLoading(false);
        };

        init();
    }, []);

    const updateDb = async (newDb: DatabaseSchema) => {
        const encoded = encodeData(newDb);
        await storage.set(DB_KEY, encoded);
        setDb(newDb);
    };

    const addKey = async (key: string, role: 'user' | 'admin', days: number | 'never', owner: string = "") => {
        if (!db) return;
        const newKey: DbKey = {
            id: Math.random().toString(36).substr(2, 9),
            key,
            role,
            expiresAt: days === 'never' ? 'never' : Date.now() + days * 24 * 60 * 60 * 1000,
            points: 0,
            ownerName: owner,
            reflink: `ref_${Math.random().toString(36).substr(2, 6)}`
        };
        const nextDb = { ...db, keys: [...db.keys, newKey] };
        await updateDb(nextDb);
    };

    const validateKey = async (key: string): Promise<{ success: boolean; user?: DbKey; error?: string }> => {
        if (!db) return { success: false, error: "DB NOT READY" };

        const found = db.keys.find(k => k.key === key);
        if (!found) return { success: false, error: "BŁĘDNY KLUCZ" };

        if (found.expiresAt !== 'never' && found.expiresAt < Date.now()) {
            return { success: false, error: "KLUCZ WYGASŁ" };
        }

        // --- HWID LOCKDOWN LOGIC ---
        const currentHwid = await getOrCreateHWID();
        if (found.boundHwid && found.boundHwid !== currentHwid) {
            return { success: false, error: "LICENCJA PRZYPISANA DO INNEGO PC" };
        }

        // Auto-bind on first use
        if (!found.boundHwid && found.role !== 'admin') {
            const updatedKeys = db.keys.map(k => k.id === found.id ? { ...k, boundHwid: currentHwid } : k);
            await updateDb({ ...db, keys: updatedKeys });
            found.boundHwid = currentHwid;
        }

        return { success: true, user: found };
    };

    const deleteKey = async (id: string) => {
        if (!db) return;
        const nextDb = { ...db, keys: db.keys.filter(k => k.id !== id) };
        await updateDb(nextDb);
    };

    const addPoints = async (id: string, amount: number) => {
        if (!db) return;
        const nextDb = {
            ...db,
            keys: db.keys.map(k => k.id === id ? { ...k, points: k.points + amount } : k)
        };
        await updateDb(nextDb);
    };

    return {
        db,
        hwid,
        isLoading,
        addKey,
        deleteKey,
        addPoints,
        validateKey,
        updateDb
    };
}
