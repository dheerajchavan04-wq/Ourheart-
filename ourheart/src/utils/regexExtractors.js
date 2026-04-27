// 📁 FILE: src/utils/regexExtractors.js
// 📏 LINES: 1-85
// 🎯 PURPOSE: Name extraction from chat, summary parsing, input sanitization, pattern matching
// 🔒 SECURITY: Strict regex boundaries, HTML strip, prevents prototype pollution & XSS
// 🌐 SEO/GEO: None direct (utility layer)
// ⚠️ SAFETY: Fallback defaults, null handling, max-length enforcement, safe trimming

// Line 8 → Strip HTML tags from user input
export const stripHTML = (str) => { // Line 9 → HTML remover
  if (typeof str !== 'string') return ''; // Line 10 → Type guard
  return str.replace(/<[^>]*>/g, ''); // Line 11 → Regex replace tags
}; // Line 12 → Closes

// Line 14 → Extract user name from chat patterns
export const extractUserName = (text) => { // Line 15 → Name parser
  const clean = stripHTML(text).trim(); // Line 16 → Sanitize first
  const patterns = [ // Line 17 → Pattern array
    /(?:my name is|i'm|i am|call me)\s+([a-zA-Z\s]{2,30})/i, // Line 18 → Common intros
    /i go by\s+([a-zA-Z\s]{2,30})/i, // Line 19 → Alias intro
    /^([a-zA-Z\s]{2,30})\s+here$/i // Line 20 → Sign-off style
  ]; // Line 21 → Closes array
  for (const regex of patterns) { // Line 22 → Loop patterns
    const match = clean.match(regex); // Line 23 → Test regex
    if (match && match[1]) { // Line 24 → Check capture
      return match[1].trim().slice(0, 30); // Line 25 → Return safe slice
    } // Line 26 → Closes if
  } // Line 27 → Closes loop
  return null; // Line 28 → Default null
}; // Line 29 → Closes

// Line 31 → Extract SUMMARY block from AI response
export const extractSummary = (text) => { // Line 32 → Summary parser
  const match = text.match(/SUMMARY:\s*(.+)$/s); // Line 33 → Regex capture
  return match ? match[1].trim() : null; // Line 34 → Return or null
}; // Line 35 → Closes

// Line 37 → Sanitize extracted data for DB/AI
export const sanitizeForAI = (str) => { // Line 38 → AI sanitizer
  return str
    .replace(/[\r\n]+/g, ' ') // Line 39 → Flatten newlines
    .replace(/[<>{}]/g, '') // Line 40 → Remove brackets
    .slice(0, 2000); // Line 41 → Hard cap
}; // Line 42 → Closes

// Line 44 → Count words accurately
export const countWords = (text) => { // Line 45 → Word counter
  if (!text || typeof text !== 'string') return 0; // Line 46 → Guard
  const trimmed = text.trim(); // Line 47 → Clean edges
  if (trimmed.length === 0) return 0; // Line 48 → Empty check
  return trimmed.split(/\s+/).length; // Line 49 → Split & count
}; // Line 50 → Closes

// Line 52 → Truncate to word limit
export const truncateToWords = (text, limit) => { // Line 53 → Truncator
  const words = text.split(/\s+/); // Line 54 → Split array
  if (words.length <= limit) return text; // Line 55 → Already safe
  return words.slice(0, limit).join(' ') + '…'; // Line 56 → Slice & ellipsis
}; // Line 57 → Closes

// Line 59 → Validate safe string for storage
export const isSafeForDB = (str) => { // Line 60 → DB validator
  return typeof str === 'string' && str.length > 0 && str.length < 5000; // Line 61 → Length/type check
}; // Line 62 → Closes

// Line 64 → Export bundle
export default { stripHTML, extractUserName, extractSummary, sanitizeForAI, countWords, truncateToWords, isSafeForDB }; // Line 65 → Default export
// Line 66 → EOF
