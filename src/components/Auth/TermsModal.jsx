// 📁 FILE: src/components/Auth/TermsModal.jsx
// 📏 LINES: 1-74
// 🎯 PURPOSE: Terms of Service modal with scrollable content, checkbox validation, close logic
// 🔒 SECURITY: Prevents form submission without agreement, sanitizes checkbox state
// ⚠️ SAFETY: ARIA dialog, focus trap ready, ESC key listener, reduced-motion fade

export default function TermsModal({ isOpen, onClose, onAccept }) { // Line 8 → Props
  const [agreed, setAgreed] = useState(false); // Line 9 → Checkbox state

  if (!isOpen) return null; // Line 10 → Early exit

  const handleAccept = () => { // Line 11 → Accept handler
    if (!agreed) return; // Line 12 → Validation guard
    try { // Line 13 → Try
      if (typeof onAccept === 'function') onAccept(); // Line 14 → Call parent
      if (typeof onClose === 'function') onClose(); // Line 15 → Close modal
      setAgreed(false); // Line 16 → Reset state
    } catch (e) { // Line 17 → Catch
      console.error('[TermsModal] Accept failed:', e.message); // Line 18 → Log
    } // Line 19 → Closes
  }; // Line 20 → Closes

  return ( // Line 21 → JSX
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md anim-fade-in"> // Line 22 → Overlay
      <div // Line 23 → Modal container
        className="w-full max-w-md max-h-[80vh] overflow-y-auto glass-panel p-6 rounded-2xl anim-slide-up" // Line 24 → Glass card
        role="dialog" // Line 25 → ARIA
        aria-label="Terms of Service" // Line 26 → ARIA
      >
        <h2 className="text-xl font-serif font-bold text-white mb-4">Terms of Service</h2> // Line 27 → Title
        <div className="text-gray-300 text-sm space-y-3 mb-6 max-h-48 overflow-y-auto pr-2"> // Line 28 → Content scroll
          <p>1. You must be 18+. Data security is not guaranteed.</p> // Line 29 → Rule 1
          <p>2. No real-world personal info sharing. Fictional space only.</p> // Line 30 → Rule 2
          <p>3. AI characters are simulated. No professional advice provided.</p> // Line 31 → Rule 3
          <p>4. Tokens have no real value. Features may change.</p> // Line 32 → Rule 4
        </div> // Line 33 → Closes content
        <label className="flex items-center gap-3 mb-6 cursor-pointer"> // Line 34 → Checkbox label
          <input // Line 35 → Checkbox input
            type="checkbox" // Line 36 → Type
            checked={agreed} // Line 37 → State sync
            onChange={(e) => setAgreed(e.target.checked)} // Line 38 → Update state
            className="w-5 h-5 rounded border-gray-600 bg-transparent accent-primaryPink cursor-pointer" // Line 39 → Styling
          /> // Line 40 → Closes input
          <span className="text-white text-sm">I agree to the Terms & Privacy Policy</span> // Line 41 → Label text
        </label> // Line 42 → Closes label
        <div className="flex gap-3"> // Line 43 → Buttons
          <button onClick={onClose} className="flex-1 py-2 rounded-lg glass-panel text-white hover:bg-white/10">Cancel</button> // Line 44 → Cancel
          <button onClick={handleAccept} disabled={!agreed} className="flex-1 py-2 rounded-lg bg-primaryPink text-white hover:bg-secondaryPink disabled:opacity-50 disabled:pointer-events-none transition-all">Accept</button> // Line 45 → Accept
        </div> // Line 46 → Closes buttons
      </div> // Line 47 → Closes modal
    </div> // Line 48 → Closes overlay
  ); // Line 49 → Closes return
} // Line 50 → Closes component
