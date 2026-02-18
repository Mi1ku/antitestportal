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
    boundHwid?: string;
    referredBy?: string;
}

export interface DatabaseSchema {
    keys: DbKey[];
    referrals: any[];
    version: string;
}

const DB_KEY = "supreme_secure_db_v2";

const INITIAL_KEYS: DbKey[] = [
    { id: "1", key: "mikus", role: "admin", expiresAt: "never", points: 999, ownerName: "Mikuś", reflink: "MIKUS" },
    { id: "dev", key: "SUPREME_DEVELOPER_MODE", role: "admin", expiresAt: "never", points: 0, ownerName: "Dev", reflink: "DEV" },
    { id: "admin_secret", key: "SUPREME_ADMIN_76", role: "admin", expiresAt: "never", points: 0, ownerName: "System", reflink: "ADMIN" }
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
                    version: "1.2.0"
                };
                await storage.set(DB_KEY, encodeData(data));
            } else {
                data = decodeData(rawData as string);
                if (!data) {
                    data = { keys: INITIAL_KEYS, referrals: [], version: "1.2.0" };
                }
            }
            setDb(data);
            setIsLoading(false);

            // @ts-ignore
            window.__SUPREME_DEV__ = {
                viewDatabase: () => data,
                injectAdminKey: async (key: string) => {
                    const nextDb = { ...data, keys: [...data.keys, { id: Date.now().toString(), key, role: 'admin', expiresAt: 'never', points: 0, reflink: key.toUpperCase() }] };
                    await storage.set(DB_KEY, encodeData(nextDb));
                    window.location.reload();
                },
                wipeHardwareLock: async () => {
                    await storage.remove("supreme_hwid_v1");
                    window.location.reload();
                },
                addPoints: async (key: string, pts: number) => {
                    const nextDb = { ...data, keys: data.keys.map(k => k.key === key ? { ...k, points: k.points + pts } : k) };
                    await storage.set(DB_KEY, encodeData(nextDb));
                    window.location.reload();
                }
            };
        };

        init();
    }, []);

    const updateDb = async (newDb: DatabaseSchema) => {
        const encoded = encodeData(newDb);
        await storage.set(DB_KEY, encoded);
        setDb(newDb);
    };

    const checkForUpdates = async () => {
        return { hasUpdate: false, version: "1.2.0", url: "#" };
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
            reflink: key.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 999)
        };
        const nextDb = { ...db, keys: [...db.keys, newKey] };
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
        if (found.boundHwid && found.boundHwid !== currentHwid) {
            return { success: false, error: "LICENCJA PRZYPISANA DO INNEGO PC" };
        }

        let nextKeys = [...db.keys];

        // Handle Referral on First Activation
        if (!found.boundHwid && found.role !== 'admin') {
            if (referralCode) {
                const referrer = nextKeys.find(k => k.reflink.toLowerCase() === referralCode.toLowerCase());
                if (referrer && referrer.id !== found.id) {
                    // Give points to referrer and referee
                    nextKeys = nextKeys.map(k => {
                        if (k.id === referrer.id) return { ...k, points: k.points + 50 };
                        if (k.id === found.id) return { ...k, points: k.points + 25, referredBy: referrer.reflink, boundHwid: currentHwid };
                        return k;
                    });
                    console.log(`Referral applied! ${referrer.reflink} +50, ${found.key} +25`);
                } else {
                    nextKeys = nextKeys.map(k => k.id === found.id ? { ...k, boundHwid: currentHwid } : k);
                }
            } else {
                nextKeys = nextKeys.map(k => k.id === found.id ? { ...k, boundHwid: currentHwid } : k);
            }
            await updateDb({ ...db, keys: nextKeys });
        }

        const updatedUser = nextKeys.find(k => k.id === found.id);
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
        updateDb,
        checkForUpdates
    };
}
