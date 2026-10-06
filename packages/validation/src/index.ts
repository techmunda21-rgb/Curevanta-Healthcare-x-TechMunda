import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10, "Enter a valid phone number")
  .max(15);

export const otpSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(/^\d+$/, "OTP must be digits only");

export const createBookingInputSchema = z.object({
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

export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;
