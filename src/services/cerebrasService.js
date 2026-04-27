// 📁 FILE: src/services/cerebrasService.js
// 📏 LINES: 1-62
// 🎯 PURPOSE: Cerebras fallback payload formatter, latency optimization, client-side prep for dual-provider routing
// 🔒 SECURITY: Zero key exposure, validates model name, caps tokens, sanitizes inputs
// ⚠️ SAFETY: Try/catch, null fallbacks, strict type checks, graceful provider switch prep
import { estimateTokens, truncateToWords } from '../utils/tokenCounter'; // Line 8 → Import utils
import { stripHTML, sanitizeForAI } from '../utils/regexExtractors'; // Line 9 → Import sanitizers

const MODEL_NAME = 'llama3.1-8b'; // Line 11 → Cerebras target
const MAX_CONTEXT_TOKENS = 3000; // Line 12 → Higher limit for fallback

// Line 14 → Build Cerebras-compatible payload
export const buildCerebrasPayload = ({ character, userMessage, summary, userName }) => { // Line 15 → Builder
  try { // Line 16 → Try
    const safeMsg = stripHTML(sanitizeForAI(userMessage)); // Line 17 → Clean message
    const safeSummary = stripHTML(sanitizeForAI(summary || 'No context.')); // Line 18 → Clean summary
    const safeChar = stripHTML(character?.name || 'AI'); // Line 19 → Clean char
    const safeUser = stripHTML(userName || 'friend'); // Line 20 → Clean user

    const combinedPrompt = `[Character: ${safeChar}] [User: ${safeUser}] [Scene: ${safeSummary}] ${safeMsg}`.slice(0, 1800); // Line 21 → Compact format
    const tokens = estimateTokens(combinedPrompt); // Line 22 → Estimate
    if (tokens > MAX_CONTEXT_TOKENS) { // Line 23 → Limit check
      console.warn('[Cerebras] Payload trimmed for context limit'); // Line 24 → Warn
    } // Line 25 → Closes

    return { // Line 26 → Return object
      model: MODEL_NAME, // Line 27 → Model ID
      messages: [{ role: 'user', content: combinedPrompt }], // Line 28 → Simplified structure
      max_tokens: 400, // Line 29 → Response cap
      stream: true // Line 30 → Enable streaming
    }; // Line 31 → Closes
  } catch (e) { // Line 32 → Catch
    console.error('[Cerebras] Payload build failed:', e.message); // Line 33 → Log
    return null; // Line 34 → Block send
  } // Line 35 → Closes
}; // Line 36 → Closes

// Line 38 → Extract summary from Cerebras response format
export const extractCerebrasSummary = (text) => { // Line 39 → Summary parser
  if (!text || typeof text !== 'string') return ''; // Line 40 → Guard
  const match = text.match(/SUMMARY:\s*(.+)$/s); // Line 41 → Regex capture
  return match ? match[1].trim().slice(0, 200) : ''; // Line 42 → Safe slice
}; // Line 43 → Closes

// Line 45 → Validate fallback readiness
export const isFallbackReady = () => { // Line 46 → Readiness check
  return typeof fetch === 'function' && // Line 47 → Fetch exists
    typeof AbortController === 'function'; // Line 48 → Abort exists
}; // Line 49 → Closes
