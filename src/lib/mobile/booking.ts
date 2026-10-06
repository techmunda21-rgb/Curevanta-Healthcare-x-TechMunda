import { prisma } from "@/lib/db";
import type { CareBookingStatus } from "@prisma/client";

export function toBookingSummary(booking: {
  id: string;
  status: CareBookingStatus;
  serviceKind: string;
  etaMinutes: number | null;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  provider?: { name: string } | null;
}) {
  return {
    id: booking.id,
    status: booking.status,
    serviceKind: booking.serviceKind,
    etaMinutes: booking.etaMinutes,
    providerId: booking.providerId,
    providerName: booking.provider?.name ?? null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}

export async function appendBookingEvent(
  bookingId: string,
  status: CareBookingStatus,
  message?: string,
  coords?: { latitude: number; longitude: number },
) {
  await prisma.careBookingEvent.create({
    data: {
      bookingId,
      status,
      message,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    },
  });
}
