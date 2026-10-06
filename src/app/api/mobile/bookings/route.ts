import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole, resolveMobileAuth } from "@/lib/mobile/auth";
import { toBookingSummary } from "@/lib/mobile/booking";

export const runtime = "nodejs";

const createSchema = z.object({
  serviceKind: z.enum([
    "DOCTOR_AT_HOME",
    "NURSE_AT_HOME",
    "DIAGNOSTICS",
    "PHYSIOTHERAPY",
    "FOLLOW_UP",
  ]),
  addressLine: z.string().min(5).max(240),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  notes: z.string().max(500).optional(),
  idempotencyKey: z.string().uuid(),
});

export async function GET(req: Request) {
  const requestId = nanoid(10);
  const auth = await resolveMobileAuth(req.headers.get("authorization"));
  if (!auth) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Sign in required", requestId },
      { status: 401 },
    );
  }

  const where =
    auth.account.role === "DOCTOR"
      ? {
          OR: [
            { providerId: auth.account.id },
            {
              providerId: null,
              status: { in: ["SEARCHING_PROVIDER", "PROVIDER_NOTIFIED"] as const },
            },
          ],
        }
      : { patientId: auth.account.id };

  const bookings = await prisma.careBooking.findMany({
    where,
    include: { provider: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    items: bookings.map(toBookingSummary),
    requestId,
  });
}

export async function POST(req: Request) {
  const requestId = nanoid(10);
  const auth = await resolveMobileAuth(req.headers.get("authorization"));
  if (!auth || !requireRole(auth.account, ["PATIENT"])) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Patient session required", requestId },
      { status: 401 },
    );
  }

  const idempotencyHeader = req.headers.get("idempotency-key");
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid JSON body", requestId },
      { status: 400 },
    );
  }

  const parsed = createSchema.safeParse({
    ...(typeof json === "object" && json ? json : {}),
    idempotencyKey:
      (typeof json === "object" &&
        json &&
        "idempotencyKey" in json &&
        (json as { idempotencyKey?: string }).idempotencyKey) ||
      idempotencyHeader,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid booking payload", requestId },
      { status: 400 },
    );
  }

  const existing = await prisma.careBooking.findUnique({
    where: { idempotencyKey: parsed.data.idempotencyKey },
    include: { provider: { select: { name: true } } },
  });
  if (existing) {
    return NextResponse.json({ ...toBookingSummary(existing), requestId });
  }

  const booking = await prisma.$transaction(async (tx) => {
    const created = await tx.careBooking.create({
      data: {
        patientId: auth.account.id,
        serviceKind: parsed.data.serviceKind,
        status: "REQUEST_CREATED",
        addressLine: parsed.data.addressLine,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        notes: parsed.data.notes,
        idempotencyKey: parsed.data.idempotencyKey,
      },
      include: { provider: { select: { name: true } } },
    });

    await tx.careBookingEvent.create({
      data: {
        bookingId: created.id,
        status: "REQUEST_CREATED",
        message: "Booking request created",
      },
    });

    const searching = await tx.careBooking.update({
      where: { id: created.id },
      data: { status: "SEARCHING_PROVIDER" },
      include: { provider: { select: { name: true } } },
    });

    await tx.careBookingEvent.create({
      data: {
        bookingId: created.id,
        status: "SEARCHING_PROVIDER",
        message: "Searching verified providers nearby",
      },
    });

    const onlineDoctor = await tx.careProviderProfile.findFirst({
      where: { isOnline: true, isVerified: true },
      orderBy: { updatedAt: "desc" },
    });

    if (onlineDoctor) {
      const notified = await tx.careBooking.update({
        where: { id: created.id },
        data: { status: "PROVIDER_NOTIFIED" },
        include: { provider: { select: { name: true } } },
      });
      await tx.careBookingEvent.create({
        data: {
          bookingId: created.id,
          status: "PROVIDER_NOTIFIED",
          message: "Provider notified",
        },
      });
      return notified;
    }

    return searching;
  });

  return NextResponse.json(
    { ...toBookingSummary(booking), requestId },
    { status: 201 },
  );
}
