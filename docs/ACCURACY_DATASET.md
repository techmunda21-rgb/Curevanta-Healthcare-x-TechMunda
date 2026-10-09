# Software accuracy & annotation dataset (DEV SEED)

**Label:** Development seed data only — not real TechMunda / Curevanta company data.

Apply with:

```bash
npm run db:seed
```

## What was added

| Area | Codes / content | Use for |
|------|------------------|---------|
| Task specs | CUR-101, 102, 105, 106, 109, 111 — acceptance criteria in description | Spec accuracy |
| Annotations | Task comments prefixed `[ANNOTATION][SEED]` | Review / annotation UX |
| Activity | STATUS_CHANGE, ANNOTATION_FLAG, ACCURACY_CHECK | Timeline accuracy |
| Worklogs | Hours vs estimate on same tasks | Effort accuracy |
| Standups | Patient / Backend / QA users | Daily ops accuracy |
| Test cases | TC-ACC-01 … TC-ACC-04 | QA checklist |
| Audit | SEED_ACCURACY_PACK_APPLIED, ACCURACY_CHECK | Audit trail |

## How to verify in the live app

1. Login: `founder@techmunda.com` / `Founder@2026`
2. **Tasks** → open **CUR-106** (blocked) — founder annotation + BLOCKED status
3. **CUR-102** — booking API accuracy comments (no fake dispatch)
4. **CUR-109** — est. hours regression annotation
5. Create a task with blank hours → should save (default 4h), not 500
6. **Kanban / Dashboard** — seed tasks still show as demo / seed where UI flags `isSeedData`

## Mobile API accuracy (optional)

- Idempotent booking + double-accept `409` → cases TC-ACC-02 / TC-ACC-03
