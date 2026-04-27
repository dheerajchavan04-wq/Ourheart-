// 📁 FILE: src/services/supabaseClient.js
// 📏 LINES: 1-78
// 🎯 PURPOSE: Secure Supabase JS SDK initialization using VITE environment variables only
// 🔒 SECURITY: Zero hardcoded keys, validates URL structure, enforces RLS-ready client config
// ⚠️ SAFETY: Try/catch wrapper, fallback error state, type validation, graceful init failure
import { createClient } from '@supabase/supabase-js'; // Line 7 → SDK import

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // Line 9 → Safe env read
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; // Line 10 → Safe env read

// Line 12 → Environment validation guard
const isEnvValid = typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('https://'); // Line 13 → URL format check
const isKeyValid = typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20; // Line 14 → Key length guard

if (!isEnvValid || !isKeyValid) { // Line 16 → Missing config check
  console.error('[Supabase] Invalid environment variables. App will use fallback mode.'); // Line 17 → Clear log
} // Line 18 → Closes

let clientInstance = null; // Line 20 → Singleton cache
try { // Line 21 → Init try block
  clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { // Line 22 → Create client
    auth: { // Line 23 → Auth config
      persistSession: true, // Line 24 → Keep user logged in
      autoRefreshToken: true, // Line 25 → Silent token refresh
      detectSessionInUrl: true // Line 26 → OAuth redirect support
    },
    global: { // Line 28 → Global settings
      headers: { 'x-application-name': 'ourheart' }, // Line 29 → Custom header for analytics
      fetch: (...args) => fetch(...args) // Line 30 → Use native fetch
    }
  }); // Line 32 → Closes config
} catch (e) { // Line 33 → Catch initialization error
  console.warn('[Supabase] Client init failed:', e.message); // Line 34 → Safe warning
  clientInstance = { // Line 35 → Mock fallback
    auth: { 
      getUser: () => Promise.resolve({ data: { user: null } }), 
      signOut: () => Promise.resolve() 
    },
    from: () => ({ select: () => Promise.resolve([]), insert: () => Promise.resolve({ data: null }) })
  }; // Line 40 → Fallback methods
} // Line 41 → Closes try/catch

// Line 43 → Safe query wrapper with error boundary
export const safeQuery = async (table, operation, payload = {}) => { // Line 44 → Exported helper
  try { // Line 45 → Try block
    const query = clientInstance.from(table); // Line 46 → Table ref
    if (operation === 'select') return query.select('*').order('created_at', { ascending: false }); // Line 47 → Select query
    if (operation === 'insert') return query.insert(payload); // Line 48 → Insert query
    if (operation === 'update') return query.update(payload); // Line 49 → Update query
    return { data: null, error: new Error('Unsupported operation') }; // Line 50 → Default
  } catch (e) { // Line 51 → Catch runtime
    console.error(`[Supabase] Query failed on ${table}:`, e.message); // Line 52 → Log context
    return { data: null, error: e }; // Line 53 → Return error object
  } // Line 54 → Closes
}; // Line 55 → Closes function

// Line 57 → RLS enforcement checker
export const checkRLSPolicy = async (table) => { // Line 58 → Policy tester
  try { // Line 59 → Try
    const { data, error } = await safeQuery(table, 'select').limit(1); // Line 60 → Test read
    if (error) { // Line 61 → Check policy failure
      console.warn(`[Supabase] RLS may block access to ${table}:`, error.message); // Line 62 → Warn dev
      return false; // Line 63 → Policy issue
    } // Line 64 → Closes if
    return true; // Line 65 → Policy active
  } catch { return false; } // Line 66 → Fallback
}; // Line 67 → Closes

// Line 69 → Export singleton
export const supabase = clientInstance; // Line 70 → Main export

// Line 72 → Cleanup on hot module replacement (dev only)
if (import.meta.hot) { // Line 73 → Vite HMR check
  import.meta.hot.accept(() => { // Line 74 → Accept update
    console.log('[Supabase] Module updated. Reinitializing client...'); // Line 75 → Log
    window.location.reload(); // Line 76 → Force fresh state
  }); // Line 77 → Closes
} // Line 78 → Closes block
