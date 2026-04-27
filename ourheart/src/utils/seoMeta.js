// 📁 FILE: src/utils/seoMeta.js
// 📏 LINES: 1-95
// 🎯 PURPOSE: Dynamic meta injection, OG/Twitter tags, JSON-LD updater, canonical handler
// 🔒 SECURITY: Sanitizes inputs before DOM injection, prevents XSS in meta attributes
// 🌐 SEO/GEO: Route-specific titles, hreflang prep, structured data maintenance
// ⚠️ SAFETY: Graceful fallbacks if meta elements missing, null-safe DOM queries

// Line 8 → Escape HTML entities to prevent XSS in meta tags
const sanitizeMeta = (str) => { // Line 9 → Input sanitization function
  if (typeof str !== 'string') return ''; // Line 10 → Type guard
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])); // Line 11 → Entity replacement
}; // Line 12 → Returns safe string

// Line 14 → Update document title safely
export const updateTitle = (title, prefix = 'OURHEART | ') => { // Line 15 → Exports title updater
  const safeTitle = sanitizeMeta(title); // Line 16 → Sanitize input
  document.title = `${prefix}${safeTitle}`; // Line 17 → Set browser tab title
  const metaTitle = document.querySelector('meta[property="og:title"]'); // Line 18 → Find OG tag
  if (metaTitle) metaTitle.setAttribute('content', safeTitle); // Line 19 → Update if exists
}; // Line 20 → Closes function

// Line 22 → Update description & meta tags
export const updateMeta = (desc) => { // Line 23 → Exports meta updater
  const safeDesc = sanitizeMeta(desc); // Line 24 → Sanitize input
  const metaDesc = document.querySelector('meta[name="description"]'); // Line 25 → Target description meta
  if (metaDesc) metaDesc.setAttribute('content', safeDesc); // Line 26 → Set safe content
  const ogDesc = document.querySelector('meta[property="og:description"]'); // Line 27 → Target OG description
  if (ogDesc) ogDesc.setAttribute('content', safeDesc); // Line 28 → Sync OG tag
}; // Line 29 → Closes function

// Line 31 → Update canonical URL (SEO duplicate prevention)
export const updateCanonical = (url) => { // Line 32 → Exports canonical handler
  const safeUrl = sanitizeMeta(url); // Line 33 → Sanitize URL
  let link = document.querySelector('link[rel="canonical"]'); // Line 34 → Find existing link
  if (!link) { // Line 35 → Create if missing
    link = document.createElement('link'); // Line 36 → New link element
    link.rel = 'canonical'; // Line 37 → Set relation
    link.href = safeUrl; // Line 38 → Set href
    document.head.appendChild(link); // Line 39 → Append to head
  } else { // Line 40 → Existing found
    link.href = safeUrl; // Line 41 → Update href
  } // Line 42 → Closes conditional
}; // Line 43 → Closes function

// Line 45 → Inject/Update JSON-LD structured data
export const updateJSONLD = (data) => { // Line 46 → Exports JSON-LD handler
  try { // Line 47 → Try block for safe parsing
    const script = document.querySelector('script[type="application/ld+json"]'); // Line 48 → Find LD script
    if (script) { // Line 49 → Check existence
      const parsed = typeof data === 'string' ? JSON.parse(data) : data; // Line 50 → Parse if string
      script.textContent = JSON.stringify(parsed); // Line 51 → Overwrite safely
    } // Line 52 → Closes if
  } catch (e) { // Line 53 → Catch parse errors
    console.warn('[SEO] JSON-LD update failed:', e.message); // Line 54 → Log warning
  } // Line 55 → Closes try/catch
}; // Line 56 → Closes function

// Line 58 → Batch route update (used in React useEffect)
export const syncRouteSEO = ({ title, desc, url, jsonLD }) => { // Line 59 → Batch updater
  if (title) updateTitle(title); // Line 60 → Call title
  if (desc) updateMeta(desc); // Line 61 → Call meta
  if (url) updateCanonical(url); // Line 62 → Call canonical
  if (jsonLD) updateJSONLD(jsonLD); // Line 63 → Call JSON-LD
}; // Line 64 → Closes batch

// Line 66 → Open Graph Image fallback (prevents broken shares)
export const setOGImage = (imgUrl) => { // Line 67 → Image setter
  const safeUrl = sanitizeMeta(imgUrl); // Line 68 → Sanitize
  const ogImg = document.querySelector('meta[property="og:image"]'); // Line 69 → Find OG image
  if (ogImg) ogImg.setAttribute('content', safeUrl || '/images/default-og.jpg'); // Line 70 → Set or fallback
}; // Line 71 → Closes

// Line 73 → Twitter Card meta (optional but recommended)
export const setTwitterMeta = (title, desc) => { // Line 74 → Twitter helper
  const tTitle = document.querySelector('meta[name="twitter:title"]'); // Line 75 → Find title
  const tDesc = document.querySelector('meta[name="twitter:description"]'); // Line 76 → Find desc
  if (tTitle) tTitle.setAttribute('content', sanitizeMeta(title)); // Line 77 → Set title
  if (tDesc) tDesc.setAttribute('content', sanitizeMeta(desc)); // Line 78 → Set desc
}; // Line 79 → Closes

// Line 81 → Initialize default SEO on app load
export const initDefaultSEO = () => { // Line 82 → Boot function
  updateTitle('Cinematic AI Sanctuary'); // Line 83 → Set default
  updateMeta('Immersive AI anime character chat platform. Safe, emotional, beautifully animated.'); // Line 84 → Default desc
  setTwitterMeta('OURHEART', 'Step into a living cinematic narrative.'); // Line 85 → Default Twitter
}; // Line 86 → Closes

// Line 88 → Export validation helper
export const isValidSEOInput = (val) => { // Line 89 → Validator
  return typeof val === 'string' && val.trim().length > 0 && val.trim().length < 200; // Line 90 → Length/type check
}; // Line 91 → Closes

// Line 93 → Default export for convenience
export default { updateTitle, updateMeta, updateCanonical, updateJSONLD, syncRouteSEO, setOGImage, setTwitterMeta, initDefaultSEO, isValidSEOInput }; // Line 94 → Bundle export
// Line 95 → EOF
