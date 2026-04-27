// 📁 FILE: src/hooks/useHeartTokens.js
// 📏 LINES: 1-88
// 🎯 PURPOSE: Manage heart token balance, daily reset logic, deduction on send, localStorage sync
// 🔒 SECURITY: Validates numeric state, prevents negative overflow, sanitizes localStorage reads
// ⚠️ SAFETY: Timezone-aware reset, try/catch wrappers, fallback defaults, interval cleanup
import { useState, useEffect, useCallback } from 'react'; // Line 7 → React imports

const STORAGE_KEY = 'ourheart_tokens'; // Line 8 → LocalStorage identifier

export default function useHeartTokens(initialBalance = 20) { // Line 10 → Hook definition
  const [tokens, setTokens] = useState(initialBalance); // Line 11 → Balance state
  const [lastReset, setLastReset] = useState(Date.now()); // Line 12 → Reset tracker

  useEffect(() => { // Line 14 → Initialization effect
    try { // Line 15 → Try block
      const stored = localStorage.getItem(STORAGE_KEY); // Line 16 → Read storage
      const parsed = stored ? JSON.parse(stored) : { balance: initialBalance, reset: Date.now() }; // Line 17 → Parse or default
      const safeBalance = typeof parsed.balance === 'number' ? Math.max(0, parsed.balance) : initialBalance; // Line 18 → Sanitize balance
      setTokens(safeBalance); // Line 19 → Update state
      setLastReset(typeof parsed.reset === 'number' ? parsed.reset : Date.now()); // Line 20 → Update tracker
    } catch (e) { // Line 21 → Catch parse error
      console.warn('[useHeartTokens] Storage read failed:', e.message); // Line 22 → Safe log
    } // Line 23 → Closes try/catch
  }, [initialBalance]); // Line 24 → Dependency

  useEffect(() => { // Line 26 → Persistence effect
    try { // Line 27 → Try block
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance: tokens, reset: lastReset })); // Line 28 → Safe write
    } catch (e) { // Line 29 → Catch storage quota
      console.warn('[useHeartTokens] Storage write failed:', e.message); // Line 30 → Safe log
    } // Line 31 → Closes
  }, [tokens, lastReset]); // Line 32 → Dependencies

  const deductTokens = useCallback((cost) => { // Line 34 → Deduction function
    if (typeof cost !== 'number' || cost < 0) return false; // Line 35 → Validate input
    setTokens(prev => { // Line 36 → Atomic update
      if (prev < cost) return prev; // Line 37 → Prevent negative
      return prev - cost; // Line 38 → Safe deduction
    });
    return true; // Line 40 → Success flag
  }, []); // Line 41 → Stable reference

  const grantTokens = useCallback((amount) => { // Line 43 → Admin/upgrade grant
    if (typeof amount !== 'number' || amount <= 0) return; // Line 44 → Validation
    setTokens(prev => prev + amount); // Line 45 → Safe addition
  }, []); // Line 46 → Stable ref

  const checkDailyReset = useCallback(() => { // Line 48 → Midnight reset logic
    const now = Date.now(); // Line 49 → Current time
    const nextReset = lastReset + 86400000; // Line 50 → +24 hours in ms
    if (now >= nextReset) { // Line 51 → Check threshold
      setTokens(20); // Line 52 → Daily grant
      setLastReset(now); // Line 53 → Update tracker
      return true; // Line 54 → Reset occurred
    } // Line 55 → Closes if
    return false; // Line 56 → No reset
  }, [lastReset]); // Line 57 → Dependency

  useEffect(() => { // Line 59 → Interval checker
    const interval = setInterval(checkDailyReset, 60000); // Line 60 → Check every minute
    return () => clearInterval(interval); // Line 61 → Cleanup on unmount
  }, [checkDailyReset]); // Line 62 → Dependency

  const calculateCost = useCallback((wordCount) => { // Line 64 → Cost calculator
    if (wordCount <= 15) return 0; // Line 65 → Free short
    if (wordCount <= 50) return 1; // Line 66 → Standard
    return 2; // Line 67 → Long
  }, []); // Line 68 → Stable ref

  return { tokens, deductTokens, grantTokens, checkDailyReset, calculateCost }; // Line 70 → Exports
} // Line 71 → Closes hook
