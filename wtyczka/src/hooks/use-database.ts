import { Storage } from "@plasmohq/storage"
import { useState, useEffect } from "react"

const storage = new Storage();

// --- SUPREME ENCRYPTION LAYER ---
const SECRET_SALT = "mi1ku_supreme_76_ultra_safety_999";

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

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(bytes));
    } catch (e) {
        console.error("Database Decryption Failed!", e);
        return null;
    }
};

// --- HWID GENERATOR ---
const getOrCreateHWID = async (): Promise<string> => {
    let hwid = await storage.get("supreme_hwid_v1");
    const fingerprint = [
        navigator.userAgent.replace(/\d+/g, ''),
        screen.height,
        screen.width,
        navigator.language,
        navigator.hardwareConcurrency || 4
    ].join('|');

    if (!hwid) {
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
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
    boundHwids?: string[]; // Multiple HWIDs support
    referredBy?: string;
}

export interface DatabaseSchema {
    keys: DbKey[];
    referrals: any[];
    version: string;
}

const DB_KEY = "supreme_secure_db_v4";

const INITIAL_KEYS: DbKey[] = [
    { id: "1", key: "mikus", role: "admin", expiresAt: "never", points: 9999, ownerName: "Mikuś", reflink: "MIKUS76", boundHwids: [] },
    { id: "dev", key: "SUPREME_DEVELOPER_MODE", role: "admin", expiresAt: "never", points: 0, ownerName: "Dev", reflink: "DEV76", boundHwids: [] },
    { id: "admin_secret", key: "SUPREME_ADMIN_76", role: "admin", expiresAt: "never", points: 0, ownerName: "System", reflink: "SUP76", boundHwids: [] }
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
                // Migration from v2 if exists
                const oldRaw = await storage.get("supreme_secure_db_v2");
                if (oldRaw) {
                    const oldData = decodeData(oldRaw as string);
                    data = {
                        ...oldData,
                        keys: oldData.keys.map((k: any) => ({
                            ...k,
                            boundHwids: k.boundHwid ? [k.boundHwid] : []
                        })),
                        version: "1.3.0"
                    };
                } else {
                    data = {
                        keys: INITIAL_KEYS,
                        referrals: [],
                        version: "1.3.0"
                    };
                }
                await storage.set(DB_KEY, encodeData(data));
            } else {
                data = decodeData(rawData as string);
                if (!data) {
                    data = { keys: INITIAL_KEYS, referrals: [], version: "1.3.0" };
                }
            }
            setDb(data);
            setIsLoading(false);
        };

        const interval = setInterval(async () => {
            let rawData = await storage.get(DB_KEY);
            if (rawData) {
                const data = decodeData(rawData as string);
                if (data) setDb(data);
            }
        }, 2000);

        init();
        return () => clearInterval(interval);
    }, []);

    const updateDb = async (newDb: DatabaseSchema) => {
        const encoded = encodeData(newDb);
        await storage.set(DB_KEY, encoded);
        setDb(newDb);
    };

    const checkForUpdates = async () => {
        try {
            return {
                hasUpdate: false,
                version: "1.3.0",
                url: "https://github.com/mikus/antitestportal/releases/latest"
            };
        } catch (e) {
            return { hasUpdate: false };
        }
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
            reflink: key.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 999),
            boundHwids: []
        };
        const nextDb = { ...db, keys: [...db.keys, newKey] };
        await updateDb(nextDb);
    };

    const updateKey = async (id: string, updates: Partial<DbKey>) => {
        if (!db) return;
        const nextDb = {
            ...db,
            keys: db.keys.map(k => k.id === id ? { ...k, ...updates } : k)
        };
        await updateDb(nextDb);
    };

    const validateKey = async (key: string, referralCode?: string): Promise<{ success: boolean; user?: DbKey; error?: string }> => {
        if (!db) return { success: false, error: "DB NOT READY" };

        const found = db.keys.find(k => k.key === key);
        if (!found) return { success: false, error: "BŁĘDNY KLUCZ" };

        if (found.expiresAt !== 'never' && found.expiresAt < Date.now()) {
            return { success: false, error: "KLUCZ WYGASŁ" };
        }

        const currentHwid = await getOrCreateHWID();
        const hasHwid = found.boundHwids && found.boundHwids.includes(currentHwid);
        const canBind = !found.boundHwids || found.boundHwids.length === 0;

        if (!hasHwid && !canBind) {
            return { success: false, error: "LICENCJA PRZYPISANA DO INNEGO PC" };
        }

        let nextKeys = [...db.keys];
        let userWasUpdated = false;

        // Auto-binding and Referral logic on FIRST activation
        if (canBind) {
            userWasUpdated = true;
            let updatedPoints = found.points || 0;

            if (referralCode) {
                const referrer = nextKeys.find(k => k.reflink.toLowerCase() === referralCode.toLowerCase().trim());
                if (referrer && referrer.id !== found.id) {
                    updatedPoints += 25;
                    nextKeys = nextKeys.map(k => {
                        if (k.id === referrer.id) return { ...k, points: (k.points || 0) + 50 };
                        return k;
                    });
                }
            }

            nextKeys = nextKeys.map(k => {
                if (k.id === found.id) return { ...k, boundHwids: [currentHwid], points: updatedPoints };
                return k;
            });
        }

        if (userWasUpdated) {
            await updateDb({ ...db, keys: nextKeys });
        }

        const updatedUser = userWasUpdated ? nextKeys.find(k => k.id === found.id) : found;
        return { success: true, user: updatedUser };
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
            keys: db.keys.map(k => k.id === id ? { ...k, points: (k.points || 0) + amount } : k)
        };
        await updateDb(nextDb);
    };

    const getRemainingTime = (expiresAt: string): string => {
        if (expiresAt === "never") return "NIESKOŃCZONOŚĆ";
        const now = new Date();
        const exp = new Date(expiresAt);
        const diff = exp.getTime() - now.getTime();

        if (diff <= 0) return "WYGASŁO";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    const clearSession = async () => {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.browsingData) {
                chrome.browsingData.remove({
                    origins: [
                        "https://www.testportal.pl",
                        "https://www.testportal.net",
                        "https://www.testportal.online"
                    ]
                }, {
                    "cookies": true,
                    "localStorage": true,
                    "cache": true
                }, () => resolve(true));
            } else {
                resolve(false);
            }
        });
    };

    return {
        db,
        hwid,
        isLoading,
        addKey,
        updateKey,
        deleteKey,
        addPoints,
        validateKey,
        updateDb,
        checkForUpdates,
        getRemainingTime,
        clearSession
    };
}
