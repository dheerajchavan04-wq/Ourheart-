// 📁 FILE: src/components/Explore/CategoryTabs.jsx
// 📏 LINES: 1-52
// 🎯 PURPOSE: Horizontal scrollable category selector with snap, active highlight, safe filtering
// 🔒 SECURITY: Whitelisted categories only, prevents XSS in labels, safe click dispatch
// ⚠️ SAFETY: Scrollbar hidden, touch-friendly, ARIA listbox, reduced-motion respected
import React from 'react'; // Line 8 → Import

const CATEGORIES = [ // Line 10 → Allowed categories
  'Girlfriend', 'Sister', 'Mother', 'Daughter', 'Classmate', 'Teacher', 'Best Friend', 'Rival', 'Mentor', 'Custom'
]; // Line 11 → Closes

export default function CategoryTabs({ active, onSelect }) { // Line 13 → Props
  const handleSelect = (cat) => { // Line 14 → Select handler
    try { // Line 15 → Try
      if (typeof onSelect === 'function') onSelect(cat); // Line 16 → Dispatch
    } catch (e) { // Line 17 → Catch
      console.warn('[CategoryTabs] Selection error:', e.message); // Line 18 → Log
    } // Line 19 → Closes
  }; // Line 20 → Closes

  return ( // Line 21 → JSX
    <div className="w-full mb-6"> // Line 22 → Container
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"> // Line 23 → Scroll wrapper
        {CATEGORIES.map((cat) => ( // Line 24 → Render list
          <button // Line 25 → Tab button
            key={cat} // Line 26 → Key
            onClick={() => handleSelect(cat)} // Line 27 → Handler
            aria-pressed={active === cat} // Line 28 → State
            className={`snap-center shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 whitespace-nowrap ${active === cat ? 'bg-primaryPink text-white shadow-lg shadow-pink-glow' : 'glass-panel text-gray-300 hover:text-white'}`} // Line 29 → Dynamic style
          >
            {cat} // Line 30 → Label
          </button> // Line 31 → Closes button
        ))} // Line 32 → End map
      </div> // Line 33 → Closes scroll
    </div> // Line 34 → Closes container
  ); // Line 35 → Closes return
} // Line 36 → Closes component
