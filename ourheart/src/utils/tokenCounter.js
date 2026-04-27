// 📁 FILE: src/utils/tokenCounter.js
// 📏 LINES: 1-72
// 🎯 PURPOSE: Hard-cap validation (75 user / 150 AI), token estimation, cost calculation, error messaging
// 🔒 SECURITY: Prevents API abuse, enforces budget limits, safe fallback on malformed input
// 🌐 SEO/GEO: None direct (utility layer)
// ⚠️ SAFETY: Try/catch wrappers, graceful degradation, clear user feedback strings

// Line 8 → Estimate tokens (approx 1 token = 4 chars)
export const estimateTokens = (text) => { // Line 9 → Token estimator
  if (!text || typeof text !== 'string') return 0; // Line 10 → Guard
  return Math.ceil(text.length / 4); // Line 11 → Char division
}; // Line 12 → Closes

// Line 14 → Validate user message length
export const validateUserMessage = (text) => { // Line 15 → User validator
  const words = text.trim().split(/\s+/).length; // Line 16 → Count words
  if (words > 75) { // Line 17 → Over limit
    return { valid: false, error: 'Maximum length of the message reached', words }; // Line 18 → Return error
  } // Line 19 → Closes if
  return { valid: true, error: null, words }; // Line 20 → Success object
}; // Line 21 → Closes

// Line 23 → Validate AI response length
export const validateAIResponse = (text) => { // Line 24 → AI validator
  const words = text.trim().split(/\s+/).length; // Line 25 → Count words
  if (words > 150) { // Line 26 → Over limit
    return { valid: false, needsTrim: true, words }; // Line 27 → Flag trim
  } // Line 28 → Closes if
  return { valid: true, needsTrim: false, words }; // Line 29 → Success
}; // Line 30 → Closes

// Line 32 → Calculate heart token cost
export const getTokenCost = (words) => { // Line 33 → Cost calculator
  if (words <= 15) return 0; // Line 34 → Free short replies (bonus)
  if (words <= 50) return 1; // Line 35 → Standard cost
  return 2; // Line 36 → Long reply cost
}; // Line 37 → Closes

// Line 39 → Format error for UI display
export const formatValidationError = (type, limit, actual) => { // Line 40 → Error formatter
  return `${type} exceeds limit of ${limit} words (current: ${actual}). Please shorten your message.`; // Line 41 → User string
}; // Line 42 → Closes

// Line 44 → Safe trim with fallback
export const safeTrim = (text, limit) => { // Line 45 → Trimmer
  try { // Line 46 → Try block
    const words = text.split(/\s+/); // Line 47 → Split
    if (words.length <= limit) return text; // Line 48 → Safe length
    return words.slice(0, limit).join(' ') + '…'; // Line 49 → Trim safely
  } catch { // Line 50 → Catch crash
    return text.slice(0, limit * 5); // Line 51 → Char fallback
  } // Line 52 → Closes
}; // Line 53 → Closes

// Line 55 → Validate token balance before send
export const checkTokenBalance = (balance, cost) => { // Line 56 → Balance checker
  if (typeof balance !== 'number' || typeof cost !== 'number') return false; // Line 57 → Type guard
  return balance >= cost; // Line 58 → Compare
}; // Line 59 → Closes

// Line 61 → Export bundle
export default { // Line 62 → Default export
  estimateTokens, // Line 63 → Estimator
  validateUserMessage, // Line 64 → User validator
  validateAIResponse, // Line 65 → AI validator
  getTokenCost, // Line 66 → Cost calc
  formatValidationError, // Line 67 → Error format
  safeTrim, // Line 68 → Safe trim
  checkTokenBalance // Line 69 → Balance check
}; // Line 70 → Closes object
// Line 71 → EOF
