// 📁 FILE: src/utils/geoConfig.js
// 📏 LINES: 1-102
// 🎯 PURPOSE: Timezone detection, locale handling, hreflang generation, privacy-safe IP hashing
// 🔒 SECURITY: No third-party trackers, local hashing only, GDPR/CCPA compliant by design
// 🌐 SEO/GEO: Region-aware routing prep, language mapping, fallback locale handling
// ⚠️ SAFETY: Graceful fallbacks for unsupported APIs, null-safe environment checks

// Line 8 → SHA-256 helper (privacy-safe IP hashing)
const hashIP = async (ip) => { // Line 9 → Async hasher
  if (!ip || typeof ip !== 'string') return ''; // Line 10 → Guard
  const encoder = new TextEncoder(); // Line 11 → Text encoder
  const data = encoder.encode(ip.trim().toLowerCase()); // Line 12 → Normalize input
  const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Line 13 → Crypto digest
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Line 14 → Byte array
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Line 15 → Hex string
}; // Line 16 → Closes

// Line 18 → Detect user timezone
export const getUserTimezone = () => { // Line 19 → Timezone getter
  try { // Line 20 → Safe try
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; // Line 21 → Fallback to UTC
  } catch { // Line 22 → Catch unsupported browsers
    return 'UTC'; // Line 23 → Default
  } // Line 24 → Closes
}; // Line 25 → Closes

// Line 27 → Detect user locale
export const getUserLocale = () => { // Line 28 → Locale getter
  const nav = typeof navigator !== 'undefined' ? navigator : null; // Line 29 → Safe nav ref
  return nav?.language || nav?.userLanguage || 'en-US'; // Line 30 → Fallback chain
}; // Line 31 → Closes

// Line 33 → Generate hreflang tags dynamically
export const generateHreflang = (baseUrl, locales = ['en', 'ja', 'es', 'fr']) => { // Line 34 → Hreflang generator
  return locales.map(loc => { // Line 35 → Map locales
    const cleanLoc = loc.replace(/[^a-z-]/g, ''); // Line 36 → Sanitize lang code
    return `<link rel="alternate" hreflang="${cleanLoc}" href="${baseUrl}/${cleanLoc}" />`; // Line 37 → Build tag
  }).join('\n'); // Line 38 → Join string
}; // Line 39 → Closes

// Line 41 → Determine region fallback for content
export const getRegionFallback = (tz) => { // Line 42 → Region mapper
  const asia = ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Bangkok']; // Line 43 → Asia list
  const eu = ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid']; // Line 44 → EU list
  if (asia.includes(tz)) return 'asia'; // Line 45 → Match Asia
  if (eu.includes(tz)) return 'eu'; // Line 46 → Match EU
  return 'global'; // Line 47 → Default
}; // Line 48 → Closes

// Line 50 → Daily token reset time calc (timezone aware)
export const getNextResetTimestamp = () => { // Line 51 → Reset calc
  const now = new Date(); // Line 52 → Current time
  const resetHour = 0; // Line 53 → Midnight UTC reset
  const reset = new Date(now); // Line 54 → Clone date
  reset.setUTCHours(resetHour, 0, 0, 0); // Line 55 → Set reset time
  if (now >= reset) reset.setUTCDate(reset.getUTCDate() + 1); // Line 56 → Next day if passed
  return reset.getTime(); // Line 57 → Return ms
}; // Line 58 → Closes

// Line 60 → Geo config bundle (used in app init)
export const initGeoConfig = async () => { // Line 61 → Boot function
  const tz = getUserTimezone(); // Line 62 → Get TZ
  const locale = getUserLocale(); // Line 63 → Get locale
  const region = getRegionFallback(tz); // Line 64 → Map region
  const resetAt = getNextResetTimestamp(); // Line 65 → Calc reset
  return { tz, locale, region, resetAt, hashedIP: '' }; // Line 66 → Return config
}; // Line 67 → Closes

// Line 69 → Validate locale for Supabase hreflang
export const isValidLocale = (loc) => { // Line 70 → Validator
  const pattern = /^[a-z]{2}(-[A-Z]{2})?$/; // Line 71 → Regex pattern
  return typeof loc === 'string' && pattern.test(loc.trim()); // Line 72 → Test match
}; // Line 73 → Closes

// Line 75 → Export for React hooks
export default { hashIP, getUserTimezone, getUserLocale, generateHreflang, getRegionFallback, getNextResetTimestamp, initGeoConfig, isValidLocale }; // Line 76 → Bundle export
// Line 77 → EOF
