import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  extractFeatures,
  predictLatencyMinutes,
  type LatencyWeights,
} from "@/lib/ai/latency-model";

export const runtime = "nodejs";

/** Predict operational dispatch latency (minutes) using active trained model */
export async function POST(req: Request) {
  const requestId = nanoid(10);
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Sign in required", requestId },
      { status: 401 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    city?: string;
    urgency?: string;
    preferredMode?: string;
    careNeed?: string;
    specialty?: string;
    experienceYears?: number;
    rating?: number;
    online?: boolean;
    homeVisit?: boolean;
  } | null;

  const model = await prisma.latencyModelArtifact.findFirst({
    where: { isActive: true },
    orderBy: { trainedAt: "desc" },
  });

  if (!model) {
    return NextResponse.json(
      {
        code: "MODEL_MISSING",
        message: "No active latency model. Run npm run data:import-synthetic",
        requestId,
      },
      { status: 404 },
    );
  }

  const features = extractFeatures(
    {
      code: "runtime",
      city: body?.city || "Bengaluru",
      state: "Karnataka",
      urgency: body?.urgency || "Routine",
      preferredMode: body?.preferredMode || "Home Visit",
      careNeed: body?.careNeed || "General",
    },
    {
      code: "runtime",
      city: body?.city || "Bengaluru",
      state: "Karnataka",
      specialty: body?.specialty || "General Medicine",
      experienceYears: body?.experienceYears ?? 8,
      rating: body?.rating ?? 4.8,
      online: body?.online ?? true,
      homeVisit: body?.homeVisit ?? true,
    },
  );

  const etaMinutes = predictLatencyMinutes(
    model.weightsJson as unknown as LatencyWeights,
    features,
  );

  return NextResponse.json({
    etaMinutes,
    modelVersion: model.version,
    maeMinutes: model.maeMinutes,
    features,
    disclaimer:
      "Operational ETA estimate from synthetic training data — not a clinical guarantee.",
    requestId,
  });
}

export async function GET() {
  const requestId = nanoid(10);
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Sign in required", requestId },
      { status: 401 },
    );
  }

  const [model, samples, providers, patients] = await Promise.all([
    prisma.latencyModelArtifact.findFirst({
      where: { isActive: true },
      orderBy: { trainedAt: "desc" },
    }),
    prisma.latencyTrainingSample.count(),
    prisma.syntheticProvider.count(),
    prisma.syntheticPatientPersona.count(),
  ]);

  return NextResponse.json({
    activeModel: model
      ? {
          version: model.version,
          trainedAt: model.trainedAt,
          sampleCount: model.sampleCount,
          maeMinutes: model.maeMinutes,
          rmseMinutes: model.rmseMinutes,
        }
      : null,
    imported: { providers, patients, latencySamples: samples },
    requestId,
  });
}
