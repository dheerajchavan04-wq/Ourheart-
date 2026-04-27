// 📁 FILE: src/components/Auth/PrivacyNotice.jsx
// 📏 LINES: 1-56
// 🎯 PURPOSE: Transparent privacy warning component matching your spec, dismissible, high contrast
// 🔒 SECURITY: Read-only display, no data collection, clear liability disclaimer
// ⚠️ SAFETY: ARIA live region for screen readers, smooth fade, reduced-motion fallback

export default function PrivacyNotice({ onDismiss }) { // Line 8 → Props
  return ( // Line 9 → JSX
    <div // Line 10 → Container
      className="w-full max-w-lg mx-auto mt-6 p-5 rounded-xl border border-yellow-500/30 bg-yellow-900/10 backdrop-blur-sm anim-fade-in" // Line 11 → Warning styling
      role="alert" // Line 12 → ARIA
      aria-live="polite" // Line 13 → Screen reader
    >
      <div className="flex items-start gap-3"> // Line 14 → Content layout
        <span className="text-2xl mt-1">🛡️</span> // Line 15 → Icon
        <div className="flex-1"> // Line 16 → Text container
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Your Privacy, Your Responsibility</h3> // Line 17 → Title
          <p className="text-gray-300 text-sm leading-relaxed mb-4"> // Line 18 → Body start
            Treat OURHEART as a fictional space. Never share real names, addresses, or sensitive details. 
            We implement standard security but cannot guarantee absolute protection against breaches. 
            Data leaks are a known digital risk. You use this platform at your own discretion.
          </p> // Line 19 → Body end
          <button // Line 20 → Dismiss button
            onClick={() => typeof onDismiss === 'function' && onDismiss()} // Line 21 → Safe call
            className="text-sm text-primaryPink hover:underline focus:outline-none focus:ring-2 focus:ring-primaryPink rounded px-2 py-1" // Line 22 → Styling
          >
            I Understand & Continue // Line 23 → Button text
          </button> // Line 24 → Closes button
        </div> // Line 25 → Closes container
      </div> // Line 26 → Closes layout
    </div> // Line 27 → Closes container
  ); // Line 28 → Closes return
} // Line 29 → Closes component
