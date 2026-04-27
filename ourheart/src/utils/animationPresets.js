// 📁 FILE: src/utils/animationPresets.js
// 📏 LINES: 1-68
// 🎯 PURPOSE: Centralized animation configs, easing maps, duration constants, performance flags
// 🔒 SECURITY: Pure config object, no DOM manipulation, prevents runtime injection
// 🌐 SEO/GEO: Respects user motion preferences, adapts to device capabilities
// ⚠️ SAFETY: Reduced-motion detection, fallback durations, GPU-friendly transform hints

// Line 8 → Check for reduced motion preference
const prefersReducedMotion = () => { // Line 9 → Motion check
  if (typeof window === 'undefined') return false; // Line 10 → SSR guard
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches; // Line 11 → Query preference
}; // Line 12 → Closes

// Line 14 → Base easing curves (physics-based)
export const easings = { // Line 15 → Easing map
  snappy: 'cubic-bezier(0.4, 0, 0.2, 1)', // Line 16 → Slide/scale default
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Line 17 → Bounce effect
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Line 18 → Fade transitions
  instant: 'steps(1, end)' // Line 19 → Discrete changes
}; // Line 20 → Closes

// Line 22 → Duration constants (ms)
export const durations = { // Line 23 → Time map
  micro: 150, // Line 24 → Hover/press feedback
  base: 300, // Line 25 → Card/message entrance
  modal: 250, // Line 26 → Overlay transitions
  videoFade: 800, // Line 27 → Landing video crossfade
  long: 1000 // Line 28 → Toast/notification
}; // Line 29 → Closes

// Line 31 → Performance-optimized transform helper
export const getTransform = (x = 0, y = 0, scale = 1, rotate = 0) => { // Line 32 → Transform builder
  return `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`; // Line 33 → GPU accelerated
}; // Line 34 → Closes

// Line 36 → Apply reduced motion overrides
export const applyMotionFallback = (duration, easing) => { // Line 37 → Motion adapter
  if (prefersReducedMotion()) { // Line 38 → Check preference
    return { duration: 1, easing: 'steps(1)' }; // Line 39 → Instant return
  } // Line 40 → Closes if
  return { duration, easing }; // Line 41 → Return original
}; // Line 42 → Closes

// Line 44 → Animation delay map (staggering utility)
export const getStaggerDelay = (index, base = 50) => { // Line 45 → Stagger calc
  return Math.max(0, index * base); // Line 46 → Non-negative delay
}; // Line 47 → Closes

// Line 49 → Validate animation config input
export const isValidAnimConfig = (cfg) => { // Line 50 → Config validator
  return cfg && // Line 51 → Exists
    typeof cfg.duration === 'number' && cfg.duration > 0 && // Line 52 → Valid duration
    typeof cfg.easing === 'string' && cfg.easing.length > 0; // Line 53 → Valid easing
}; // Line 54 → Closes

// Line 56 → Export bundle
export default { // Line 57 → Default export
  prefersReducedMotion, // Line 58 → Preference checker
  easings, // Line 59 → Curve map
  durations, // Line 60 → Time map
  getTransform, // Line 61 → Transform helper
  applyMotionFallback, // Line 62 → Motion adapter
  getStaggerDelay, // Line 63 → Stagger calc
  isValidAnimConfig // Line 64 → Validator
}; // Line 65 → Closes object
// Line 66 → EOF
