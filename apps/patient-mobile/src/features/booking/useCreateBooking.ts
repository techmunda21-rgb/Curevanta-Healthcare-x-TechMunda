import { createBookingInputSchema } from "@curevanta/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/services/api";
import { secureTokenStore } from "@curevanta/auth";

function randomUuid() {
  // Expo / RN crypto.randomUUID is available on modern runtimes
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useEnsurePatientSession() {
  return useMutation({
    mutationFn: async () => {
      const existing = await secureTokenStore.getAccessToken();
      if (existing) return existing;
      const login = await apiClient.auth.login({
        email: "patient@curevanta.com",
        password: "Curevanta@2026",
      });
      await secureTokenStore.setTokens({
        accessToken: login.accessToken,
        refreshToken: login.refreshToken,
      });
      return login.accessToken;
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const ensureSession = useEnsurePatientSession();

  return useMutation({
    mutationFn: async (input: {
      serviceKind:
        | "DOCTOR_AT_HOME"
        | "NURSE_AT_HOME"
        | "DIAGNOSTICS"
        | "PHYSIOTHERAPY"
        | "FOLLOW_UP";
      addressLine: string;
      latitude: number;
      longitude: number;
      notes?: string;
    }) => {
      await ensureSession.mutateAsync();
      const payload = createBookingInputSchema.parse({
        ...input,
        idempotencyKey: randomUuid(),
      });
      return apiClient.bookings.create(payload, payload.idempotencyKey);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
