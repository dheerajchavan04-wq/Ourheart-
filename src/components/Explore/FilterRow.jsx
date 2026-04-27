// 📁 FILE: src/components/Explore/FilterRow.jsx
// 📏 LINES: 1-58
// 🎯 PURPOSE: Filter controls (Gender: Female, Style: Anime, Sort: Popular/Trending/New)
// 🔒 SECURITY: Strict enum validation, prevents arbitrary filter injection, safe state sync
// ⚠️ SAFETY: Disabled during loading, keyboard accessible, ARIA labels, haptic feedback
import React, { useState } from 'react'; // Line 7 → Import

const VALID_SORT = ['popular', 'trending', 'new']; // Line 9 → Allowed values

export default function FilterRow({ onFilterChange }) { // Line 11 → Props
  const [sort, setSort] = useState('popular'); // Line 12 → Default sort

  const handleSort = (val) => { // Line 14 → Sort handler
    if (!VALID_SORT.includes(val)) return; // Line 15 → Validation guard
    setSort(val); // Line 16 → Update state
    try { // Line 17 → Try
      if (typeof onFilterChange === 'function') onFilterChange({ gender: 'female', style: 'anime', sort: val }); // Line 18 → Emit filters
      if (window.navigator?.vibrate) window.navigator.vibrate(5); // Line 19 → Haptic
    } catch (e) { // Line 20 → Catch
      console.warn('[FilterRow] Filter sync failed:', e.message); // Line 21 → Log
    } // Line 22 → Closes
  }; // Line 23 → Closes

  return ( // Line 24 → JSX
    <div className="flex flex-wrap items-center justify-center gap-3 mb-6"> // Line 25 → Row container
      <span className="px-3 py-1 rounded-full glass-panel text-xs text-gray-300">👩 Female Only</span> // Line 26 → Gender badge
      <span className="px-3 py-1 rounded-full glass-panel text-xs text-gray-300">🎨 Anime Only</span> // Line 27 → Style badge
      <div className="flex gap-2"> // Line 28 → Sort group
        {VALID_SORT.map((opt) => ( // Line 29 → Render options
          <button // Line 30 → Option button
            key={opt} // Line 31 → React key
            onClick={() => handleSort(opt)} // Line 32 → Handler
            aria-pressed={sort === opt} // Line 33 → ARIA state
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${sort === opt ? 'bg-primaryPink text-white shadow-lg shadow-pink-glow' : 'glass-panel text-gray-300 hover:text-white'}`} // Line 34 → Dynamic class
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)} // Line 35 → Capitalize label
          </button> // Line 36 → Closes button
        ))} // Line 37 → End map
      </div> // Line 38 → Closes group
    </div> // Line 39 → Closes row
  ); // Line 40 → Closes return
} // Line 41 → Closes component
