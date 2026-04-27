// 📁 FILE: src/services/groqService.js
// 📏 LINES: 1-68
// 🎯 PURPOSE: Groq-style prompt payload formatter, token estimation, client-side validation before Edge Function send
// 🔒 SECURITY: Never stores/reads API keys, hard-caps payloads, sanitizes inputs, prevents injection
// ⚠️ SAFETY: Try/catch wrappers, fallback defaults, strict type checks, graceful degradation
import { estimateTokens, truncateToWords } from '../utils/tokenCounter'; // Line 8 → Import utils
import { stripHTML, sanitizeForAI } from '../utils/regexExtractors'; // Line 9 → Import sanitizers

const MODEL_NAME = 'meta-llama/llama-4-scout-17b-16e-instruct'; // Line 11 → Target model
const MAX_PROMPT_TOKENS = 2500; // Line 12 → Frontend limit

// Line 14 → Build Groq-compatible payload for Edge Function
export const buildGroqPayload = ({ character, userMessage, summary, userName }) => { // Line 15 → Payload builder
  try { // Line 16 → Try block
    const safeMsg = stripHTML(sanitizeForAI(userMessage)); // Line 17 → Sanitize user input
    const safeSummary = stripHTML(sanitizeForAI(summary || '')); // Line 18 → Sanitize summary
    const safeName = stripHTML(userName || 'friend'); // Line 19 → Sanitize name
    const safeCharName = stripHTML(character?.name || 'Unknown'); // Line 20 → Sanitize char
    const safePersonality = stripHTML(sanitizeForAI(character?.personality || '')); // Line 21 → Sanitize traits

    const systemPrompt = `Roleplay as ${safeCharName}. Personality: ${safePersonality}. User: ${safeName}. Summary: ${safeSummary}`.slice(0, 1500); // Line 22 → Compose & trim
    const userPrompt = safeMsg.slice(0, 300); // Line 23 → Cap message

    const totalTokens = estimateTokens(systemPrompt) + estimateTokens(userPrompt); // Line 24 → Estimate
    if (totalTokens > MAX_PROMPT_TOKENS) { // Line 25 → Over limit check
      throw new Error('Prompt exceeds token budget'); // Line 26 → Safe error
    } // Line 27 → Closes

    return { // Line 28 → Return payload
      model: MODEL_NAME, // Line 29 → Model identifier
      messages: [ // Line 30 → Message array
        { role: 'system', content: systemPrompt }, // Line 31 → System instruction
        { role: 'user', content: userPrompt } // Line 32 → User input
      ],
      max_tokens: 450, // Line 34 → Response cap
      temperature: 0.85, // Line 35 → Creativity level
      stream: true // Line 36 → Enable SSE
    }; // Line 37 → Closes object
  } catch (e) { // Line 38 → Catch
    console.error('[GroqService] Payload build failed:', e.message); // Line 39 → Log
    return null; // Line 40 → Return null to block send
  } // Line 41 → Closes
}; // Line 42 → Closes

// Line 44 → Parse streaming chunk safely
export const parseStreamChunk = (chunk) => { // Line 45 → Chunk parser
  try { // Line 46 → Try
    const lines = chunk.split('\n'); // Line 47 → Split lines
    let text = ''; // Line 48 → Accumulator
    for (const line of lines) { // Line 49 → Iterate
      if (line.startsWith('data: ')) { // Line 50 → SSE format
        const jsonStr = line.slice(6); // Line 51 → Remove prefix
        if (jsonStr === '[DONE]') break; // Line 52 → End signal
        const parsed = JSON.parse(jsonStr); // Line 53 → Parse JSON
        text += parsed.choices?.[0]?.delta?.content || ''; // Line 54 → Extract delta
      } // Line 55 → Closes if
    } // Line 56 → End loop
    return text.trim(); // Line 57 → Return clean
  } catch { return ''; } // Line 58 → Fallback empty
}; // Line 59 → Closes

// Line 61 → Validate payload structure before send
export const isValidPayload = (payload) => { // Line 62 → Validator
  return payload && // Line 63 → Exists
    typeof payload.model === 'string' && // Line 64 → Model string
    Array.isArray(payload.messages) && // Line 65 → Messages array
    payload.messages.length === 2; // Line 66 → Exactly 2 roles
}; // Line 67 → Closes
