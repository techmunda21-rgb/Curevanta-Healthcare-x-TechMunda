# Curevanta — React Native Migration Audit

**Date:** 2026-10-06  
**Repo:** `curevanta-control-tower` (TechMunda × Curevanta)  
**Mode:** Existing-project migration (non-destructive)  
**Auditor role:** Principal RN architecture pass (inspection only → plan)

---

## 1. CURRENT ARCHITECTURE (AS FOUND)

| Layer | Reality in this repository |
|--------|----------------------------|
| **Primary app** | **Next.js 15.1.6** App Router + React 19 + TypeScript |
| **Ops / Admin** | TechMunda **Control Tower** CRM under `src/app/(app)/*` |
| **Consumer web UI** | Curevanta patient/doctor **web shells** under `src/app/patient/*`, `src/app/doctor/*`, splash/onboarding |
| **Mobile** | **Flutter** app under `mobile/` (3 portals: Patient / Doctor / Ops) — UI + local auth demo |
| **Database** | **PostgreSQL 16** via Docker Compose + **Prisma 5.22** |
| **Auth** | **Auth.js / NextAuth v5** credentials + bcrypt + RBAC (`SystemRole`, permissions) |
| **API surface** | Mostly **Server Actions** + Prisma; HTTP routes only: `/api/auth/*`, `/api/live/stream` (SSE) |
| **Realtime** | Soft live refresh (SSE snapshot + `router.refresh`) — **not** Socket.IO |
| **AI** | Abstraction in `src/lib/ai/provider.ts` (Gemini optional / deterministic fallback) |
| **Tests** | Vitest (e.g. `src/lib/health.test.ts`) — limited coverage |
| **Design system** | `src/theme/*` + `docs/DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`, `UI_UX_AUDIT.md` |

### Explicitly **NOT** present (despite product vision / seed narrative)

| Assumed in migration prompt | Status |
|-----------------------------|--------|
| NestJS API | **Missing** (mentioned only in seed employee skills / decisions) |
| Redis / BullMQ | **Missing** |
| PostGIS | **Missing** (tasks in seed refer to future work) |
| Socket.IO gateway | **Missing** (blocked/planned in seed data only) |
| Booking / dispatch state machine tables | **Missing** |
| Payment provider integration | **UI mock only** |
| Expo / React Native app | **Missing** (Flutter exists instead) |
| Career / jobs domain models | **Missing** |

**Conclusion:** This repo is a **strong Ops Control Tower + Prisma seed of Curevanta program data**, plus **consumer UI prototypes** (Next web + Flutter). It is **not yet** a production healthcare booking/dispatch backend.

---

## 2. WORKING MODULES

### Control Tower (production-oriented ops OS)

- Auth + middleware RBAC  
- Dashboard / projects / tasks / kanban / sprints / standups / blockers  
- Employees / teams / workload / performance / worklogs  
- Finance (budget, expenses, payroll, cloud, variance, runway)  
- Founder (approvals, decisions, equity, investors)  
- QA / bugs / releases / deployments  
- Clients (portal, feedback, UAT, change requests)  
- Growth (travel, expos, expansion)  
- Documents / reports / settings / AI command UI  
- Live SSE module refresh (`/api/live/stream`)  
- Prisma seed for Curevanta project dossier  

### Consumer prototypes (working as demos)

- Next.js: splash → onboarding → login → patient/doctor flows (mostly demo data)  
- Flutter `mobile/`: hub + separate Patient / Doctor / Ops logins + shell screens (local `SharedPreferences` auth, no API)  

---

## 3. REUSABLE MODULES (FOR RN / SHARED PACKAGES)

| Module | Path | Reuse approach |
|--------|------|----------------|
| Design tokens | `src/theme/colors.ts`, spacing, radius, elevation, motion, typography | Copy → `packages/design-tokens` |
| Design docs | `docs/DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md` | Keep as source of truth |
| RBAC concepts | `src/lib/rbac.ts`, `SystemRole` enum | Adapt for mobile app roles (patient/doctor/career ≠ ops roles) |
| Zod usage | Auth credentials schema, forms | Extract shared validation package |
| AI provider interface | `src/lib/ai/provider.ts` | Optional later package; not P0 for booking slice |
| Prisma client / schema | `prisma/schema.prisma` | **Preserve**; extend with booking/dispatch models later |
| Utils | `src/lib/utils.ts` (formatINR, dates) | Partial share via `packages/` |
| Demo product copy | `src/lib/curevanta/demo.ts`, Flutter `demo` | UX content reference only |

---

## 4. WEB-ONLY MODULES (REWRITE FOR NATIVE)

- All `div` / Tailwind / CSS variable UI  
- Next.js App Router pages & Server Components  
- Auth.js cookie sessions (mobile needs token/OTP + SecureStore)  
- SSE `EventSource` live refresh (mobile → Socket.IO / Expo)  
- Recharts dashboard charts (ops stays web)  
- Clay login marketing layout  
- `window` / `document` / `localStorage` patterns  

---

## 5. MODULES TO REWRITE (MOBILE)

| Domain | Current | Target |
|--------|---------|--------|
| Patient UX | Next web + Flutter demo | Expo `apps/patient-mobile` |
| Doctor UX | Next web + Flutter demo | Expo `apps/doctor-mobile` |
| Career / Ops field UX | Flutter Ops lite only | Expo `apps/career-mobile` |
| Consumer auth | Demo credentials / Auth.js web | SecureStore + API sessions/OTP |
| Booking / tracking / payment UI | Mock screens | RN + real API (to be built) |

---

## 6. MODULES TO PRESERVE

- Entire Control Tower Next.js app (becomes / remains **admin-web**)  
- Prisma schema + seed program data (until booking schema is additive)  
- PostgreSQL docker compose  
- Server actions for ops CRM  
- Design token values and motion guidelines  
- Flutter `mobile/` until Expo apps reach parity (do **not** delete early)  
- Audit / approval / finance business rules in ops  

---

## 7. MOBILE RISKS

1. **Backend gap:** No booking/dispatch/location/payment APIs → vertical slice requires **new** API layer (extend Next Route Handlers **or** introduce NestJS later).  
2. **Dual mobile stacks:** Flutter + upcoming Expo increases maintenance until Flutter is retired.  
3. **Auth mismatch:** Auth.js cookies ≠ mobile secure tokens.  
4. **Disk space:** Host C: has been at 0 free GB; Expo/Android builds need free space / temp on D:.  
5. **Role model clash:** `SystemRole` is ops-centric; patient/doctor/career need separate identity model.  
6. **Fake realtime:** Provider search / map ETA currently simulated in UI — must not ship as “live”.  

---

## 8. DEPENDENCY RISKS

| Risk | Detail |
|------|--------|
| Next 15 + React 19 | Fine for admin-web; keep pinned during monorepo add |
| Prisma 5.22 | Stable; additive migrations only |
| Expo SDK choice | Must match RN version; verify before locking |
| Maps | Need Expo-compatible maps (avoid abandoned libs) |
| Socket.IO | Not in repo yet — adding needs Redis adapter plan for scale |
| Monorepo tooling | Prefer `pnpm`/`npm` workspaces without forced turbo unless needed |

---

## 9. MIGRATION PLAN (ADAPTED TO REAL REPO)

### Principle

**Preserve** Control Tower + Prisma.  
**Add** Expo apps + shared packages **alongside**.  
**Build** missing booking/dispatch API **before** claiming vertical-slice “done”.  
**Retire** Flutter only after Expo parity verified.

### Proposed target tree (adapted — no mass-move of Next yet)

```text
curevanta-control-tower/          # keep git root name for now
├── apps/
│   ├── patient-mobile/           # Expo (NEW)
│   ├── doctor-mobile/            # Expo (NEW)
│   ├── career-mobile/            # Expo (NEW)
│   └── admin-web/                # FUTURE: move Next.js here (phase late)
├── packages/
│   ├── design-tokens/            # NEW (from src/theme)
│   ├── mobile-ui/                # NEW
│   ├── api-client/               # NEW
│   ├── types/                    # NEW (shared DTOs)
│   ├── validation/               # NEW (Zod)
│   ├── config/                   # NEW
│   └── (auth|realtime|location later)
├── mobile/                       # PRESERVE Flutter until RN verified
├── src/                          # PRESERVE Next Control Tower + web demos
├── prisma/                       # PRESERVE (+ additive booking models later)
├── docs/
│   ├── REACT_NATIVE_MIGRATION_AUDIT.md
│   ├── BUILD_PROGRESS.md
│   └── …
├── package.json                  # evolve to workspaces
└── README.md
```

> Mass-moving `src/` → `apps/admin-web` is **deferred** until Expo foundation is stable (avoids breaking Control Tower).

### Phases (aligned with prompt, reality-checked)

| Phase | Work | Gate |
|-------|------|------|
| **0** | Audit + progress docs | This file |
| **1** | Workspaces + design-tokens + patient-mobile Expo skeleton + API client stub | Lint/typecheck |
| **2** | Patient Home (visual benchmark) + auth shell | Screenshot-quality UI |
| **3** | Additive Prisma booking models + Next Route Handlers (or Nest later) | API contract tests |
| **4** | Patient booking → doctor accept → realtime (Socket.IO) → tracking | Vertical slice E2E |
| **5** | Doctor app | Same contracts |
| **6** | Career app | Jobs domain (new) |
| **7** | Payments / notifications / polish | Store checklists |
| **8** | EAS / Play / TestFlight | Human approval |

### First production vertical slice (P0)

Requires **new** backend work (not present today):

```text
Patient mobile → POST /bookings
→ Postgres (booking + geo)
→ Dispatch (assign/accept atomic)
→ Doctor mobile accept
→ Socket.IO status + location
→ Patient tracking map
→ Admin-web sees booking
```

Until then, RN can ship **UI + typed client against stubs**, clearly labeled non-production.

---

## 10. APP IDENTIFIERS (PROPOSED — NOT FINAL)

| App | Suggested bundle ID |
|-----|---------------------|
| Patient | `com.curevanta.patient` |
| Doctor | `com.curevanta.doctor` |
| Career | `com.curevanta.career` |

**Do not register or commit as production** until founder confirms.

---

## 11. HUMAN APPROVAL GATES (ACTIVE)

Stop before: production deploy, destructive DB reset with real data, store submission, payment production keys, clinical automation, irreversible infra.

---

## 12. AUDIT VERDICT

| Question | Answer |
|----------|--------|
| Can we migrate UI to Expo now? | **Yes** (non-destructive) |
| Can we connect “real NestJS dispatch” today? | **No — does not exist** |
| Should we delete Flutter / Next consumer demos? | **No** until RN + API verified |
| Should we invent NestJS immediately? | **Optional later**; prefer additive Next API routes for P0 slice speed, Nest if team standardizes later |
| Highest-value next step | Scaffold Expo patient-mobile + design-tokens + BUILD_PROGRESS tracking |

---

*End of audit. No destructive migration performed in this step.*
