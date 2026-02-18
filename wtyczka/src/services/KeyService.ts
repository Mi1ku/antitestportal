import { Storage } from "@plasmohq/storage"

export interface LicenseKey {
    code: string;
    type: 'ADMIN' | 'USER';
    expiresAt: number | null; // Timestamp or null for lifetime
    createdAt: number;
    createdBy: string;
    note?: string;
}

const STORAGE_KEY = "ultra_license_db";
const storage = new Storage({
    area: "local"
});

export class KeyService {

    static async initDatabase() {
        const db = await storage.get<LicenseKey[]>(STORAGE_KEY) || [];
        // Ensure default ADMIN key exists if DB is empty
        if (db.length === 0) {
            const adminKey: LicenseKey = {
                code: "admin",
                type: 'ADMIN',
                expiresAt: null,
                createdAt: Date.now(),
                createdBy: "SYSTEM",
                note: "Default System Admin"
            };
            await storage.set(STORAGE_KEY, [adminKey]);
            console.log("[KeyService] Initialized DB with default admin key.");
        }
    }

    static async getAllKeys(): Promise<LicenseKey[]> {
        return await storage.get<LicenseKey[]>(STORAGE_KEY) || [];
    }

    static async getKey(code: string): Promise<LicenseKey | null> {
        const keys = await this.getAllKeys();
        return keys.find(k => k.code === code) || null;
    }

    static async validateKey(code: string): Promise<{ valid: boolean, type?: 'ADMIN' | 'USER', reason?: string }> {
        // Special dev keys
        if (code === "mikus" || code === "zsa") return { valid: true, type: 'USER' };

        const key = await this.getKey(code);
        if (!key) return { valid: false, reason: "Key not found" };

        if (key.expiresAt && Date.now() > key.expiresAt) {
            return { valid: false, reason: "Key expired" };
        }

        return { valid: true, type: key.type };
    }

    static async createKey(type: 'ADMIN' | 'USER', durationHours: number | null, note: string = ""): Promise<LicenseKey> {
        const keys = await this.getAllKeys();

        const newKey: LicenseKey = {
            code: this.generateRandomCode(type === 'ADMIN' ? 'ADM-' : 'KEY-'),
            type,
            expiresAt: durationHours ? Date.now() + (durationHours * 60 * 60 * 1000) : null,
            createdAt: Date.now(),
            createdBy: "ADMIN",
            note
        };

        keys.push(newKey);
        await storage.set(STORAGE_KEY, keys);
        return newKey;
    }

    static async deleteKey(code: string): Promise<void> {
        let keys = await this.getAllKeys();
        keys = keys.filter(k => k.code !== code);
        await storage.set(STORAGE_KEY, keys);
    }

    private static generateRandomCode(prefix: string): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 12; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
            if ((i + 1) % 4 === 0 && i !== 11) result += "-";
        }
        return prefix + result;
    }
}
