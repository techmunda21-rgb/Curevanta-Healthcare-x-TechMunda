import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { requireRole, resolveMobileAuth } from "@/lib/mobile/auth";
import { toBookingSummary } from "@/lib/mobile/booking";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/**
 * Atomic doctor accept — only one provider can win.
 * Uses conditional update: providerId null + notifiable status.
 */
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

  const profile = await prisma.careProviderProfile.findUnique({
    where: { accountId: auth.account.id },
  });
  if (!profile?.isVerified) {
    return NextResponse.json(
      { code: "FORBIDDEN", message: "Verified provider profile required", requestId },
      { status: 403 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.careBooking.updateMany({
        where: {
          id,
          providerId: null,
          status: { in: ["SEARCHING_PROVIDER", "PROVIDER_NOTIFIED"] },
        },
        data: {
          providerId: auth.account.id,
          status: "PROVIDER_ACCEPTED",
          acceptedAt: new Date(),
          etaMinutes: 12,
        },
      });

      if (updated.count !== 1) {
        return null;
      }

      await tx.careBookingEvent.create({
        data: {
          bookingId: id,
          status: "PROVIDER_ACCEPTED",
          message: "Provider accepted booking",
        },
      });

      const onWay = await tx.careBooking.update({
        where: { id },
        data: { status: "ON_THE_WAY" },
        include: { provider: { select: { name: true } } },
      });

      await tx.careBookingEvent.create({
        data: {
          bookingId: id,
          status: "ON_THE_WAY",
          message: "Provider is on the way",
        },
      });

      return onWay;
    });

    if (!result) {
      return NextResponse.json(
        {
          code: "ACCEPT_CONFLICT",
          message: "Booking already assigned or not available",
          requestId,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ ...toBookingSummary(result), requestId });
  } catch {
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Accept failed", requestId },
      { status: 500 },
    );
  }
}
