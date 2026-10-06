# TechMunda Project Control Tower

Production-grade project management CRM for **TechMunda × Curevanta**.

Database-backed Next.js app (not a static prototype) with Prisma + PostgreSQL, RBAC, founder dashboard, tasks/kanban, finance, approvals, and AI CTO brief abstraction.

## Quick start

```bash
# 1) Start PostgreSQL
docker compose up -d

# 2) Install + generate Prisma client
npm install

# 3) Push schema + seed DEMO data
npx prisma db push
npm run db:seed

# 4) Run
npm run dev
```

Open http://localhost:3000

### Demo login (seed only)

- Email: `founder@techmunda.com`
- Password: `Founder@2026`

Seed records are labeled **development seed data** — not real company records.

## Stack

- Next.js · React · TypeScript · Tailwind CSS
- PostgreSQL · Prisma · Zod · React Hook Form
- TanStack Query · Recharts · NextAuth (Auth.js)
- Gemini via `src/lib/ai/provider.ts` (no direct Gemini calls in UI)

## Environment

Copy `.env` values. Set `GEMINI_API_KEY` optionally; without it the AI layer returns deterministic founder briefs.

## Important finance/equity rules

- ₹30,00,000 is a **development cost/contribution basis**
- It does **not** automatically convert to equity
- Equity changes require founder approval + legal/board confirmation flags + audit log

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run db:push` | Push Prisma schema |
| `npm run db:seed` | Seed demo Curevanta data |
| `npm run db:studio` | Prisma Studio |
| `npm run build` | Production build |
