# Curevanta — React Native Build Progress

**Updated:** 2026-10-06  
**Reference:** [REACT_NATIVE_MIGRATION_AUDIT.md](./REACT_NATIVE_MIGRATION_AUDIT.md)

---

## Status snapshot

| Metric | Value |
|--------|--------|
| **MIGRATION %** | **28%** |
| **PATIENT APP %** | **35%** (Home + Care request → real API) |
| **DOCTOR APP %** | **5%** (API accept path live; Expo app pending) |
| **CAREER APP %** | **1%** |
| **API STATUS** | Ops CRM + **mobile booking vertical slice live** |
| **REALTIME STATUS** | SSE (ops). Booking events persisted; Socket.IO package TBD |
| **ANDROID STATUS** | Expo ready; device build not run this session |
| **IOS STATUS** | Config with `.dev` ids |
| **TEST STATUS** | Vitest 6/6; API E2E smoke passed (login→book→accept→409) |
| **BUILD STATUS** | Prisma client generate OK after stopping Next lock |

---

## Vertical slice (verified via HTTP)

```
Patient login → POST /api/mobile/bookings → PROVIDER_NOTIFIED
→ Doctor accept → ON_THE_WAY
→ Second accept → 409 ACCEPT_CONFLICT
```

Mobile demo accounts (seed):

- `patient@curevanta.com` / `Curevanta@2026`
- `doctor@curevanta.com` / `Curevanta@2026`

---

## Blockers

1. Socket.IO / live map tracking UI not yet wired (events stored in `CareBookingEvent`).  
2. Doctor Expo app not scaffolded (API ready).  
3. Production bundle IDs await founder confirmation.  
4. Prisma generate EPERM if Next holds `query_engine-windows.dll.node` — stop `next dev` before generate.

---

## Completed

- [x] Audit + progress + store/device checklists  
- [x] Workspaces + design-tokens + mobile-ui + api-client + auth SecureStore  
- [x] Expo patient app (tabs + Patient Home)  
- [x] Additive Prisma care domain (`MobileAccount`, `CareBooking`, …)  
- [x] Mobile auth sessions (hashed tokens)  
- [x] Booking create (idempotent) + atomic doctor accept  
- [x] Middleware allows `/api/mobile/*`  
- [x] Flutter + Control Tower preserved  

---

## Next P0 tasks

1. Patient tracking screen bound to booking GET + location updates  
2. Scaffold doctor-mobile Expo (online toggle + accept UI)  
3. Shared realtime package (Socket.IO or booking SSE)  
4. Provider search animation driven by real status  
5. Android Expo smoke run  

---

## Phase checklist

| Phase | Name | Status |
|-------|------|--------|
| 0 | Audit | **Done** |
| 1 | Foundation | **~85%** |
| 2 | Patient Home + booking UI | **Home done; Care creates real bookings** |
| 3 | Dispatch + realtime + tracking | **Dispatch accept API done; UI/realtime pending** |
| 4 | Doctor app | API ready / Expo pending |
| 5–8 | Career → store | Pending |

---

## Safety

- No NestJS rewrite of ops CRM.  
- No deletion of Flutter or Next demos.  
- Active Home booking card remains illustrative until query-wired.  
- Human approval still required for store / production secrets.
