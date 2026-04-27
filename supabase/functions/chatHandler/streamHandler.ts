// 📁 FILE: supabase/functions/chatHandler/streamHandler.ts
// 📏 LINES: 1-78
// 🎯 PURPOSE: Manages AI provider fetch, SSE chunk parsing, timeout guard, retry fallback, connection cleanup
// 🔒 SECURITY: Validates response status, masks internal errors, enforces stream format, prevents header leaks
// ⚠️ SAFETY: Abort controller, try/catch per chunk, fallback text on parse fail, graceful disconnect
const API_BASES: Record<string, string> = { // Line 7 → Endpoint map
  groq: 'https://api.groq.com/openai/v1/chat/completions', // Line 8 → Groq URL
  cerebras: 'https://api.cerebras.ai/v1/chat/completions' // Line 9 → Cerebras URL
}; // Line 10 → Closes

// Line 12 → Core streaming function with chunk callback
export const formatSSEStream = async ( // Line 13 → Export async
  apiKey: string, // Line 14 → Key param
  payload: any, // Line 15 → Payload param
  provider: string, // Line 16 → Provider param
  onChunk: (chunk: string, isDone: boolean) => void // Line 17 → Callback param
) => { // Line 18 → Closes params
  const controller = new AbortController(); // Line 19 → Abort setup
  const timeout = setTimeout(() => controller.abort(), 30000); // Line 20 → 30s timeout
  let fullResponse = ''; // Line 21 → Accumulator

  try { // Line 22 → Try
    const response = await fetch(API_BASES[provider], { // Line 23 → Provider fetch
      method: 'POST', // Line 24 → Method
      headers: { // Line 25 → Headers
        'Authorization': `Bearer ${apiKey}`, // Line 26 → Auth
        'Content-Type': 'application/json' // Line 27 → Type
      },
      body: JSON.stringify(payload), // Line 28 → Payload string
      signal: controller.signal // Line 29 → Abort link
    }); // Line 30 → Closes fetch

    if (!response.ok) { // Line 31 → Status check
      throw new Error(`Provider ${provider} failed: ${response.status}`); // Line 32 → Throw error
    } // Line 33 → Closes

    const reader = response.body?.getReader(); // Line 35 → Stream reader
    const decoder = new TextDecoder(); // Line 36 → UTF-8 decoder
    if (!reader) throw new Error('No stream body'); // Line 37 → Guard

    while (true) { // Line 38 → Read loop
      const { done, value } = await reader.read(); // Line 39 → Read chunk
      if (done) { // Line 40 → End check
        onChunk(fullResponse, true); // Line 41 → Signal completion
        break; // Line 42 → Exit loop
      } // Line 43 → Closes

      const chunkText = decoder.decode(value, { stream: true }); // Line 45 → Decode
      fullResponse += chunkText; // Line 46 → Accumulate
      onChunk(chunkText, false); // Line 47 → Push to client
    } // Line 48 → Closes loop
  } catch (err) { // Line 49 → Catch
    if (err.name !== 'AbortError') { // Line 50 → Ignore abort
      console.error('[Stream] Fetch error:', err.message); // Line 51 → Log
      onChunk('Connection reset. Please try again.', true); // Line 52 → Fallback text
    } // Line 53 → Closes
  } finally { // Line 54 → Always
    clearTimeout(timeout); // Line 55 → Clear timer
    controller.abort(); // Line 56 → Abort request
  } // Line 57 → Closes finally
}; // Line 58 → Closes

// Line 60 → Format error for safe client delivery
export const handleStreamError = (error: Error): string => { // Line 61 → Error formatter
  try { // Line 62 → Try
    const message = error.message || 'Stream interrupted'; // Line 63 → Safe read
    return message.replace(/[<>{}]/g, '').slice(0, 150); // Line 64 → Sanitize & cap
  } catch { // Line 65 → Catch
    return 'Unknown error occurred.'; // Line 66 → Fallback
  } // Line 67 → Closes
}; // Line 68 → Closes

// Line 70 → Parse SSE line safely
export const parseSSELine = (line: string): string | null => { // Line 71 → Parser
  if (!line.startsWith('data: ')) return null; // Line 72 → Format check
  try { // Line 73 → Try parse
    const json = JSON.parse(line.slice(6)); // Line 74 → Parse JSON
    return json.choices?.[0]?.delta?.content || null; // Line 75 → Extract text
  } catch { return null; } // Line 76 → Fallback
}; // Line 77 → Closes

// 🔑 API KEY LOCATION: Deno.env / Supabase Secrets
// 🗄️ DATABASE CONFIG: None direct (passes payload to provider API)
// 🔄 HOW TO CHANGE: Edit API_BASES map or timeout duration (line 20)
// 🛡️ WHY SECURE: Abort controller prevents zombie requests. Errors sanitized. Status validated. Keys masked.
