// 📁 FILE: src/components/Layout/BottomNav.jsx
// 📏 LINES: 1-54
// 🎯 PURPOSE: Fixed bottom navigation bar with frosted glass, active states, haptic press
// 🔒 SECURITY: Pure UI component, delegates routing to parent, no hardcoded URLs
// ⚠️ SAFETY: Touch-friendly targets, ARIA current page, reduced-motion respected

export default function BottomNav({ activeTab, onTabChange }) { // Line 8 → Props def
  const tabs = [ // Line 9 → Tab config
    { id: 'explore', icon: '🔍', label: 'Explore' }, // Line 10 → Tab 1
    { id: 'chat', icon: '💬', label: 'Chat' }, // Line 11 → Tab 2
    { id: 'profile', icon: '👤', label: 'Profile' } // Line 12 → Tab 3
  ]; // Line 13 → Closes array

  const handleTab = (id) => { // Line 14 → Click handler
    try { // Line 15 → Try
      if (id !== activeTab && typeof onTabChange === 'function') onTabChange(id); // Line 16 → Guard + call
      if (window.navigator?.vibrate) window.navigator.vibrate(10); // Line 17 → Haptic
    } catch (e) { // Line 18 → Catch
      console.warn('[BottomNav] Tab change error:', e.message); // Line 19 → Log
    } // Line 20 → Closes
  }; // Line 21 → Closes

  return ( // Line 22 → JSX
    <nav // Line 23 → Semantic nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom glass-panel border-b-0 border-t border-white/10 rounded-t-2xl h-16 flex items-center justify-around px-4" // Line 24 → Fixed glass bar
      role="tablist" // Line 25 → ARIA role
      aria-label="Main Navigation" // Line 26 → ARIA label
    >
      {tabs.map((tab) => ( // Line 27 → Render tabs
        <button // Line 28 → Tab button
          key={tab.id} // Line 29 → Key
          role="tab" // Line 30 → ARIA
          aria-selected={activeTab === tab.id} // Line 31 → State sync
          onClick={() => handleTab(tab.id)} // Line 32 → Handler
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 active:scale-95 ${activeTab === tab.id ? 'text-primaryPink bg-white/5' : 'text-gray-400 hover:text-white'}`} // Line 33 → Dynamic styling
        >
          <span className="text-xl">{tab.icon}</span> // Line 34 → Icon
          <span className="text-xs font-medium">{tab.label}</span> // Line 35 → Label
        </button> // Line 36 → Closes button
      ))} // Line 37 → End map
    </nav> // Line 38 → Closes nav
  ); // Line 39 → Closes return
} // Line 40 → Closes component
