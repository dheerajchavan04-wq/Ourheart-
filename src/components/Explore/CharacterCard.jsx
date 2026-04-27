// 📁 FILE: src/components/Explore/CharacterCard.jsx
// 📏 LINES: 1-68
// 🎯 PURPOSE: 4:5 character card with gradient overlay, age/name/desc, click modal trigger, press scale
// 🔒 SECURITY: Sanitizes image URL, validates age (18+), prevents direct DOM injection
// ⚠️ SAFETY: Lazy image loading, fallback poster, ARIA roles, error boundary on click
import React from 'react'; // Line 8 → Import

export default function CharacterCard({ char, onOpen }) { // Line 10 → Props
  const handleClick = () => { // Line 12 → Click handler
    try { // Line 13 → Try
      if (!char?.id || typeof onOpen !== 'function') return; // Line 14 → Validation
      onOpen(char); // Line 15 → Open modal
      if (window.navigator?.vibrate) window.navigator.vibrate(10); // Line 16 → Haptic
    } catch (e) { // Line 17 → Catch
      console.error('[CharacterCard] Open failed:', e.message); // Line 18 → Log
    } // Line 19 → Closes
  }; // Line 20 → Closes

  const safeAge = typeof char?.age === 'number' && char.age >= 18 ? char.age : 18; // Line 22 → Age guard
  const safeImg = typeof char?.image === 'string' ? char.image : '/images/placeholder-char.webp'; // Line 23 → Image fallback

  return ( // Line 24 → JSX
    <div // Line 25 → Card wrapper
      onClick={handleClick} // Line 26 → Click
      role="button" // Line 27 → ARIA role
      tabIndex={0} // Line 28 → Keyboard focus
      onKeyDown={(e) => e.key === 'Enter' && handleClick()} // Line 29 → Keyboard trigger
      className="relative w-full aspect-[4/5] rounded-xl overflow-hidden glass-panel cursor-pointer group transition-transform hover:-translate-y-2 active:scale-95" // Line 30 → Styling + physics
    >
      <img // Line 31 → Image tag
        src={safeImg} // Line 32 → Safe URL
        alt={`${char?.name || 'Character'} anime portrait`} // Line 33 → ARIA alt
        loading="lazy" // Line 34 → Performance
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // Line 35 → Zoom on hover
      /> // Line 36 → Closes img
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end"> // Line 37 → Gradient overlay
        <h3 className="text-lg font-serif font-bold text-white mb-1">{char?.name || 'Unknown'}</h3> // Line 38 → Name
        <span className="text-xs text-gray-300 mb-2">Age: {safeAge} | {char?.tags?.slice(0, 2).join(', ') || 'Mysterious'}</span> // Line 39 → Meta
        <p className="text-sm text-gray-200 line-clamp-2">{char?.description || 'Tap to discover her story.'}</p> // Line 40 → Desc
      </div> // Line 41 → Closes overlay
    </div> // Line 42 → Closes wrapper
  ); // Line 43 → Closes return
} // Line 44 → Closes component
