import { createClient } from "@supabase/supabase-js";
import { DEV_CONFIG } from "~config";

// SUPABASE CLIENT (v1.0)
export const supabase = createClient(DEV_CONFIG.SUPABASE_URL, DEV_CONFIG.SUPABASE_KEY, {
    auth: { 
        persistSession: false,
        detectSessionInUrl: false 
    }
});
