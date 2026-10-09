/**
 * Operational dispatch latency model (synthetic training).
 * Predicts minutes until provider readiness / ETA start.
 * NOT for medical diagnosis or clinical outcomes.
 */

export type ProviderLite = {
  code: string;
  city: string;
  state: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  online: boolean;
  homeVisit: boolean;
};

export type PatientLite = {
  code: string;
  city: string;
  state: string;
  urgency: string;
  preferredMode: string;
  careNeed: string;
};

export type LatencyFeatures = {
  urgencyScore: number;
  onlineScore: number;
  experienceScore: number;
  ratingScore: number;
  homeVisitScore: number;
  metroScore: number;
  careNeedScore: number;
};

export type LatencySample = {
  sampleKey: string;
  city: string;
  state: string;
  specialty: string;
  urgency: string;
  preferredMode: string;
  providerOnline: boolean;
  experienceYears: number;
  rating: number;
  labelLatencyMin: number;
  features: LatencyFeatures;
};

export type LatencyWeights = {
  bias: number;
  urgencyScore: number;
  onlineScore: number;
  experienceScore: number;
  ratingScore: number;
  homeVisitScore: number;
  metroScore: number;
  careNeedScore: number;
};

export type LatencyArtifact = {
  sampleCount: number;
  maeMinutes: number;
  rmseMinutes: number;
  weights: LatencyWeights;
};

const METRO = new Set([
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
]);

function urgencyScore(u: string) {
  const x = u.toLowerCase();
  if (x.includes("emerg") || x.includes("critical")) return 1;
  if (x.includes("urgent")) return 0.7;
  if (x.includes("soon") || x.includes("priority")) return 0.45;
  return 0.15; // routine
}

function careNeedScore(c: string) {
  const x = c.toLowerCase();
  if (x.includes("emergency") || x.includes("critical")) return 1;
  if (x.includes("elder")) return 0.55;
  if (x.includes("chronic") || x.includes("follow")) return 0.35;
  return 0.25;
}

export function extractFeatures(
  patient: PatientLite,
  provider: ProviderLite,
): LatencyFeatures {
  return {
    urgencyScore: urgencyScore(patient.urgency),
    onlineScore: provider.online ? 1 : 0,
    experienceScore: Math.min(1, provider.experienceYears / 25),
    ratingScore: Math.min(1, Math.max(0, (provider.rating - 3) / 2)),
    homeVisitScore:
      patient.preferredMode.toLowerCase().includes("home") && provider.homeVisit
        ? 1
        : patient.preferredMode.toLowerCase().includes("tele")
          ? 0.6
          : 0.3,
    metroScore: METRO.has(patient.city) || METRO.has(provider.city) ? 1 : 0.4,
    careNeedScore: careNeedScore(patient.careNeed),
  };
}

/** Deterministic synthetic label (minutes) for training — not measured GPS. */
export function syntheticLatencyLabel(f: LatencyFeatures): number {
  const raw =
    28 -
    10 * f.onlineScore -
    6 * f.urgencyScore -
    4 * f.experienceScore -
    3 * f.ratingScore -
    2 * f.homeVisitScore -
    3 * f.metroScore +
    4 * (1 - f.careNeedScore);
  return Math.max(4, Math.min(55, Math.round(raw * 10) / 10));
}

export function buildLatencySamples(
  providers: ProviderLite[],
  patients: PatientLite[],
  maxSamples = 4000,
): LatencySample[] {
  const byCity = new Map<string, ProviderLite[]>();
  for (const p of providers) {
    const list = byCity.get(p.city) ?? [];
    list.push(p);
    byCity.set(p.city, list);
  }

  const samples: LatencySample[] = [];
  for (const patient of patients) {
    if (samples.length >= maxSamples) break;
    const pool =
      byCity.get(patient.city)?.length
        ? byCity.get(patient.city)!
        : providers;
    if (!pool.length) continue;
    const provider = pool[samples.length % pool.length];
    const features = extractFeatures(patient, provider);
    const labelLatencyMin = syntheticLatencyLabel(features);
    samples.push({
      sampleKey: `${patient.code}__${provider.code}`,
      city: patient.city,
      state: patient.state,
      specialty: provider.specialty,
      urgency: patient.urgency,
      preferredMode: patient.preferredMode,
      providerOnline: provider.online,
      experienceYears: provider.experienceYears,
      rating: provider.rating,
      labelLatencyMin,
      features,
    });
  }
  return samples;
}

function predictRaw(w: LatencyWeights, f: LatencyFeatures) {
  return (
    w.bias +
    w.urgencyScore * f.urgencyScore +
    w.onlineScore * f.onlineScore +
    w.experienceScore * f.experienceScore +
    w.ratingScore * f.ratingScore +
    w.homeVisitScore * f.homeVisitScore +
    w.metroScore * f.metroScore +
    w.careNeedScore * f.careNeedScore
  );
}

/** Ordinary least squares on feature matrix (closed form via normal equations, 7 dims). */
export function trainLatencyModel(samples: LatencySample[]): LatencyArtifact {
  if (samples.length < 10) {
    throw new Error("Need at least 10 latency samples to train");
  }

  const keys: (keyof LatencyFeatures)[] = [
    "urgencyScore",
    "onlineScore",
    "experienceScore",
    "ratingScore",
    "homeVisitScore",
    "metroScore",
    "careNeedScore",
  ];

  const n = samples.length;
  const dim = keys.length + 1; // + bias
  // Build X'X and X'y
  const xtx: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
  const xty: number[] = Array(dim).fill(0);

  for (const s of samples) {
    const row = [1, ...keys.map((k) => s.features[k])];
    const y = s.labelLatencyMin;
    for (let i = 0; i < dim; i++) {
      xty[i] += row[i] * y;
      for (let j = 0; j < dim; j++) {
        xtx[i][j] += row[i] * row[j];
      }
    }
  }

  // Ridge for stability
  const lambda = 1e-3 * n;
  for (let i = 0; i < dim; i++) xtx[i][i] += lambda;

  const beta = solveLinearSystem(xtx, xty);
  const weights: LatencyWeights = {
    bias: beta[0],
    urgencyScore: beta[1],
    onlineScore: beta[2],
    experienceScore: beta[3],
    ratingScore: beta[4],
    homeVisitScore: beta[5],
    metroScore: beta[6],
    careNeedScore: beta[7],
  };

  let abs = 0;
  let sq = 0;
  for (const s of samples) {
    const pred = predictRaw(weights, s.features);
    const err = pred - s.labelLatencyMin;
    abs += Math.abs(err);
    sq += err * err;
  }

  return {
    sampleCount: n,
    maeMinutes: abs / n,
    rmseMinutes: Math.sqrt(sq / n),
    weights,
  };
}

export function predictLatencyMinutes(
  weights: LatencyWeights,
  features: LatencyFeatures,
): number {
  const pred = predictRaw(weights, features);
  return Math.max(3, Math.min(90, Math.round(pred * 10) / 10));
}

/** Gaussian elimination for small systems */
function solveLinearSystem(aIn: number[][], bIn: number[]): number[] {
  const n = bIn.length;
  const a = aIn.map((row, i) => [...row, bIn[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const div = a[col][col] || 1e-12;
    for (let c = col; c <= n; c++) a[col][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = a[r][col];
      for (let c = col; c <= n; c++) a[r][c] -= factor * a[col][c];
    }
  }
  return a.map((row) => row[n]);
}
