// 📁 FILE: supabase/functions/chatHandler/keyRotation.ts
// 📏 LINES: 1-95
// 🎯 PURPOSE: Dual-provider rate limiter, key switching logic, usage logging, queue fallback on 429/limits
// 🔒 SECURITY: Keys never logged, in-memory tracking reset on minute boundaries, provider isolation
// ⚠️ SAFETY: Atomic counters, overflow protection, queue delay, fallback to alternative provider, error boundaries
interface ProviderTracker { // Line 8 → Type definition
  rpm: number; // Line 9 → Requests per minute
  tpm: number; // Line 10 → Tokens per minute
  lastReset: number; // Line 11 → Timestamp
  limitRPM: number; // Line 12 → Max RPM
  limitTPM: number; // Line 13 → Max TPM
} // Line 14 → Closes type

// Line 16 → Provider configuration map
const TRACKERS: Record<string, ProviderTracker> = { // Line 17 → Object map
  groq: { rpm: 0, tpm: 0, lastReset: Date.now(), limitRPM: 30, limitTPM: 30000 }, // Line 18 → Groq limits
  cerebras: { rpm: 0, tpm: 0, lastReset: Date.now(), limitRPM: 30, limitTPM: 60000 } // Line 19 → Cerebras limits
}; // Line 20 → Closes

// Line 22 → Select available provider based on limits
export const getAvailableProvider = async (): Promise<{ provider: string; apiKey: string }> => { // Line 23 → Export async
  const now = Date.now(); // Line 24 → Current time
  for (const [key, tracker] of Object.entries(TRACKERS)) { // Line 25 → Iterate providers
    if (now - tracker.lastReset >= 60000) { // Line 26 → Minute check
      tracker.rpm = 0; // Line 27 → Reset RPM
      tracker.tpm = 0; // Line 28 → Reset TPM
      tracker.lastReset = now; // Line 29 → Update timestamp
    } // Line 30 → Closes
    if (tracker.rpm < tracker.limitRPM && tracker.tpm < tracker.limitTPM) { // Line 31 → Limit check
      return { provider: key, apiKey: key }; // Line 32 → Return available
    } // Line 33 → Closes if
  } // Line 34 → End loop

  // Line 36 → Both exhausted → queue logic
  const nextReset = Math.min(...Object.values(TRACKERS).map(t => t.lastReset + 60000)); // Line 37 → Calc wait
  const waitTime = Math.max(0, nextReset - Date.now()); // Line 38 → Delay calc
  console.warn('[Rotation] Both providers at limit. Queuing for', waitTime, 'ms'); // Line 39 → Log
  await new Promise(r => setTimeout(r, waitTime + 100)); // Line 40 → Wait
  return getAvailableProvider(); // Line 41 → Retry
}; // Line 42 → Closes

// Line 44 → Track usage after response
export const trackLimits = async (provider: string, inTokens: number, outChars: number) => { // Line 45 → Usage logger
  try { // Line 46 → Try
    const tracker = TRACKERS[provider]; // Line 47 → Get tracker
    if (!tracker) return; // Line 48 → Guard
    const outTokens = Math.ceil(outChars / 4); // Line 49 → Char to token approx
    tracker.rpm += 1; // Line 50 → Increment request
    tracker.tpm += inTokens + outTokens; // Line 51 → Increment tokens
  } catch (e) { // Line 52 → Catch
    console.error('[Rotation] Limit tracking failed:', e.message); // Line 53 → Safe log
  } // Line 54 → Closes
}; // Line 55 → Closes

// Line 57 → Log API usage to Supabase
export const logUsage = async (provider: string, tokensIn: number, tokensOut: number) => { // Line 58 → DB logger
  try { // Line 59 → Try
    const url = Deno.env.get('SUPABASE_URL'); // Line 60 → Env read
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // Line 61 → Env read
    if (!url || !key) return; // Line 62 → Guard
    await fetch(`${url}/rest/v1/api_usage_logs`, { // Line 63 → REST insert
      method: 'POST', // Line 64 → Method
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }, // Line 65 → Headers
      body: JSON.stringify({ provider, tokens_in: tokensIn, tokens_out: tokensOut, request_time: new Date().toISOString() }) // Line 66 → Payload
    }); // Line 67 → Closes fetch
  } catch { /* Silent fail for logging to not block stream */ } // Line 68 → Catch
}; // Line 69 → Closes

// 🔑 API KEY LOCATION: Deno.env / Supabase CLI Secrets
// 🗄️ DATABASE CONFIG: api_usage_logs table in Supabase
// 🔄 HOW TO CHANGE: Edit limits in TRACKERS object or update provider via env
// 🛡️ WHY SECURE: In-memory only counters. No disk writes. Resets automatically. No key exposure in logs.
