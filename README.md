# Curevanta × TechMunda — Control Tower & Mobile

Monorepo for **Curevanta** healthcare ops (Control Tower CRM), patient/doctor web demos, Expo React Native apps, Flutter portals, and synthetic India healthcare training data.

> **Seed / synthetic data only** in local demos — not real TechMunda or Curevanta company or patient records.

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 20+ (22 recommended) |
| npm | 10+ |
| Docker Desktop | For local PostgreSQL |
| Git | Latest |
| Flutter (optional) | 3.x — `mobile/` only |
| Expo CLI (optional) | via `npx expo` — patient mobile |

---

## Clone

```bash
git clone https://github.com/techmunda21-rgb/Curevanta-Healthcare-x-TechMunda.git
cd Curevanta-Healthcare-x-TechMunda
```

If the GitHub remote name differs, replace the URL with your fork.

---

## Repository structure

```text
.
├── src/                 # Next.js App Router — Control Tower + patient/doctor web UI
│   └── app/api/mobile/  # Mobile booking API (vertical slice)
├── prisma/              # Schema + seed
├── apps/
│   ├── patient-mobile/  # Expo (React Native) patient app
│   ├── doctor-mobile/   # Placeholder
│   └── career-mobile/   # Placeholder
├── packages/            # Shared design-tokens, mobile-ui, api-client, auth, …
├── mobile/              # Flutter 3-portal (Patient / Doctor / Ops)
├── data/synthetic/      # India healthcare synthetic XLSX + import docs
├── data/models/         # Trained latency model artifact (generated)
├── scripts/             # Import / training scripts
├── docs/                # Migration, go-live, accuracy dataset
├── .github/workflows/   # CI (lint/test; Railway deploy if token set)
├── docker-compose.yml
├── railway.json
└── package.json         # npm workspaces root
```

---

## 1. Environment

Create a root `.env` (never commit this file):

```env
# Local Postgres (docker-compose defaults)
DATABASE_URL="postgresql://controltower:controltower@localhost:5432/control_tower?schema=public"

# Auth.js / NextAuth
AUTH_SECRET="replace-with-a-long-random-string"
AUTH_TRUST_HOST="true"
# Optional when deploying behind a public URL:
# NEXTAUTH_URL="http://localhost:3000"

# Optional AI (without this, AI uses deterministic fallbacks)
# GEMINI_API_KEY=""
```

Generate a secret (example):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Patient Expo app (optional) — copy `apps/patient-mobile/.env.example` to `.env`:

```env
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Use your machine LAN IP instead of `localhost` when testing on a physical phone.

---

## 2. Database

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies (also runs prisma generate)
npm install

# Apply schema
npx prisma db push

# Seed Control Tower demo data + accuracy annotations
npm run db:seed
```

### Optional — synthetic India healthcare data + latency model

Place or keep the workbook at:

`data/synthetic/Curevanta_India_Healthcare_Synthetic_Training_Data.xlsx`

Then:

```bash
npm run data:import-synthetic
```

This imports synthetic providers/patients/careers and trains an **operational dispatch latency** model (ETA minutes — not clinical diagnosis).  
See `data/synthetic/README.md`.

---

## 3. Run Control Tower (web)

```bash
npm run dev
# or fixed port:
npx next dev -p 3001
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Default Next.js |
| http://localhost:3000/login | Auth |
| http://localhost:3000/dashboard | Ops Control Tower |
| http://localhost:3000/patient/home | Patient UI (showcase) |
| http://localhost:3000/doctor | Doctor app demo |

### Demo logins (after `npm run db:seed`)

| Role | Email | Password |
|------|--------|----------|
| Founder / Ops | `founder@techmunda.com` | `Founder@2026` |
| CTO | `cto@techmunda.com` | `Founder@2026` |
| PM | `pm@techmunda.com` | `Founder@2026` |
| Mobile patient API | `patient@curevanta.com` | `Curevanta@2026` |
| Mobile doctor API | `doctor@curevanta.com` | `Curevanta@2026` |

Login page also has **Patient / Doctor / Founder** quick chips for web demos.

---

## 4. Expo patient app

```bash
npm run mobile:patient
# or
cd apps/patient-mobile && npx expo start
```

Ensure the API base URL points at your running Next server.

---

## 5. Flutter portals (optional)

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

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js development server |
| `npm run build` / `start` | Production build & serve |
| `npm run db:push` | Push Prisma schema |
| `npm run db:seed` | Seed demo + accuracy pack |
| `npm run db:studio` | Prisma Studio |
| `npm run data:import-synthetic` | Import XLSX + train latency model |
| `npm run mobile:patient` | Expo patient app |
| `npm test` | Vitest |
| `npm run lint` | ESLint |

---

## Tests & quality

```bash
npm test
npm run lint
npx tsc --noEmit
```

CI workflow: `.github/workflows/deploy.yml` (runs lint/test/typecheck; Railway deploy only if `RAILWAY_TOKEN` secret is set).

---

## Docs

| Doc | Topic |
|-----|--------|
| `docs/REACT_NATIVE_MIGRATION_AUDIT.md` | RN migration audit |
| `docs/BUILD_PROGRESS.md` | Mobile build progress |
| `docs/ACCURACY_DATASET.md` | Seed accuracy / annotations |
| `docs/GO_LIVE_CLOUDFLARE.md` | Neon / Railway / Cloudflare go-live |
| `data/synthetic/README.md` | Synthetic import + latency API |

---

## GitHub setup checklist

1. Create or use repo: `techmunda21-rgb/Curevanta-Healthcare-x-TechMunda` (or your org/name).
2. Ensure `.env` and secrets are **not** committed (see `.gitignore`).
3. Push:

```bash
git add -A
git status   # confirm no .env
git commit -m "Initial Curevanta Control Tower monorepo"
git branch -M main
git remote add origin https://github.com/<owner>/<repo>.git   # if needed
git push -u origin main
```

4. (Optional) Add GitHub Actions secret `RAILWAY_TOKEN` for deploy job.
5. (Optional) Point Cloudflare DNS at your host per `docs/GO_LIVE_CLOUDFLARE.md`.

---

## Stack

- **Web / API:** Next.js 15 · React 19 · TypeScript · Tailwind · Prisma · PostgreSQL · Auth.js · Zod  
- **Mobile:** Expo Router · TanStack Query · shared `packages/*` · Flutter portals  
- **Data / ML (ops):** Synthetic India XLSX · latency regression model · `GET/POST /api/ai/latency`  
- **Deploy notes:** Neon SQL · Railway · Cloudflare DNS (see docs)

---

## Safety

- Do **not** use synthetic patient rows as medical ground truth for diagnosis or prescriptions.  
- Latency model predicts **operational ETA minutes** only — not clinical outcomes.  
- Never commit production secrets, Neon passwords, or real PHI.

---

## License / ownership

Private project — TechMunda × Curevanta. Contact the repository owner for access and contribution rules.
