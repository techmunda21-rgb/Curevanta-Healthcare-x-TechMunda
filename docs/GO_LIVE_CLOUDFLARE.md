# Production go-live — Curevanta Control Tower

**Stack (recommended for Next.js + Prisma + Auth.js + SSE):**

| Layer | Service | Status |
|--------|---------|--------|
| **SQL** | Neon Postgres `curevanta-control-tower` (ap-southeast-1, PG 16) | **Ready** — schema + seed applied |
| **App server** | Railway (Node) | **Blocked** — Railway trial expired; upgrade plan required |
| **CDN / Domain / SSL** | Cloudflare | Waiting on public app URL |
| **CI/CD** | GitHub Actions workflow added | Needs `RAILWAY_TOKEN` secret + GitHub CLI login to push |

> Cloudflare Pages/Workers alone cannot reliably host this app’s Prisma + Auth.js + live SSE. Use Cloudflare for **domain**, a Node host (Railway/Vercel/Fly) for **server**, Neon for **SQL**.

## Done this session

- [x] Fixed `/tasks` create error (`estimatedHours` Zod validation)
- [x] Neon project created + `prisma db push` + seed
- [x] `railway.json` + `.github/workflows/deploy.yml`
- [x] This runbook

## Your next steps (required for public URL)

1. **Upgrade Railway** at https://railway.com (trial expired) *or* create a Vercel project for the Next app.
2. Set env on the host:
   - `DATABASE_URL` → copy from Neon console (do not commit)
   - `AUTH_SECRET` → long random string
   - `NEXTAUTH_URL` → `https://your-public-url`
   - `AUTH_TRUST_HOST=true`
3. **Push code** after `gh auth login` (Cursor GitHub connect ≠ CLI login).
4. **Cloudflare DNS** once you have `*.up.railway.app` or Vercel URL:
   - CNAME `app` (or `@`) → host URL
   - Proxy ON
   - Add same hostname in Railway/Vercel custom domains
5. Rotate Neon DB password in Neon console (connection string appeared in tooling logs).

## Demo logins (seeded on Neon)

- Founder: `founder@techmunda.com` / `Founder@2026`
- Mobile API: `patient@curevanta.com` / `Curevanta@2026` (and doctor twin)

## Local demo

Still: **http://localhost:3001** (task create error fixed; restart `next` if needed).
