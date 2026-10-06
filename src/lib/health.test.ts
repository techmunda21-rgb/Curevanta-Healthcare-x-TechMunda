import { describe, expect, it } from "vitest";
import { calculateProjectHealth } from "./health";
import { budgetRemaining, utilizationPct } from "./finance/calculations";
import { healthFromScore, readinessFromScore } from "./utils";

describe("finance calculations", () => {
  it("computes remaining after spent + committed", () => {
    expect(budgetRemaining(3_000_000, 1_000_000, 500_000)).toBe(1_500_000);
  });

  it("computes utilization", () => {
    expect(utilizationPct(40, 40)).toBe(100);
    expect(utilizationPct(50, 40)).toBe(125);
  });
});

describe("health scoring", () => {
  it("maps scores to statuses", () => {
    expect(healthFromScore(80)).toBe("ON_TRACK");
    expect(healthFromScore(60)).toBe("AT_RISK");
    expect(healthFromScore(40)).toBe("CRITICAL");
    expect(readinessFromScore(85)).toBe("READY");
  });

  it("calculates project health from inputs", () => {
    const result = calculateProjectHealth({
      tasks: [
        { status: "DONE", priority: "P0", dueDate: null, estimatedHours: 4, actualHours: 4 },
        { status: "IN_PROGRESS", priority: "P1", dueDate: null, estimatedHours: 8, actualHours: 2 },
      ],
      blockers: [],
      bugs: [],
      budgetAllocated: 3_000_000,
      budgetSpent: 1_000_000,
      teamUtilizationPct: 75,
      releaseReadinessScore: 50,
      scheduleVariancePct: 0,
    });
    expect(result.score).toBeGreaterThan(50);
    expect(["ON_TRACK", "AT_RISK", "CRITICAL"]).toContain(result.status);
  });
});
