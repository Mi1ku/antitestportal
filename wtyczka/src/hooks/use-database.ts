import { Storage } from "@plasmohq/storage"
import { useState, useEffect } from "react"
import { supabase } from "~lib/supabase"
import { DEV_CONFIG } from "~config";

const storage = new Storage();

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
    maxHwids?: number;
}

export interface DatabaseSchema {
    keys: DbKey[];
    bannedHwids?: string[];
    version: string;
}

export default function useDatabase() {
    const [db, setDb] = useState<DatabaseSchema | null>(null);
    const [hwid, setHwid] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Fetch keys (licenses)
            const { data: keysData, error: keysError } = await supabase.from('antitest_licenses').select('*');
            if (keysError) throw keysError;

            // Fetch bans
            const { data: bansData, error: bansError } = await supabase.from('antitest_bans').select('hwid');
            if (bansError) throw bansError;

            const mappedKeys: DbKey[] = (keysData || []).map(k => ({
                id: k.id,
                key: k.key,
                role: k.role,
                expiresAt: k.expires_at === 'never' ? 'never' : new Date(k.expires_at).getTime(),
                points: k.points,
                ownerName: k.owner_name,
                reflink: k.reflink,
                boundHwids: k.bound_hwids || [],
                maxHwids: k.max_hwids || 3
            }));

            // Handle Empty Keys -> Initial Seed (Admin)
            if (mappedKeys.length === 0) {
                console.log("[Supreme DB] No keys found. Initializing Admin...");
                const adminKey = {
                    key: "mikus",
                    role: "admin",
                    expires_at: 'never',
                    points: 9999,
                    owner_name: "mi1ku (Root)",
                    reflink: "MIKUS100",
                    bound_hwids: [],
                    max_hwids: 100
                };
                await supabase.from('antitest_licenses').insert(adminKey);
                return fetchData(); // Refresh
            }

            setDb({
                version: DEV_CONFIG.VERSION,
                keys: mappedKeys,
                bannedHwids: (bansData || []).map(b => b.hwid)
            });

            console.log("[Supreme DB] Supabase Sync Success.");
        } catch (err) {
            console.error("[Supreme DB] Supabase Sync Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getOrCreateHWID().then(hw => setHwid(hw));
        fetchData();

        // Realtime Subscription
        const channel = supabase.channel('antitest_db_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'antitest_licenses' }, fetchData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'antitest_bans' }, fetchData)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const addKey = async (key: string, role: 'user' | 'admin' = 'user', days: number | 'never' = 30, ownerName: string = "") => {
        const expires_at = days === 'never' ? 'never' : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        const reflink = key.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 999);
        
        await supabase.from('antitest_licenses').insert({
            key, role, expires_at, reflink, owner_name: ownerName,
            points: 0, bound_hwids: [], max_hwids: 3
        });
        await fetchData();
    };

    const updateKey = async (id: string, updates: Partial<DbKey>) => {
        const mappedUpdates: any = {};
        if (updates.key) mappedUpdates.key = updates.key;
        if (updates.role) mappedUpdates.role = updates.role;
        if (updates.points !== undefined) mappedUpdates.points = updates.points;
        if (updates.ownerName) mappedUpdates.owner_name = updates.ownerName;
        if (updates.reflink) mappedUpdates.reflink = updates.reflink;
        if (updates.boundHwids) mappedUpdates.bound_hwids = updates.boundHwids;
        if (updates.maxHwids !== undefined) mappedUpdates.max_hwids = updates.maxHwids;
        if (updates.expiresAt !== undefined) {
             mappedUpdates.expires_at = updates.expiresAt === 'never' ? 'never' : new Date(updates.expiresAt).toISOString();
        }

        await supabase.from('antitest_licenses').update(mappedUpdates).eq('id', id);
        await fetchData();
    };

    const deleteKey = async (id: string) => {
        await supabase.from('antitest_licenses').delete().eq('id', id);
        await fetchData();
    };

    const validateKey = async (key: string, referralCode?: string): Promise<{ success: boolean; user?: DbKey; error?: string }> => {
        if (!db) return { success: false, error: "BŁĄD POŁĄCZENIA" };

        const myHwid = await getOrCreateHWID();
        if (db.bannedHwids?.includes(myHwid)) return { success: false, error: "SPRZĘT ZABANOWANY" };

        const found = db.keys.find(k => k.key === key);
        if (!found) return { success: false, error: "NIEPRAWIDŁOWY KLUCZ" };

        if (found.expiresAt !== 'never' && found.expiresAt < Date.now()) {
            return { success: false, error: "LICENCJA WYGASŁA" };
        }

        const isBound = found.boundHwids?.includes(myHwid);
        const boundCount = found.boundHwids?.length || 0;
        const limit = found.maxHwids || 3;

        if (!isBound && boundCount >= limit) {
             return { success: false, error: `LIMIT URZĄDZEŃ (${limit}) PRZEKROCZONY` };
        }

        if (!isBound) {
            let pts = found.points || 0;
            const nextBoundHwids = [...(found.boundHwids || []), myHwid];
            
            if (referralCode) {
                const refKey = db.keys.find(k => k.reflink.toLowerCase() === referralCode.toLowerCase().trim());
                if (refKey && refKey.id !== found.id) {
                    pts += 25;
                    await supabase.from('antitest_licenses').update({ points: refKey.points + 50 }).eq('id', refKey.id);
                }
            }
            
            await supabase.from('antitest_licenses').update({ 
                bound_hwids: nextBoundHwids, 
                points: pts 
            }).eq('id', found.id);
            
            const updatedUser = { ...found, bound_hwids: nextBoundHwids, points: pts };
            return { success: true, user: updatedUser };
        }

        return { success: true, user: found };
    };

    const addPoints = async (id: string, amount: number) => {
        const found = db?.keys.find(k => k.id === id);
        if (!found) return;
        await supabase.from('antitest_licenses').update({ points: (found.points || 0) + amount }).eq('id', id);
        await fetchData();
    };

    const getRemainingTime = (exp: number | 'never'): string => {
        if (exp === 'never') return "∞";
        const diff = exp - Date.now();
        if (diff <= 0) return "WYGASŁO";
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        return d > 0 ? `${d} dni ${h}h` : `${h}h`;
    };

    const clearSession = async () => {
        if (typeof chrome !== 'undefined' && chrome.browsingData) {
            await chrome.browsingData.remove({
                origins: ["https://www.testportal.pl", "https://www.testportal.net", "https://www.testportal.online", "https://www.testportal.com"]
            }, { "cookies": true, "localStorage": true, "cache": true });
            if (chrome.tabs) {
                const tabs = await chrome.tabs.query({ url: "*://*.testportal.*/*" });
                for (const tab of tabs) if (tab.id) chrome.tabs.reload(tab.id);
            }
        }
    };

    const toggleBan = async (hwidToBan: string) => {
        const isBanned = db?.bannedHwids?.includes(hwidToBan);
        if (isBanned) {
            await supabase.from('antitest_bans').delete().eq('hwid', hwidToBan);
        } else {
            await supabase.from('antitest_bans').insert({ hwid: hwidToBan });
        }
        await fetchData();
    };

    return { db, hwid, isLoading, addKey, updateKey, deleteKey, addPoints, validateKey, getRemainingTime, clearSession, toggleBan };
}
