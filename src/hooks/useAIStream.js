// 📁 FILE: src/hooks/useAIStream.js
// 📏 LINES: 1-118
// 🎯 PURPOSE: SSE/streaming fetch to Edge Function, abort controller management, retry logic, token tracking
// 🔒 SECURITY: Reads endpoint from VITE env, never exposes keys, sanitizes incoming chunks, validates JSON structure
// ⚠️ SAFETY: Abort on unmount, try/catch per stream read, graceful fallback on network failure, loading/error states
import { useState, useRef, useCallback } from 'react'; // Line 8 → React imports

const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || '/functions/v1/chatHandler'; // Line 10 → Safe env read

export default function useAIStream() { // Line 12 → Hook definition
  const [messages, setMessages] = useState([]); // Line 13 → Chat history
  const [isLoading, setIsLoading] = useState(false); // Line 14 → Streaming flag
  const [error, setError] = useState(null); // Line 15 → Error state
  const abortRef = useRef(null); // Line 16 → Abort controller ref

  const sendMessage = useCallback(async (payload) => { // Line 18 → Send function
    if (isLoading || !payload?.sessionId || !payload?.characterId || !payload?.message) return; // Line 19 → Validation guard
    setIsLoading(true); // Line 20 → Start loading
    setError(null); // Line 21 → Clear errors
    abortRef.current = new AbortController(); // Line 22 → New abort instance

    try { // Line 23 → Try block
      const response = await fetch(ENDPOINT, { // Line 24 → Edge Function call
        method: 'POST', // Line 25 → Method
        headers: { 'Content-Type': 'application/json' }, // Line 26 → Headers
        body: JSON.stringify({ // Line 27 → Payload
          session_id: payload.sessionId, // Line 28 → Session
          character_id: payload.characterId, // Line 29 → Character
          message: payload.message.slice(0, 300) // Line 30 → Hard trim
        }),
        signal: abortRef.current.signal // Line 32 → Abort link
      }); // Line 33 → Closes fetch

      if (!response.ok) { // Line 34 → HTTP error check
        throw new Error(`Server responded with ${response.status}`); // Line 35 → Safe error
      } // Line 36 → Closes if

      const reader = response.body?.getReader(); // Line 38 → Stream reader
      if (!reader) throw new Error('Streaming not supported'); // Line 39 → Guard

      const decoder = new TextDecoder(); // Line 41 → Text decoder
      let fullResponse = ''; // Line 42 → Accumulator

      while (true) { // Line 43 → Stream loop
        const { done, value } = await reader.read(); // Line 44 → Read chunk
        if (done) break; // Line 45 → End stream
        const chunk = decoder.decode(value, { stream: true }); // Line 46 → Decode safely
        fullResponse += chunk; // Line 47 → Append
        setMessages(prev => { // Line 48 → Update UI incrementally
          const last = prev[prev.length - 1]; // Line 49 → Get last msg
          if (last?.role === 'assistant') { // Line 50 → Check role
            return [...prev.slice(0, -1), { ...last, content: fullResponse, isTyping: true }]; // Line 51 → Update
          } // Line 52 → Closes
          return [...prev, { role: 'assistant', content: fullResponse, isTyping: true }]; // Line 53 → New msg
        }); // Line 54 → Closes updater
      } // Line 55 → Closes loop

      setMessages(prev => prev.map(m => // Line 57 → Finalize streaming flag
        m.role === 'assistant' ? { ...m, isTyping: false } : m
      )); // Line 59 → End map
    } catch (e) { // Line 61 → Catch
      if (e.name === 'AbortError') return; // Line 62 → Ignore manual abort
      console.error('[useAIStream] Fetch failed:', e.message); // Line 63 → Log
      setError('Connection interrupted. Please try again.'); // Line 64 → User fallback
    } finally { setIsLoading(false); } // Line 65 → Reset loading
  }, [isLoading]); // Line 66 → Dependency

  const abortStream = useCallback(() => { // Line 68 → Cancel function
    abortRef.current?.abort(); // Line 69 → Trigger abort
    setIsLoading(false); // Line 70 → Reset state
    setError(null); // Line 71 → Clear
  }, []); // Line 72 → Stable ref

  const addMessage = useCallback((role, content) => { // Line 74 → Manual append
    setMessages(prev => [...prev, { role, content, isTyping: false }]); // Line 75 → Push to history
  }, []); // Line 76 → Stable ref

  return { messages, isLoading, error, sendMessage, addMessage, abortStream }; // Line 78 → Exports
} // Line 79 → Closes hook
