import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { resolveMobileAuth } from "@/lib/mobile/auth";
import { toBookingSummary } from "@/lib/mobile/booking";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const requestId = nanoid(10);
  const { id } = await params;
  const auth = await resolveMobileAuth(req.headers.get("authorization"));
  if (!auth) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Sign in required", requestId },
      { status: 401 },
    );
  }

  const booking = await prisma.careBooking.findUnique({
    where: { id },
    include: {
      provider: { select: { name: true } },
      events: { orderBy: { createdAt: "asc" }, take: 50 },
    },
  });

  if (!booking) {
    return NextResponse.json(
      { code: "NOT_FOUND", message: "Booking not found", requestId },
      { status: 404 },
    );
  }

  const allowed =
    booking.patientId === auth.account.id ||
    booking.providerId === auth.account.id ||
    (auth.account.role === "DOCTOR" &&
      !booking.providerId &&
      (booking.status === "SEARCHING_PROVIDER" ||
        booking.status === "PROVIDER_NOTIFIED"));

  if (!allowed) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "Not allowed for this booking", requestId },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ...toBookingSummary(booking),
    addressLine: booking.addressLine,
    latitude: booking.latitude,
    longitude: booking.longitude,
    notes: booking.notes,
    events: booking.events.map((e) => ({
      id: e.id,
      status: e.status,
      message: e.message,
      latitude: e.latitude,
      longitude: e.longitude,
      createdAt: e.createdAt.toISOString(),
    })),
    requestId,
  });
}
