import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonkey = process.env.NEXT_PUBLIC_SUPABASE_ANON as string;
const adminkey = process.env.NEXT_PUBLIC_SUPABASE_ADMIN as string;
if (!url || !anonkey || !adminkey) {
  throw new Error("Bloody TypeScript!");
}
const supabase = createClient(url, anonkey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
export const supabase_admin = createClient(url, adminkey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
