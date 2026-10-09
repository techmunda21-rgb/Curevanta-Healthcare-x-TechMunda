# Synthetic India healthcare training data

Source file (copied from Downloads):

`Curevanta_India_Healthcare_Synthetic_Training_Data.xlsx`

Sheets:

- Synthetic Doctors (~2k)
- Synthetic Patients (~2k)
- Synthetic Career Candidates (~2k)
- Healthcare Role Taxonomy

**Important:** Synthetic / de-identified only. Not real PHI. Not for diagnosis training.

## Import + train dispatch latency

```bash
npx prisma db push
npm run data:import-synthetic
```

Writes:

- Postgres tables `SyntheticProvider`, `SyntheticPatientPersona`, …
- `LatencyTrainingSample` + active `LatencyModelArtifact`
- `data/models/latency-model.json`

API (signed-in Control Tower user):

- `GET /api/ai/latency` — model status
- `POST /api/ai/latency` — predict ETA minutes
