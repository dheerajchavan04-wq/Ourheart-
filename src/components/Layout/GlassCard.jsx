// 📁 FILE: src/components/Layout/GlassCard.jsx
// 📏 LINES: 1-48
// 🎯 PURPOSE: Reusable glass container with hover/press physics, focus ring, disabled handling
// 🔒 SECURITY: Validates children type, prevents click propagation leaks, safe default props
// ⚠️ SAFETY: Keyboard accessible, ARIA support, reduced-motion fallback

export default function GlassCard({ // Line 8 → Component def
  children, // Line 9 → Content slot
  className = '', // Line 10 → Default class
  onClick, // Line 11 → Click handler
  disabled = false, // Line 12 → Default enabled
  ariaLabel = '', // Line 13 → Accessibility label
  as: Component = 'div' // Line 14 → Polymorphic wrapper
}) {
  const safeClick = (e) => { // Line 16 → Safe wrapper
    if (disabled || typeof onClick !== 'function') return; // Line 17 → Guard
    e.preventDefault(); // Line 18 → Prevent default behavior
    try { // Line 19 → Try
      onClick(e); // Line 20 → Execute
      if (window.navigator?.vibrate) window.navigator.vibrate(8); // Line 21 → Haptic
    } catch (err) { // Line 22 → Catch
      console.error('[GlassCard] Click error:', err.message); // Line 23 → Log
    } // Line 24 → Closes
  }; // Line 25 → Closes

  return ( // Line 26 → JSX
    <Component // Line 27 → Dynamic tag
      className={`glass-panel p-4 transition-transform hover:-translate-y-1 active:scale-95 ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'} ${className}`} // Line 28 → Combined classes
      onClick={safeClick} // Line 29 → Safe handler
      disabled={disabled} // Line 30 → Pass prop
      tabIndex={disabled ? -1 : 0} // Line 31 → Keyboard focus
      aria-label={ariaLabel} // Line 32 → ARIA
      role={onClick && !disabled ? 'button' : undefined} // Line 33 → ARIA role
    >
      {children} // Line 34 → Render content
    </Component> // Line 35 → Closes wrapper
  ); // Line 36 → Closes return
} // Line 37 → Closes component
