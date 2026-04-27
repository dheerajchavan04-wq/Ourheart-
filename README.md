# 🌙 OURHEART | Immersive Cinematic AI Sanctuary

> A high-fidelity, emotionally resonant AI anime character chat platform. Built with React, Supabase, Edge Functions, and Vercel.

## 📁 Project Structure
- `src/` → Frontend components, hooks, services, styles
- `supabase/` → Database migrations, Edge Functions (secure backend)
- `.env.production` → Frontend public vars (deployed to Vercel)
- `vite.config.js` / `tailwind.config.js` → Build & design system

## 🚀 Deployment Workflow (GitHub → Vercel)
1. **Push to GitHub**: Create repo, upload all files, verify `.gitignore` blocks secrets.
2. **Vercel Import**: Connect repo, select `Framework Preset: Vite`, set `Output Directory: dist`.
3. **Env Variables (Vercel Dashboard)**: Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_NAME`, `VITE_CHAT_ENDPOINT`.
4. **Supabase Setup**: Create project → Run `001_users.sql`, `002_characters.sql`, `003_chats.sql` in SQL Editor.
5. **Edge Functions**: Run `supabase login` → `supabase link --project-ref <ref>` → `supabase secrets set GROQ_API_KEY=... CEREBRAS_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=...` → `supabase functions deploy`.
6. **Test & Refine**: Open Vercel preview URL → Validate login, chat, tokens, animations → Pull to VS Code for tweaks → Push → Redeploy.

## 🔒 Security Architecture
- **Zero Frontend Keys**: AI providers live ONLY in Supabase Edge Functions (`Deno.env.get()`).
- **RLS Enforced**: Users access ONLY their own sessions/messages.
- **Rate Limiting**: Dual-provider rotation + exponential backoff + queue fallback.
- **Input Sanitization**: HTML stripping, token capping (75/150), strict regex validation.

## 🌐 SEO & GEO
- Static meta in `index.html`, dynamic routing via `seoMeta.js`
- Timezone-aware token resets, `hreflang` prep, IP-hashing (privacy-compliant)
- Lighthouse-optimized: Lazy video, WebP assets, `will-change` GPU animations

## 🛠️ Maintenance
- **Change API Keys**: `supabase secrets set GROQ_API_KEY=new_value`
- **Update DB Schema**: Edit `supabase/migrations/`, run in Supabase SQL Editor
- **Add Characters**: Use `/admin` UI or direct `ai_characters` table inserts
- **Logs**: Check `api_usage_logs` for token consumption & provider switching

## 📜 License & Terms
Proprietary project. All characters & narratives are fictional. 18+ only.
