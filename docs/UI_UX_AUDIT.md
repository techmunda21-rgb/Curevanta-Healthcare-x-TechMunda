# Curevanta Control Tower — UI/UX Audit

**Product:** TechMunda × Curevanta Project Control Tower  
**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Lucide  
**Date:** 2026-10-06  
**Scope:** Web admin CRM only (no React Native app in this repo)

---

## 1. Screen inventory

| Area | Routes | Maturity |
|------|--------|----------|
| Auth | `/login`, `/unauthorized` | Clay marketing UI (violet) — inconsistent with CRM teal |
| Overview | `/dashboard` | Functional founder dashboard; dense KPI grids |
| Projects | `/projects`, `/projects/curevanta`, milestones, roadmap | Mixed depth; some stubs |
| Execution | tasks, kanban, sprints, blockers, standups | Core flows work; visual inconsistency |
| Team | employees, teams, workload, performance, worklogs | List UIs; stubs for some |
| Engineering | engineering, QA, bugs, releases | Partial |
| Finance | budget, payroll, expenses, cloud, variance, runway | Budget/payroll/expenses solid |
| Founder | control, approvals, decisions, equity, investors | Approvals functional |
| Growth / Clients / Docs / AI / Reports / Settings | various | Many operational stubs |

**Navigation:** Graphite sidebar from `src/lib/navigation.ts` with expandable groups + Cmd+K palette.

---

## 2. Design tokens (current)

**Present (globals.css):** `--brand`, `--brand-deep`, `--graphite`, `--bg`, `--surface`, clay-* vars for login.

**Gaps:**
- No semantic `primarySoft`, `accent`, `textPrimary/Secondary`, elevation scale
- Background is `#F2F5F5` (plan target `#F7FAFA`)
- No spacing/radius/motion token modules
- Hardcoded hex and one-off radii across pages
- Dual systems: clay violet (login) vs teal (app)

---

## 3. Component architecture

| Component | Location | Issues |
|-----------|----------|--------|
| Button | `ui/button.tsx` | Sharp `rounded-md`; no loading/press motion |
| Input | `ui/input.tsx` | Basic; no error/success |
| Card | `ui/card.tsx` | Single style; no elevated/interactive variants |
| Badge | `ui/badge.tsx` | OK; needs token alignment |
| KpiCard | `kpi-card.tsx` | Uses Fraunces display; dense |
| EmptyState | `empty-state.tsx` | Minimal; no ErrorState |
| Skeletons | — | Missing |
| PageHeader | — | Missing |
| Clay* | `components/clay/*` | Login-only; purple accents |

---

## 4. Typography & hierarchy

- Body: DM Sans; display: Fraunces (ops UI feels editorial, not SaaS command center)
- Arbitrary `text-[11px]`, mixed heading weights
- Dashboard hero competes with two 7-column KPI rows — weak 30-second scan path

---

## 5. Spacing & layout

- Inconsistent `gap-3` / `p-4` / `p-5` without scale
- Sidebar fixed 260px; main padding OK
- Tables lack row hover / sticky header polish
- Mobile: sidebar hidden; no alternate nav drawer

---

## 6. Accessibility

- Focus rings present on some controls; incomplete on nav links
- Color-only status in places (blocked counts)
- Clay infinite blob animations ignore CRM reduced-motion for login only (partial)
- Touch targets on icon buttons ~36px (target ≥44px for key actions)

---

## 7. States

| State | Status |
|-------|--------|
| Loading | Spinners rare; no skeletons |
| Empty | Basic EmptyState |
| Error | Ad-hoc text; no ErrorState pattern |
| Success | Toast via sonner; no success surface |

---

## 8. Motion

- CRM: almost none
- Login: clay float/breathe (decorative)
- Opportunity: card hover lift (subtle), button press scale, content fade-in, progress transitions — all gated by `prefers-reduced-motion`

---

## 9. Priority backlog

1. Centralize teal design tokens + Inter typography  
2. Upgrade Button / Card / Input / Skeleton / Empty / Error / PageHeader  
3. Shell (sidebar/topbar) polish  
4. Redesign `/dashboard` as visual benchmark  
5. Retune login clay accents toward teal  
6. Roll design system to founder, kanban, finance, tasks  

---

## 10. Non-regressions

Do not change: Auth.js, RBAC, Prisma queries, seed data semantics, server actions contracts.
