import type {
  Bug,
  BugSeverity,
  Blocker,
  BlockerStatus,
  Task,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import { healthFromScore, readinessFromScore } from "@/lib/utils";

export type HealthInput = {
  tasks: Pick<Task, "status" | "priority" | "dueDate" | "estimatedHours" | "actualHours">[];
  blockers: Pick<Blocker, "status" | "priority">[];
  bugs: Pick<Bug, "severity" | "status">[];
  budgetAllocated: number;
  budgetSpent: number;
  teamUtilizationPct: number;
  releaseReadinessScore: number;
  scheduleVariancePct: number; // negative = behind
};

export type ProjectHealthResult = {
  score: number;
  status: "ON_TRACK" | "AT_RISK" | "CRITICAL";
  components: {
    schedule: number;
    taskCompletion: number;
    p0Completion: number;
    blockers: number;
    qa: number;
    budget: number;
    teamCapacity: number;
    releaseReadiness: number;
  };
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function calculateProjectHealth(input: HealthInput): ProjectHealthResult {
  const total = input.tasks.length || 1;
  const done = input.tasks.filter((t) => t.status === "DONE" || t.status === "APPROVED").length;
  const taskCompletion = (done / total) * 100;

  const p0 = input.tasks.filter((t) => t.priority === "P0");
  const p0Done = p0.filter((t) => t.status === "DONE" || t.status === "APPROVED").length;
  const p0Completion = p0.length ? (p0Done / p0.length) * 100 : 100;

  const openBlockers = input.blockers.filter((b) => b.status === "OPEN" || b.status === "ESCALATED");
  const p0Blockers = openBlockers.filter((b) => b.priority === "P0").length;
  const blockerScore = clamp(100 - openBlockers.length * 8 - p0Blockers * 15);

  const openCriticalBugs = input.bugs.filter(
    (b) =>
      (b.severity === "CRITICAL" || b.severity === "HIGH") &&
      (b.status === "OPEN" || b.status === "IN_PROGRESS"),
  ).length;
  const qaScore = clamp(100 - openCriticalBugs * 12);

  const budgetUsedPct =
    input.budgetAllocated > 0 ? (input.budgetSpent / input.budgetAllocated) * 100 : 0;
  const budgetScore =
    budgetUsedPct > 95 ? 30 : budgetUsedPct > 85 ? 55 : budgetUsedPct > 70 ? 75 : 95;

  const util = input.teamUtilizationPct;
  const teamScore = util > 110 ? 40 : util > 100 ? 60 : util < 40 ? 70 : 90;

  const scheduleScore = clamp(75 + input.scheduleVariancePct);

  const components = {
    schedule: Math.round(scheduleScore),
    taskCompletion: Math.round(taskCompletion),
    p0Completion: Math.round(p0Completion),
    blockers: Math.round(blockerScore),
    qa: Math.round(qaScore),
    budget: Math.round(budgetScore),
    teamCapacity: Math.round(teamScore),
    releaseReadiness: Math.round(clamp(input.releaseReadinessScore)),
  };

  const score = Math.round(
    components.schedule * 0.15 +
      components.taskCompletion * 0.15 +
      components.p0Completion * 0.15 +
      components.blockers * 0.15 +
      components.qa * 0.1 +
      components.budget * 0.1 +
      components.teamCapacity * 0.1 +
      components.releaseReadiness * 0.1,
  );

  return {
    score: clamp(score),
    status: healthFromScore(score),
    components,
  };
}

export function calculateReleaseReadiness(input: {
  p0CompletionPct: number;
  qaPassPct: number;
  securityOk: boolean;
  uatOk: boolean;
  infraOk: boolean;
  docsOk: boolean;
  criticalBugs: number;
  monitoringOk: boolean;
  backupOk: boolean;
}): { score: number; status: "READY" | "AT_RISK" | "NOT_READY" } {
  let score = 0;
  score += input.p0CompletionPct * 0.2;
  score += input.qaPassPct * 0.15;
  score += input.securityOk ? 12 : 0;
  score += input.uatOk ? 12 : 0;
  score += input.infraOk ? 10 : 0;
  score += input.docsOk ? 8 : 0;
  score += clamp(100 - input.criticalBugs * 20) * 0.1;
  score += input.monitoringOk ? 7 : 0;
  score += input.backupOk ? 6 : 0;

  const rounded = Math.round(clamp(score));
  return { score: rounded, status: readinessFromScore(rounded) };
}

export function signalTone(args: {
  p0Overdue: number;
  criticalBugs: number;
  budgetUsedPct: number;
  releaseReadiness: number;
  daysToRelease: number | null;
  sprintBehind: boolean;
  p1Blocked: number;
}): "RED" | "AMBER" | "GREEN" {
  if (
    args.p0Overdue > 0 ||
    args.criticalBugs > 0 ||
    args.budgetUsedPct > 90 ||
    (args.daysToRelease !== null &&
      args.daysToRelease < 30 &&
      args.releaseReadiness < 60)
  ) {
    return "RED";
  }
  if (args.sprintBehind || args.p1Blocked > 0 || args.budgetUsedPct > 75) {
    return "AMBER";
  }
  return "GREEN";
}

export type { TaskStatus, TaskPriority, BlockerStatus, BugSeverity };
