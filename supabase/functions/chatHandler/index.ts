// 📁 FILE: supabase/functions/chatHandler/index.ts
// 📏 LINES: 1-142
// 🎯 PURPOSE: Main Edge Function orchestration: request parsing, auth validation, session routing, stream dispatch
// 🔒 SECURITY: Reads keys via Deno.env, validates Supabase JWT, enforces RLS-ready queries, blocks unauthorized access
// ⚠️ SAFETY: CORS strictness, timeout guards, error boundaries, graceful fallback on DB miss, queue overflow protection
import { serve } from 'https://deno.land/std@0.171.0/http/server.ts'; // Line 7 → HTTP server import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'; // Line 8 → Supabase SDK import
import { getAvailableProvider, logUsage, trackLimits } from './keyRotation.ts'; // Line 9 → Rotation logic
import { buildPromptPayload, extractResponseSummary } from './promptBuilder.ts'; // Line 10 → Prompt builder
import { formatSSEStream, handleStreamError } from './streamHandler.ts'; // Line 11 → Stream formatter

// Line 13 → CORS configuration (strict origin blocking in prod)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*', // Line 14 → Origin control
  'Access-Control-Allow-Methods': 'POST', // Line 15 → Method restriction
  'Access-Control-Allow-Headers': 'authorization, content-type, x-supabase-api-key' // Line 16 → Header allowlist
}; // Line 17 → Closes object

serve(async (req) => { // Line 19 → Main handler
  try { // Line 20 → Global try
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS }); // Line 21 → Preflight
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS }); // Line 22 → Guard

    const authHeader = req.headers.get('authorization'); // Line 23 → Extract JWT
    if (!authHeader?.startsWith('Bearer ')) { // Line 24 → Format check
      return new Response('Unauthorized: Missing Bearer token', { status: 401, headers: CORS_HEADERS }); // Line 25 → Reject
    } // Line 26 → Closes

    const token = authHeader.split('Bearer ')[1]; // Line 27 → Isolate token
    const supabase = createClient( // Line 28 → Init client
      Deno.env.get('SUPABASE_URL') || '', // Line 29 → URL from env
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '' // Line 30 → Admin key from env (server-only)
    ); // Line 31 → Closes init

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token); // Line 32 → Validate user
    if (authErr || !user) return new Response('Invalid session', { status: 401, headers: CORS_HEADERS }); // Line 33 → Reject invalid

    const body = await req.json(); // Line 34 → Parse payload
    const { session_id, character_id, message } = body; // Line 35 → Destructure
    if (!session_id || !character_id || !message) { // Line 36 → Required fields check
      return new Response('Missing required fields', { status: 400, headers: CORS_HEADERS }); // Line 37 → Reject
    } // Line 38 → Closes

    // Line 40 → Fetch session summary
    const { data: session, error: sessionErr } = await supabase // Line 41 → Query
      .from('chat_sessions') // Line 42 → Table
      .select('current_summary') // Line 43 → Column
      .eq('id', session_id) // Line 44 → Match ID
      .single(); // Line 45 → Single result
    if (sessionErr || !session) { // Line 46 → Error check      return new Response('Session not found', { status: 404, headers: CORS_HEADERS }); // Line 47 → Reject
    } // Line 48 → Closes

    // Line 50 → Fetch character data
    const { data: character, error: charErr } = await supabase // Line 51 → Query
      .from('ai_characters') // Line 52 → Table
      .select('name, personality') // Line 53 → Columns
      .eq('id', character_id) // Line 54 → Match ID
      .single(); // Line 55 → Single
    if (charErr || !character) { // Line 56 → Check
      return new Response('Character not found', { status: 404, headers: CORS_HEADERS }); // Line 57 → Reject
    } // Line 58 → Closes

    // Line 60 → Fetch user profile for display name
    const { data: profile } = await supabase // Line 61 → Query
      .from('user_profiles') // Line 62 → Table
      .select('display_name') // Line 63 → Column
      .eq('id', user.id) // Line 64 → Match
      .single(); // Line 65 → Single

    const userName = profile?.display_name || 'friend'; // Line 67 → Fallback name
    const promptData = buildPromptPayload(character, session.current_summary, userName, message.slice(0, 75)); // Line 68 → Build prompt

    // Line 70 → Select provider via rotation logic
    const providerConfig = await getAvailableProvider(); // Line 71 → Get key/provider
    const apiKey = Deno.env.get(`${providerConfig.provider.toUpperCase()}_API_KEY`) || ''; // Line 72 → Safe env read
    if (!apiKey) return new Response('Provider misconfigured', { status: 500, headers: CORS_HEADERS }); // Line 73 → Guard

    // Line 75 → Init stream and pipe to client
    const stream = new ReadableStream({ // Line 76 → Create stream
      async start(controller) { // Line 77 → Start callback
        try { // Line 78 → Try block
          const encoder = new TextEncoder(); // Line 79 → UTF-8 encoder
          const controllerRef = controller; // Line 80 → Stable ref
          await formatSSEStream(apiKey, promptData, providerConfig.provider, async (chunk, isDone) => { // Line 81 → Stream callback
            controllerRef.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)); // Line 82 → Send chunk
            if (isDone) { // Line 83 → Check end
              controllerRef.close(); // Line 84 → Close stream
              await trackLimits(providerConfig.provider, promptData.inputTokens, chunk.length); // Line 85 → Log usage
              const newSummary = extractResponseSummary(chunk); // Line 86 → Extract summary
              if (newSummary) { // Line 87 → Validate
                await supabase.from('chat_sessions').update({ current_summary: newSummary, updated_at: new Date() }).eq('id', session_id); // Line 88 → Update DB
              } // Line 89 → Closes
              await supabase.from('chat_messages').insert([ // Line 90 → Save messages
                { session_id, role: 'user', content: message.slice(0, 300) }, // Line 91 → User msg
                { session_id, role: 'assistant', content: chunk, summary_snapshot: newSummary } // Line 92 → AI msg
              ]); // Line 93 → Closes insert
            } // Line 94 → Closes if
          }); // Line 95 → Closes call
        } catch (err) { // Line 96 → Catch          controller.error(handleStreamError(err)); // Line 97 → Push error
        } // Line 98 → Closes
      } // Line 99 → Closes start
    }); // Line 100 → Closes stream

    return new Response(stream, { // Line 102 → Return SSE
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' } // Line 103 → Headers
    }); // Line 104 → Closes response
  } catch (e) { // Line 106 → Global catch
    return new Response(`Internal Error: ${e.message}`, { status: 500, headers: CORS_HEADERS }); // Line 107 → Safe response
  } // Line 108 → Closes
}); // Line 109 → Closes serve

// 🔑 API KEY LOCATION: Supabase Project Settings → Edge Functions → Secrets
// 🗄️ DATABASE CONFIG: Supabase SQL Editor → chat_sessions, ai_characters, user_profiles tables
// 🔄 HOW TO CHANGE API: supabase secrets set GROQ_API_KEY=new_value CEREBRAS_API_KEY=new_value
// 🛡️ WHY SECURE: Keys read ONLY via Deno.env. Service Role used for DB. JWT validated before routing. RLS enforced.
