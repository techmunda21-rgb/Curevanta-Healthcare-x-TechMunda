import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole, resolveMobileAuth } from "@/lib/mobile/auth";
import { appendBookingEvent, toBookingSummary } from "@/lib/mobile/booking";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  etaMinutes: z.number().int().min(0).max(240).optional(),
});

export async function POST(req: Request, { params }: Params) {
  const requestId = nanoid(10);
  const { id } = await params;
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
      { code: "VALIDATION_ERROR", message: "Invalid location payload", requestId },
      { status: 400 },
    );
  }

  const booking = await prisma.careBooking.findUnique({ where: { id } });
  if (!booking || booking.providerId !== auth.account.id) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "Not the assigned provider", requestId },
      { status: 403 },
    );
  }

  const activeStatuses = [
    "PROVIDER_ACCEPTED",
    "ON_THE_WAY",
    "ARRIVING",
    "ARRIVED",
    "SERVICE_STARTED",
  ] as const;
  if (!activeStatuses.includes(booking.status as (typeof activeStatuses)[number])) {
    return NextResponse.json(
      { code: "INVALID_STATE", message: "Location updates not allowed in this state", requestId },
      { status: 409 },
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.careProviderProfile.update({
      where: { accountId: auth.account.id },
      data: {
        lastLatitude: parsed.data.latitude,
        lastLongitude: parsed.data.longitude,
        lastLocationAt: new Date(),
      },
    }),
    prisma.careBooking.update({
      where: { id },
      data: {
        etaMinutes: parsed.data.etaMinutes ?? booking.etaMinutes,
        status: booking.status === "PROVIDER_ACCEPTED" ? "ON_THE_WAY" : booking.status,
      },
      include: { provider: { select: { name: true } } },
    }),
  ]);

  const bookingRow = await prisma.careBooking.findUnique({
    where: { id },
    include: { provider: { select: { name: true } } },
  });

  await appendBookingEvent(id, bookingRow!.status, "Provider location updated", {
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
  });

  void updated;

  return NextResponse.json({
    ...toBookingSummary(bookingRow!),
    providerLatitude: parsed.data.latitude,
    providerLongitude: parsed.data.longitude,
    requestId,
  });
}
