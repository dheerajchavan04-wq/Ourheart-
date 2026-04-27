// 📁 FILE: supabase/functions/adminTools/validate.ts
// 📏 LINES: 1-52
// 🎯 PURPOSE: Admin role validation middleware for Edge Functions
// 🔒 SECURITY: JWT verification via Supabase auth, explicit role checking, prevents privilege escalation
// ⚠️ SAFETY: Try/catch, graceful fallback on token expiry, strict boolean return, no side effects
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'; // Line 8 → SDK

const ADMIN_ROLE_IDS = ['your_admin_uuid_1', 'your_admin_uuid_2']; // Line 10 → Explicit allowlist (replace in prod)

export const validateAdmin = async (token: string): Promise<boolean> => { // Line 12 → Validation function
  try { // Line 13 → Try
    const supabase = createClient( // Line 14 → Client init
      Deno.env.get('SUPABASE_URL') || '', // Line 15 → URL
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '' // Line 16 → Admin key
    ); // Line 17 → Closes
    const { data, error } = await supabase.auth.getUser(token); // Line 18 → Verify JWT
    if (error || !data?.user) return false; // Line 19 → Invalid/expired
    const userId = data.user.id; // Line 20 → Extract ID
    if (ADMIN_ROLE_IDS.includes(userId)) return true; // Line 21 → Direct match
    const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', userId).single(); // Line 22 → DB role check
    return profile?.role === 'admin'; // Line 23 → Compare
  } catch { // Line 24 → Catch
    return false; // Line 25 → Secure default
  } // Line 26 → Closes
}; // Line 27 → Closes

// 🔑 API KEY LOCATION: Supabase Secrets (Service Role only)
// 🗄️ DATABASE CONFIG: `user_profiles.role` column (text, enum or varchar)
// 🔄 HOW TO CHANGE: Update `ADMIN_ROLE_IDS` array or modify SQL enum check
// 🛡️ WHY SECURE: JWT verified server-side. Role check is explicit. No client trust. Fails closed.
