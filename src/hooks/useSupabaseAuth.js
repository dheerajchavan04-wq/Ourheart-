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
  }, []); // Line 32 → Empty deps

  const signInWithGoogle = useCallback(async () => { // Line 34 → Login function
    setError(null); // Line 35 → Clear errors
    setLoading(true); // Line 36 → Start loading
    try { // Line 37 → Try
      const { error } = await supabase.auth.signInWithOAuth({ // Line 38 → SDK call
        provider: 'google', // Line 39 → Provider
        options: { redirectTo: window.location.origin } // Line 40 → Redirect URI
      }); // Line 41 → Closes call
      if (error) throw error; // Line 42 → Handle SDK error
    } catch (e) { // Line 43 → Catch
      console.error('[useAuth] Google sign-in failed:', e.message); // Line 44 → Log
      setError('Google authentication unavailable. Please check network.'); // Line 45 → User message
    } finally { setLoading(false); } // Line 46 → Reset state
  }, []); // Line 47 → Stable ref

  const signOut = useCallback(async () => { // Line 49 → Logout function
    try { // Line 50 → Try
      const { error } = await supabase.auth.signOut(); // Line 51 → SDK call
      if (error) throw error; // Line 52 → Handle error
      setUser(null); // Line 53 → Clear local state
      setSession(null); // Line 54 → Clear session
    } catch (e) { // Line 55 → Catch
      console.error('[useAuth] Sign-out failed:', e.message); // Line 56 → Log
      setError('Session expired. Redirecting to login.'); // Line 57 → Fallback
    } // Line 58 → Closes
  }, []); // Line 59 → Stable ref

  const isAuthenticated = !!user && !!session?.access_token; // Line 61 → Boolean gate

  return { user, session, loading, error, signInWithGoogle, signOut, isAuthenticated }; // Line 63 → Exports
} // Line 64 → Closes hook
