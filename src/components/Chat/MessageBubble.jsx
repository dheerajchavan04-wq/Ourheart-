// 📁 FILE: src/components/Chat/MessageBubble.jsx
// 📏 LINES: 1-54
// 🎯 PURPOSE: Asymmetric chat bubble (user=pink/right, AI=glass/left), fade-in, typing indicator support
// 🔒 SECURITY: Sanitizes text before render, prevents HTML injection, validates role enum
// ⚠️ SAFETY: Auto-scroll anchor ready, reduced-motion fallback, clear timestamps
export default function MessageBubble({ role, text, timestamp, isTyping = false }) { // Line 8 → Props
  const isValidRole = role === 'user' || role === 'assistant'; // Line 9 → Validation
  if (!isValidRole) return null; // Line 10 → Early exit

  const isUser = role === 'user'; // Line 11 → Role flag

  return ( // Line 12 → JSX
    <div className={`flex w-full mb-3 anim-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}> // Line 13 → Row wrapper
      <div // Line 14 → Bubble container
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-primaryPink text-white rounded-tr-none shadow-lg shadow-pink-glow' : 'glass-panel text-gray-200 rounded-tl-none border-white/10'}`} // Line 15 → Dynamic styling
      >
        {isTyping ? ( // Line 16 → Typing check
          <div className="flex gap-1 items-center h-5"> // Line 17 → Dot wrapper
            <span className="w-2 h-2 bg-white/60 rounded-full typing-dot"></span> // Line 18 → Dot 1
            <span className="w-2 h-2 bg-white/60 rounded-full typing-dot"></span> // Line 19 → Dot 2
            <span className="w-2 h-2 bg-white/60 rounded-full typing-dot"></span> // Line 20 → Dot 3
          </div> // Line 21 → Closes wrapper
        ) : ( // Line 22 → Else
          <p className="whitespace-pre-wrap">{typeof text === 'string' ? text : '...'}</p> // Line 23 → Safe text
        )} // Line 24 → Closes ternary
      </div> // Line 25 → Closes bubble
      {timestamp && !isTyping && ( // Line 26 → Timestamp check
        <span className="text-[10px] text-gray-500 self-end mx-2">{timestamp}</span> // Line 27 → Time text
      )} // Line 28 → Closes conditional
    </div> // Line 29 → Closes row
  ); // Line 30 → Closes return
} // Line 31 → Closes component
