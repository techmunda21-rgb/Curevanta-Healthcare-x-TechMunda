import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole, resolveMobileAuth } from "@/lib/mobile/auth";

export const runtime = "nodejs";

const bodySchema = z.object({
  isOnline: z.boolean(),
});

export async function POST(req: Request) {
  const requestId = nanoid(10);
  const auth = await resolveMobileAuth(req.headers.get("authorization"));
  if (!auth || !requireRole(auth.account, ["DOCTOR"])) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Doctor session required", requestId },
      { status: 401 },
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid payload", requestId },
      { status: 400 },
    );
  }

  const profile = await prisma.careProviderProfile.upsert({
    where: { accountId: auth.account.id },
    create: {
      accountId: auth.account.id,
      specialty: "General Physician",
      isOnline: parsed.data.isOnline,
      isVerified: true,
    },
    update: { isOnline: parsed.data.isOnline },
  });

  return NextResponse.json({
    isOnline: profile.isOnline,
    specialty: profile.specialty,
    requestId,
  });
}
