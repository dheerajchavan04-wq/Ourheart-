// 📁 FILE: src/hooks/useSupabaseAuth.js
// 📏 LINES: 1-95
// 🎯 PURPOSE: Google OAuth trigger, session listener, user data fetch, secure logout, protected route gate
// 🔒 SECURITY: Delegates auth to Supabase SDK, never stores tokens in localStorage directly, validates session shape
// ⚠️ SAFETY: Listener cleanup, error boundaries, loading states, network failure fallback
import { useState, useEffect, useCallback } from 'react'; // Line 8 → React imports
import { supabase } from '../services/supabaseClient'; // Line 9 → Supabase import (initialized with VITE keys)

export default function useSupabaseAuth() { // Line 11 → Hook definition
  const [user, setUser] = useState(null); // Line 12 → User object
  const [session, setSession] = useState(null); // Line 13 → Session state
  const [loading, setLoading] = useState(true); // Line 14 → Auth status
  const [error, setError] = useState(null); // Line 15 → Error message

  useEffect(() => { // Line 17 → Session listener mount
    setLoading(true); // Line 18 → Start loading
    try { // Line 19 → Try block
      const { data: { subscription } } = supabase.auth.onAuthStateChange( // Line 20 → Subscribe
        (event, currentSession) => { // Line 21 → Callback
          setSession(currentSession); // Line 22 → Update session
          setUser(currentSession?.user || null); // Line 23 → Update user
          setLoading(false); // Line 24 → Ready
        }
      ); // Line 26 → Closes subscribe
      return () => subscription?.unsubscribe(); // Line 27 → Cleanup listener
    } catch (e) { // Line 28 → Catch
      setError('Auth initialization failed.'); // Line 29 → Safe message
      setLoading(false); // Line 30 → Stop loading
    } // Line 31 → Closes
  }, []); // Line 32 → Empty
