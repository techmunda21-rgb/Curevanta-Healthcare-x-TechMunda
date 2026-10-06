# Curevanta × TechMunda — Control Tower & Mobile

Production-oriented monorepo for **Curevanta healthcare** ops CRM, consumer web shells, Flutter portals, and Expo React Native apps.

## Repository structure

```text
curevanta-control-tower/
├── src/                      # Next.js Control Tower + patient/doctor web demos
│   ├── app/                  # App Router (ops CRM, auth, APIs)
│   │   └── api/mobile/       # Mobile booking vertical-slice API
│   ├── lib/mobile/           # Mobile auth/booking helpers
│   ├── server/               # Domain services (tasks, dashboard, …)
│   └── theme/                # Design tokens (web)
├── prisma/                   # PostgreSQL schema + seed
├── apps/
│   ├── patient-mobile/       # Expo (React Native) patient app
│   ├── doctor-mobile/        # Reserved (README)
│   └── career-mobile/        # Reserved (README)
├── packages/
│   ├── design-tokens/        # Shared Curevanta tokens
│   ├── mobile-ui/            # RN UI primitives
│   ├── api-client/           # Typed mobile API client
│   ├── auth/                 # SecureStore token helpers
│   ├── config/ types/ validation/
├── mobile/                   # Flutter 3-portal app (Patient / Doctor / Ops)
├── docs/                     # Migration, go-live, store checklists
├── .github/workflows/        # CI/CD (Railway deploy when token set)
├── docker-compose.yml        # Local Postgres
├── railway.json              # Railway build/start
└── package.json              # npm workspaces root
```

## Quick start — Control Tower (Next.js)

```bash
docker compose up -d
npm install
npx prisma db push
npm run db:seed
npm run dev
# or: npx next dev -p 3001
```

Open http://localhost:3000 (or :3001)

### Demo logins (seed)

| Role | Email | Password |
|------|--------|----------|
| Founder / Ops | `founder@techmunda.com` | `Founder@2026` |
| Mobile patient API | `patient@curevanta.com` | `Curevanta@2026` |
| Mobile doctor API | `doctor@curevanta.com` | `Curevanta@2026` |

## Expo patient app

```bash
npm run mobile:patient
```

## Flutter portals

```bash
cd mobile
flutter pub get
flutter run
```

| Portal | Email | Password |
|--------|--------|----------|
| Patient | `patient@curevanta.app` | `Patient@2026` |
| Doctor | `doctor@curevanta.app` | `Doctor@2026` |
| Ops | `founder@techmunda.com` | `Founder@2026` |

## Stack

- Next.js 15 · React 19 · TypeScript · Tailwind · Prisma · PostgreSQL · Auth.js
- Expo / React Native (patient mobile) · shared packages
- Flutter (legacy 3-portal UI)
- Neon (cloud SQL) · Railway config · Cloudflare DNS runbook in `docs/GO_LIVE_CLOUDFLARE.md`

## Environment

Copy `.env.example` patterns. **Never commit** `.env`. Optional: `GEMINI_API_KEY`.

## Docs

- `docs/REACT_NATIVE_MIGRATION_AUDIT.md`
- `docs/BUILD_PROGRESS.md`
- `docs/GO_LIVE_CLOUDFLARE.md`
- Store / device checklists under `docs/`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run mobile:patient` | Expo patient app |
| `npm run db:push` / `db:seed` | Prisma |
| `npm test` | Vitest |
| `npm run build` | Production build |
