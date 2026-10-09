import { describe, expect, it } from "vitest";
import {
  buildLatencySamples,
  predictLatencyMinutes,
  trainLatencyModel,
} from "@/lib/ai/latency-model";

describe("latency model", () => {
  it("trains and predicts lower latency for online urgent cases", () => {
    const providers = Array.from({ length: 40 }, (_, i) => ({
      code: `P${i}`,
      city: i % 2 ? "Bengaluru" : "Jaipur",
      state: "KA",
      specialty: "General Medicine",
      experienceYears: 5 + (i % 15),
      rating: 4 + (i % 10) / 10,
      online: i % 3 !== 0,
      homeVisit: true,
    }));
    const patients = Array.from({ length: 40 }, (_, i) => ({
      code: `U${i}`,
      city: i % 2 ? "Bengaluru" : "Jaipur",
      state: "KA",
      urgency: i % 4 === 0 ? "Emergency" : "Routine",
      preferredMode: "Home Visit",
      careNeed: "General Consultation",
    }));

    const samples = buildLatencySamples(providers, patients, 80);
    const artifact = trainLatencyModel(samples);
    expect(artifact.sampleCount).toBeGreaterThan(20);
    expect(artifact.maeMinutes).toBeLessThan(8);

    const urgentOnline = predictLatencyMinutes(artifact.weights, {
      urgencyScore: 1,
      onlineScore: 1,
      experienceScore: 0.8,
      ratingScore: 0.9,
      homeVisitScore: 1,
      metroScore: 1,
      careNeedScore: 0.3,
    });
    const routineOffline = predictLatencyMinutes(artifact.weights, {
      urgencyScore: 0.15,
      onlineScore: 0,
      experienceScore: 0.2,
      ratingScore: 0.4,
      homeVisitScore: 0.3,
      metroScore: 0.4,
      careNeedScore: 0.3,
    });
    expect(urgentOnline).toBeLessThan(routineOffline);
  });
});
