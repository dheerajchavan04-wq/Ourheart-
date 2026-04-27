# 📜 OURHEART FULL DOCUMENTATION & CONFIGURATION MAP

## 🔑 API KEY LOCATIONS & ROTATION
| Provider | Where it lives | How to change | Why secure |
|----------|----------------|---------------|------------|
| Groq | `supabase/functions/chatHandler/keyRotation.ts` reads `Deno.env.get('GROQ_API_KEY')` | `supabase secrets set GROQ_API_KEY=sk-...` | Never bundled. Server-only env. In-memory tracking. Auto-fallback. |
| Cerebras | `supabase/functions/chatHandler/keyRotation.ts` reads `Deno.env.get('CEREBRAS_API_KEY')` | `supabase secrets set CEREBRAS_API_KEY=cs-...` | Same as above. Dual-tank rotation prevents 429 deadlocks. |
| Supabase Service Role | `supabase/functions/adminTools/validate.ts` & `manage.ts` | `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...` | Restricted to Edge Functions. Bypasses RLS ONLY for admin endpoints. |

## 🗄️ DATABASE CONFIG & SCHEMA MAP
| Table | Purpose | Key Columns | RLS Policy |
|-------|---------|-------------|------------|
| `user_profiles` | Extends auth.users | `id`, `email`, `display_name`, `tokens`, `role`, `banned` | `auth.uid() = id` for read/update. Admin bypass via Service Role. |
| `ai_characters` | Character catalog | `id`, `name`, `personality`, `avatar_url`, `tags` | Public read. Admin write. RLS: `enable_row_level_security()` |
| `chat_sessions` | Conversation state | `id`, `user_id`, `character_id`, `current_summary`, `updated_at` | `user_id = auth.uid()`. Unique constraint per user+character. |
| `chat_messages` | Message history | `id`, `session_id`, `role`, `content`, `summary_snapshot` | `session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())` |
| `api_usage_logs` | Analytics | `id`, `provider`, `request_time`, `tokens_in`, `tokens_out` | Public insert via Edge Function. No user PII stored. |

## 🔄 HOW TO MODIFY CORE SYSTEMS
1. **Change AI Provider Limits**: Edit `TRACKERS` object in `supabase/functions/chatHandler/keyRotation.ts` (lines 17-19).
2. **Update Prompt Format**: Modify `buildPromptPayload` in `supabase/functions/chatHandler/promptBuilder.ts` (line 24). Keep `SUMMARY:` tag intact.
3. **Add New Categories/Tags**: Insert into `ai_characters` table or edit `CategoryTabs.jsx` category array.
4. **Adjust Token Costs**: Edit `calculateCost` in `src/hooks/useHeartTokens.js` (lines 64-67).
5. **Change SEO Defaults**: Update `initDefaultSEO` in `src/utils/seoMeta.js` (lines 82-85).

## 🛡️ SECURITY & SAFETY CHECKLIST (45% BUFFER DISTRIBUTION)
✅ `.gitignore` blocks `.env`, `node_modules`, `dist`, `.vercel`
✅ Vite strips non-`VITE_` vars. `vercel.json` enforces SPA routing & HTTPS headers
✅ Edge Functions use `Deno.env.get()` exclusively. Zero key leakage to browser
✅ RLS policies enforce user isolation. Service Role isolated to admin endpoints
✅ Input sanitization: `stripHTML()`, `sanitizeForAI()`, 75/150 word caps, token estimation
✅ Error boundaries: `try/catch` on every async call, fallback UIs, `prefers-reduced-motion` respect
✅ Rate limiting: Dual-provider rotation, exponential backoff, 30s timeout, queue overflow protection
✅ Accessibility: ARIA roles/labels, keyboard nav traps, screen-reader live regions, high-contrast support
✅ Documentation: Line-by-line comments on every file, function, variable, config, and security decision

## 📦 DEPLOYMENT VERIFICATION STEPS
1. Run `npm run build` → Verify `dist/` contains NO `.env` or key strings
2. Push to GitHub → Connect Vercel → Add frontend `VITE_` vars
3. Deploy Edge Functions → `supabase functions deploy` → Verify logs show `Deno.env` read
4. Test Login → Verify Google OAuth redirects to Vercel URL
5. Test Chat → Verify SSE stream, token deduction, summary persistence
6. Audit Network → Confirm `/functions/v1/chatHandler` calls succeed, AI keys never appear in DevTools

> This project is engineered for production security, cinematic performance, and emotional immersion. Every line is documented, every edge case handled, every key isolated.
