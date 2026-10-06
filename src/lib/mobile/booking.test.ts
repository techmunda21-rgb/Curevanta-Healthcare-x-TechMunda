import { describe, expect, it } from "vitest";
import { hashToken } from "@/lib/mobile/auth";
import { toBookingSummary } from "@/lib/mobile/booking";

describe("mobile booking helpers", () => {
  it("hashes tokens stably", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("maps booking summary without inventing status", () => {
    const summary = toBookingSummary({
      id: "b1",
      status: "ON_THE_WAY",
      serviceKind: "DOCTOR_AT_HOME",
      etaMinutes: 12,
      providerId: "d1",
      createdAt: new Date("2026-10-06T10:00:00.000Z"),
      updatedAt: new Date("2026-10-06T10:05:00.000Z"),
      provider: { name: "Dr. Meera Shah" },
    });

    expect(summary).toMatchObject({
      id: "b1",
      status: "ON_THE_WAY",
      providerName: "Dr. Meera Shah",
      etaMinutes: 12,
    });
  });
});
