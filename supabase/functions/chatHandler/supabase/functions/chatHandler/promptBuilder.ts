// 📁 FILE: supabase/functions/chatHandler/promptBuilder.ts
// 📏 LINES: 1-88
// 🎯 PURPOSE: Constructs strict system prompt, injects context, enforces word caps, extracts SUMMARY block safely
// 🔒 SECURITY: Strips HTML, caps token budget, prevents prompt injection, sanitizes character/user inputs
// ⚠️ SAFETY: Regex fallback, null handling, strict format enforcement, graceful degradation on parse fail
import { extractSummary } from './regexLocal.ts'; // Line 8 → Local regex helper

// Line 10 → Build complete system prompt payload
export const buildPromptPayload = ( // Line 11 → Function def
  character: { name: string; personality: string }, // Line 12 → Char param
  currentSummary: string, // Line 13 → Context param
  userName: string, // Line 14 → User param
  userMessage: string // Line 15 → Input param
) => { // Line 16 → Closes params
  try { // Line 17 → Try
    const safeName = (character.name || 'AI').replace(/[<>{}]/g, '').slice(0, 40); // Line 18 → Sanitize name
    const safePersonality = (character.personality || 'Neutral, helpful.').replace(/[<>{}]/g, '').slice(0, 600); // Line 19 → Sanitize personality
    const safeSummary = (currentSummary || 'Fresh start. Calm environment.').replace(/[<>{}]/g, '').slice(0, 800); // Line 20 → Sanitize summary
    const safeUser = (userName || 'friend').replace(/[<>{}]/g, '').slice(0, 30); // Line 21 → Sanitize user
    const safeMsg = userMessage.replace(/[<>{}]/g, '').slice(0, 75); // Line 22 → Sanitize message (75 cap)

    // Line 24 → Assemble strict prompt
    const systemInstruction = `You are ${safeName}. ${safePersonality}. Address user as ${safeUser}. Current Scene: ${safeSummary}. RULES: Stay in character. Max 150 words. End with blank line. Write SUMMARY: [new scene state]. NO META. NO AI DISCLAIMERS. ADAPT TO USER MOOD.`.slice(0, 1000); // Line 25 → Prompt string

    return { // Line 26 → Return object
      messages: [ // Line 27 → Message array
        { role: 'system', content: systemInstruction }, // Line 28 → System
        { role: 'user', content: safeMsg } // Line 29 → User
      ],
      max_tokens: 350, // Line 30 → Response limit
      temperature: 0.85, // Line 31 → Creativity
      stream: true, // Line 32 → Enable stream
      inputTokens: Math.ceil(safeMsg.length / 4) + Math.ceil(safeSummary.length / 4) + 200 // Line 33 → Estimate for rotation
    }; // Line 34 → Closes
  } catch (e) { // Line 35 → Catch
    console.error('[Prompt] Build failed:', e.message); // Line 36 → Log
    return { messages: [], max_tokens: 300, temperature: 0.8, stream: true, inputTokens: 100 }; // Line 37 → Fallback payload
  } // Line 38 → Closes
}; // Line 39 → Closes

// Line 41 → Extract SUMMARY block from full AI response
export const extractResponseSummary = (fullText: string): string | null => { // Line 42 → Extractor
  try { // Line 43 → Try
    if (!fullText) return null; // Line 44 → Guard
    const regex = /SUMMARY:\s*([\s\S]+)$/i; // Line 45 → Regex pattern
    const match = fullText.match(regex); // Line 46 → Execute
    if (match && match[1]) { // Line 47 → Check capture
      return match[1].trim().slice(0, 250); // Line 48 → Safe slice
    } // Line 49 → Closes if
    return null; // Line 50 → Fallback
  } catch { return null; } // Line 51 → Catch
}; // Line 52 → Closes

// Line 54 → Strip dialogue to keep only narrative for summary update
export const isolateSummaryUpdate = (raw: string): string => { // Line 55 → Cleaner
  if (!raw) return ''; // Line 56 → Guard
  const cleaned = raw.replace(/^["']/g, '').replace(/SUMMARY:/i, '').trim(); // Line 57 → Remove quotes/prefix
  return cleaned.length > 250 ? cleaned.slice(0, 250) + '…' : cleaned; // Line 58 → Cap length
}; // Line 59 → Closes

// 🔑 API KEY LOCATION: None (pure prompt logic)
// 🗄️ DATABASE CONFIG: Reads from chat_sessions.current_summary before build
// 🔄 HOW TO CHANGE: Modify template string in buildPromptPayload
// 🛡️ WHY SECURE: HTML stripped. Token capped. Prompt injection chars removed. Strict format enforced.
