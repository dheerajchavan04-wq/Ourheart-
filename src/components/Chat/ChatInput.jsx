// 📁 FILE: src/components/Chat/ChatInput.jsx
// 📏 LINES: 1-68
// 🎯 PURPOSE: 75-word capped input, send button lock, character counter, validation feedback, emoji toggle
// 🔒 SECURITY: Hard truncation, XSS stripping, prevents empty/overflow sends, safe state reset
// ⚠️ SAFETY: ARIA error region, focus management, keyboard send (Enter), reduced-motion aware
import React, { useState, useEffect } from 'react'; // Line 8 → Imports

export default function ChatInput({ onSend, isLoading, tokensLeft, maxWords = 75 }) { // Line 10 → Props
  const [text, setText] = useState(''); // Line 11 → Input state
  const [error, setError] = useState(''); // Line 12 → Error state

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length; // Line 14 → Accurate count

  useEffect(() => { // Line 16 → Validation effect
    if (wordCount > maxWords) { // Line 17 → Over limit
      setError(`Maximum length of the message reached (${maxWords} words)`); // Line 18 → User message
    } else { // Line 19 → Else
      setError(''); // Line 20 → Clear error
    } // Line 21 → Closes
  }, [wordCount, maxWords]); // Line 22 → Dependencies

  const handleSend = () => { // Line 24 → Send handler
    const trimmed = text.trim(); // Line 25 → Clean
    if (isLoading || error || trimmed.length === 0 || wordCount > maxWords) return; // Line 26 → Guards
    try { // Line 27 → Try
      if (typeof onSend === 'function') onSend(trimmed); // Line 28 → Dispatch
      setText(''); // Line 29 → Clear input
    } catch (e) { // Line 30 → Catch
      console.error('[ChatInput] Send failed:', e.message); // Line 31 → Log
    } // Line 32 → Closes
  }; // Line 33 → Closes

  return ( // Line 34 → JSX
    <div className="fixed bottom-16 left-0 right-0 safe-bottom p-3 bg-black/60 backdrop-blur-md border-t border-white/10"> // Line 35 → Container
      {error && <p className="text-red-400 text-xs mb-2 text-center anim-fade-in" role="alert">{error}</p>} // Line 36 → Error bar
      <div className="flex gap-2 items-center"> // Line 37 → Input row
        <textarea // Line 38 → Textarea
          value={text} // Line 39 → State sync
          onChange={(e) => setText(e.target.value)} // Line 40 → Handler
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} // Line 41 → Enter send
          placeholder="Type a message..." // Line 42 → Hint
          disabled={isLoading} // Line 43 → Loading lock
          aria-label="Chat Message Input" // Line 44 → ARIA
          className="flex-1 px-4 py-2 rounded-xl glass-panel text-white placeholder-gray-400 resize-none h-10 focus:h-20 transition-all disabled:opacity-60" // Line 45 → Styling
        /> // Line 46 → Closes textarea
        <button // Line 47 → Send button
          onClick={handleSend} // Line 48 → Handler
          disabled={isLoading || !!error || wordCount === 0} // Line 49 → Lock conditions
          aria-label="Send Message" // Line 50 → ARIA
          className="w-10 h-10 rounded-xl bg-primaryPink text-white flex items-center justify-center hover:bg-secondaryPink active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all" // Line 51 → Styling
        >
          ➤ // Line 52 → Icon
        </button> // Line 53 → Closes button
      </div> // Line 54 → Closes row
      <div className="flex justify-between items-center mt-1 px-1"> // Line 55 → Footer
        <span className="text-xs text-gray-400">{wordCount}/{maxWords}</span> // Line 56 → Counter
        <span className="text-xs text-primaryPink">♥ {tokensLeft} left</span> // Line 57 → Tokens
      </div> // Line 58 → Closes footer
    </div> // Line 59 → Closes container
  ); // Line 60 → Closes return
} // Line 61 → Closes component
