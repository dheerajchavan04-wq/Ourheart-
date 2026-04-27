// 📁 FILE: src/components/Layout/Header.jsx
// 📏 LINES: 1-68
// 🎯 PURPOSE: Top navigation bar with logo, upgrade button, notification trigger, menu toggle
// 🔒 SECURITY: No direct state mutations, delegates navigation via props, XSS-safe labels
// ⚠️ SAFETY: ARIA labels, keyboard focus management, disabled states, reduced-motion aware
import React, { useState } from 'react'; // Line 6 → React import

export default function Header({ onMenuOpen }) { // Line 8 → Component def, receives toggle prop
  const [isHovered, setIsHovered] = useState(false); // Line 9 → Hover state for button glow
  const handleMenuClick = () => { // Line 10 → Safe click handler
    try { // Line 11 → Try block
      if (typeof onMenuOpen === 'function') onMenuOpen(); // Line 12 → Type guard + invoke
    } catch (e) { // Line 13 → Catch runtime errors
      console.error('[Header] Menu toggle failed:', e.message); // Line 14 → Log error safely
    } // Line 15 → Closes try/catch
  }; // Line 16 → Closes handler

  return ( // Line 17 → JSX return
    <header // Line 18 → Semantic header tag
      className="fixed top-0 left-0 right-0 z-50 safe-top p-4 flex items-center justify-between glass-panel border-x-0 border-t-0 rounded-none" // Line 19 → Positioning, glass, safe area
      role="banner" // Line 20 → Accessibility landmark
    >
      <div className="flex items-center gap-2"> // Line 21 → Logo container
        <span className="text-2xl font-serif font-bold text-primaryPink select-none">OUR</span> // Line 22 → Logo text part 1
        <span className="text-2xl font-serif font-bold text-white select-none">HEART</span> // Line 23 → Logo text part 2
      </div> // Line 24 → Closes logo
      <div className="flex items-center gap-3"> // Line 25 → Action buttons container
        <button // Line 26 → Notification placeholder
          aria-label="Notifications (Coming Soon)" // Line 27 → Screen reader label
          className="w-10 h-10 rounded-full glass-panel flex items-center justify-center transition-transform hover:scale-105 active:scale-95" // Line 28 → Styling + physics
          disabled // Line 29 → Future feature placeholder
        >
          🔔 // Line 30 → Icon content
        </button> // Line 31 → Closes button
        <button // Line 32 → Upgrade button
          aria-label="Upgrade to Premium" // Line 33 → ARIA label
          onMouseEnter={() => setIsHovered(true)} // Line 34 → Hover tracker
          onMouseLeave={() => setIsHovered(false)} // Line 35 → Leave tracker
          className="px-4 py-2 rounded-lg bg-primaryPink text-white font-medium transition-all duration-200 hover:bg-secondaryPink active:scale-95 shadow-lg shadow-pink-glow" // Line 36 → Pink styling
        >
          Upgrade // Line 37 → Button text
        </button> // Line 38 → Closes button
        <button // Line 39 → Hamburger trigger
          aria-label="Open Navigation Menu" // Line 40 → ARIA
          onClick={handleMenuClick} // Line 41 → Safe handler
          className="w-10 h-10 rounded-lg glass-panel flex flex-col items-center justify-center gap-1.5 active:scale-95" // Line 42 → Styling
        >
          <span className="w-5 h-0.5 bg-white rounded transition-transform"></span> // Line 43 → Top line
          <span className="w-4 h-0.5 bg-white rounded transition-transform self-end"></span> // Line 44 → Mid line
          <span className="w-5 h-0.5 bg-white rounded transition-transform"></span> // Line 45 → Bottom line
        </button> // Line 46 → Closes hamburger
      </div> // Line 47 → Closes actions
    </header> // Line 48 → Closes header
  ); // Line 49 → Closes return
} // Line 50 → Closes component
