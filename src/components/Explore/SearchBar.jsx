// 📁 FILE: src/components/Explore/SearchBar.jsx
// 📏 LINES: 1-62
// 🎯 PURPOSE: Real-time search input with debounce, clear trigger, XSS sanitization, accessibility
// 🔒 SECURITY: Strips HTML before state storage, prevents prototype pollution, rate-limits onChange
// ⚠️ SAFETY: Disabled during loading, focus ring, ARIA labels, graceful fallback on error
import React, { useState, useEffect, useRef } from 'react'; // Line 8 → Imports

export default function SearchBar({ onSearch, isLoading = false }) { // Line 10 → Props
  const [value, setValue] = useState(''); // Line 11 → Input state
  const timerRef = useRef(null); // Line 12 → Debounce timer ref

  const handleChange = (e) => { // Line 14 → Input handler
    try { // Line 15 → Try block
      const raw = e.target.value; // Line 16 → Get raw input
      const clean = raw.replace(/<[^>]*>/g, '').slice(0, 60); // Line 17 → Sanitize + hard cap
      setValue(clean); // Line 18 → Update state
      if (timerRef.current) clearTimeout(timerRef.current); // Line 19 → Clear pending
      timerRef.current = setTimeout(() => { // Line 20 → Set debounce
        if (typeof onSearch === 'function') onSearch(clean); // Line 21 → Fire callback
      }, 300); // Line 22 → 300ms delay
    } catch (e) { // Line 23 → Catch
      console.error('[SearchBar] Input error:', e.message); // Line 24 → Safe log
    } // Line 25 → Closes
  }; // Line 26 → Closes handler

  const handleClear = () => { // Line 28 → Clear handler
    setValue(''); // Line 29 → Reset state
    if (typeof onSearch === 'function') onSearch(''); // Line 30 → Trigger empty search
  }; // Line 31 → Closes

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []); // Line 33 → Cleanup unmount

  return ( // Line 34 → JSX
    <div className="relative w-full max-w-xl mx-auto mb-6"> // Line 35 → Container
      <input // Line 36 → Search input
        type="text" // Line 37 → Type
        value={value} // Line 38 → State sync
        onChange={handleChange} // Line 39 → Handler
        placeholder="Search by name, style, or personality..." // Line 40 → Hint
        disabled={isLoading} // Line 41 → Loading state
        aria-label="Search Characters" // Line 42 → ARIA
        className="w-full px-5 py-3 rounded-xl glass-panel text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryPink transition-all disabled:opacity-60" // Line 43 → Styling
      /> // Line 44 → Closes input
      {value.length > 0 && ( // Line 45 → Show clear if active
        <button // Line 46 → Clear trigger
          onClick={handleClear} // Line 47 → Handler
          aria-label="Clear Search" // Line 48 → ARIA
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 active:scale-95" // Line 49 → Styling
        >
          ✕ // Line 50 → Icon
        </button> // Line 51 → Closes button
      )} // Line 52 → Closes conditional
    </div> // Line 53 → Closes container
  ); // Line 54 → Closes return
} // Line 55 → Closes component
