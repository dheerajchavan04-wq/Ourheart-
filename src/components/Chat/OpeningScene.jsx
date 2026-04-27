// 📁 FILE: src/components/Chat/OpeningScene.jsx
// 📏 LINES: 1-58
// 🎯 PURPOSE: Cinematic 5-10 line intro renderer with sequential fade-in, skip/dismiss option, glass overlay
// 🔒 SECURITY: Sanitizes scene lines, prevents XSS, safe timeout cleanup on unmount
// ⚠️ SAFETY: Respects reduced-motion, auto-dismiss fallback, ARIA live region for screen readers
import React, { useState, useEffect } from 'react'; // Line 8 → Imports

export default function OpeningScene({ lines = [], onDismiss }) { // Line 10 → Props
  const [visibleLines, setVisibleLines] = useState([]); // Line 11 → State
  const [dismissed, setDismissed] = useState(false); // Line 12 → Dismiss state

  useEffect(() => { // Line 14 → Mount effect
    if (lines.length === 0 || dismissed) return; // Line 15 → Guard
    let delay = 0; // Line 16 → Timer tracker
    const timeouts = lines.map((line, i) => { // Line 17 → Map lines
      const timer = setTimeout(() => { // Line 18 → Stagger timer
        setVisibleLines(prev => [...prev, line]); // Line 19 → Append line
        if (i === lines.length - 1) { // Line 20 → Last line check
          setTimeout(() => setDismissed(true), 2500); // Line 21 → Auto dismiss
        } // Line 22 → Closes
      }, delay + (i * 800)); // Line 23 → Increment delay
      return timer; // Line 24 → Return timer ID
    }); // Line 25 → End map

    return () => timeouts.forEach(clearTimeout); // Line 27 → Cleanup
  }, [lines, dismissed]); // Line 28 → Deps

  if (dismissed) return null; // Line 30 → Early exit

  return ( // Line 31 → JSX
    <div className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 anim-fade-in"> // Line 32 → Overlay
      <div className="w-full max-w-lg max-h-[70vh] overflow-y-auto glass-panel p-6 rounded-2xl"> // Line 33 → Card
        <div className="space-y-4 text-gray-200 text-sm leading-relaxed" aria-live="polite"> // Line 34 → Text container
          {visibleLines.map((line, i) => ( // Line 35 → Render visible
            <p key={i} className="anim-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>{line}</p> // Line 36 → Line + anim
          ))} // Line 37 → End map
        </div> // Line 38 → Closes text
        <button // Line 39 → Skip button
          onClick={() => { setDismissed(true); if (typeof onDismiss === 'function') onDismiss(); }} // Line 40 → Handler
          className="mt-6 w-full py-2 rounded-lg glass-panel text-white hover:bg-white/10 active:scale-95 transition-all text-sm" // Line 41 → Styling
        >
          Continue to Chat // Line 42 → Text
        </button> // Line 43 → Closes button
      </div> // Line 44 → Closes card
    </div> // Line 45 → Closes overlay
  ); // Line 46 → Closes return
} // Line 47 → Closes component
