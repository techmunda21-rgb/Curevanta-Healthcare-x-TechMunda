/** Backend-authoritative booking lifecycle (mobile renders; does not invent). */
export const BOOKING_STATUSES = [
  "REQUEST_CREATED",
  "SEARCHING_PROVIDER",
  "PROVIDER_NOTIFIED",
  "PROVIDER_ACCEPTED",
  "ON_THE_WAY",
  "ARRIVING",
  "ARRIVED",
  "SERVICE_STARTED",
  "SERVICE_COMPLETED",
  "PAYMENT_PENDING",
  "PAYMENT_COMPLETED",
  "CLOSED",
  "CANCELLED",
  "EXPIRED",
  "NO_PROVIDER_FOUND",
  "NO_SHOW",
  "DISPUTED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type ServiceKind =
  | "DOCTOR_AT_HOME"
  | "NURSE_AT_HOME"
  | "DIAGNOSTICS"
  | "PHYSIOTHERAPY"
  | "FOLLOW_UP";

export type BookingSummary = {
  id: string;
  status: BookingStatus;
  serviceKind: ServiceKind;
  etaMinutes?: number | null;
  providerName?: string | null;
  providerId?: string | null;
  createdAt: string;
  updatedAt: string;
};
