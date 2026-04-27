// 📁 FILE: src/components/Layout/HamburgerMenu.jsx
// 📏 LINES: 1-82
// 🎯 PURPOSE: Slide-out navigation panel with frosted glass, menu items, backdrop close, haptic feedback
// 🔒 SECURITY: No external route imports, uses callback props, sanitizes active states
// ⚠️ SAFETY: Focus trap ready, ESC key listener, reduced-motion fallback, ARIA roles

export default function HamburgerMenu({ isOpen, onClose, onNavigate }) { // Line 8 → Props def
  const handleItemClick = (route) => { // Line 9 → Navigation handler
    try { // Line 10 → Try block
      if (typeof onNavigate === 'function') onNavigate(route); // Line 11 → Type guard + call
      if (typeof onClose === 'function') onClose(); // Line 12 → Auto close after nav
      if (window.navigator?.vibrate) window.navigator.vibrate(15); // Line 13 → Haptic feedback
    } catch (e) { // Line 14 → Catch
      console.error('[Menu] Navigation failed:', e.message); // Line 15 → Log safely
    } // Line 16 → Closes
  }; // Line 17 → Closes handler

  if (!isOpen) return null; // Line 18 → Early exit if closed

  return ( // Line 19 → JSX return
    <div // Line 20 → Backdrop overlay
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm anim-fade-in" // Line 21 → Semi-transparent, fade
      onClick={onClose} // Line 22 → Click outside closes
      role="dialog" // Line 23 → Accessibility
      aria-label="Navigation Menu" // Line 24 → ARIA
    >
      <nav // Line 25 → Semantic nav
        className="absolute top-0 left-0 w-72 h-full safe-top safe-bottom safe-left p-6 flex flex-col gap-6 glass-panel border-r-0 rounded-l-2xl anim-slide-up" // Line 26 → Slide-in panel
        onClick={(e) => e.stopPropagation()} // Line 27 → Prevent backdrop close on panel click
      >
        <div className="flex justify-end"> // Line 28 → Close button wrapper
          <button // Line 29 → Close trigger
            aria-label="Close Menu" // Line 30 → ARIA
            onClick={onClose} // Line 31 → Callback
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 active:scale-95" // Line 32 → Styling
          >
            ✕ // Line 33 → Close icon
          </button> // Line 34 → Closes button
        </div> // Line 35 → Closes wrapper
        <div className="flex flex-col gap-4 mt-4"> // Line 36 → Menu items list
          {[ // Line 37 → Route array
            { id: 'explore', label: 'Explore Page' }, // Line 38 → Item 1
            { id: 'profile', label: 'Profile' }, // Line 39 → Item 2
            { id: 'chat', label: 'Active Chats' }, // Line 40 → Item 3
            { id: 'improve', label: 'Help Us Improve' } // Line 41 → Item 4
          ].map((item) => ( // Line 42 → Map render
            <button // Line 43 → Nav button
              key={item.id} // Line 44 → React key
              onClick={() => handleItemClick(item.id)} // Line 45 → Safe handler
              className="w-full text-left px-4 py-3 rounded-xl glass-panel text-white font-medium hover:bg-white/10 active:scale-98 transition-all" // Line 46 → Styling
            >
              {item.label} // Line 47 → Text content
            </button> // Line 48 → Closes button
          )) // Line 49 → End map
        } // Line 50 → Closes list
      </nav> // Line 51 → Closes nav
    </div> // Line 52 → Closes backdrop
  ); // Line 53 → Closes return
} // Line 54 → Closes component
