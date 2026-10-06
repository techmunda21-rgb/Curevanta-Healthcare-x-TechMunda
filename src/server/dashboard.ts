import { prisma } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import { calculateProjectHealth, signalTone } from "@/lib/health";
import {
  budgetRemaining,
  budgetUsedPct,
  monthlyBurn,
  utilizationPct,
  variance,
  variancePct,
} from "@/lib/finance/calculations";
import { daysUntil, greetingForHour } from "@/lib/utils";
import type { TaskStatus } from "@prisma/client";

const DONE_STATUSES: TaskStatus[] = ["DONE", "APPROVED"];
const OPEN_STATUSES: TaskStatus[] = [
  "BACKLOG",
  "READY",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "QA",
  "REWORK",
  "CLIENT_REVIEW",
];
const ACTIVE_STATUSES: TaskStatus[] = [
  "READY",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "QA",
  "REWORK",
  "CLIENT_REVIEW",
];

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getFounderDashboard(projectCode = "CUR") {
  const project = await prisma.project.findFirst({
    where: {
      OR: [{ code: projectCode }, { isPrimary: true }],
    },
    include: {
      workstreams: { orderBy: { sortOrder: "asc" } },
      milestones: {
        include: { items: true },
        orderBy: { sortOrder: "asc" },
      },
      sprints: {
        where: { status: { in: ["ACTIVE", "PLANNED"] } },
        orderBy: { startDate: "desc" },
        take: 3,
      },
      budgets: true,
      releases: { orderBy: { createdAt: "desc" }, take: 1 },
      members: {
        include: {
          employee: {
            include: {
              skills: true,
              assignedTasks: {
                where: { status: { in: ACTIVE_STATUSES } },
                include: {
                  blockers: {
                    where: { status: { in: ["OPEN", "IN_PROGRESS", "ESCALATED"] } },
                  },
                },
                orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
                take: 5,
              },
            },
          },
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [
    tasks,
    blockers,
    bugs,
    pendingApprovals,
    expensesThisMonth,
    clients,
    travelEvents,
    changeRequests,
    documents,
  ] = await Promise.all([
    prisma.task.findMany({
      where: { projectId: project.id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            title: true,
            employeeCode: true,
          },
        },
        workstream: { select: { id: true, name: true, type: true } },
        sprint: { select: { id: true, name: true, status: true } },
        blockers: {
          where: { status: { in: ["OPEN", "IN_PROGRESS", "ESCALATED"] } },
        },
      },
    }),
    prisma.blocker.findMany({
      where: {
        OR: [{ task: { projectId: project.id } }, { taskId: null }],
        status: { in: ["OPEN", "IN_PROGRESS", "ESCALATED"] },
      },
      include: {
        owner: { select: { id: true, name: true, title: true } },
        task: { select: { id: true, taskCode: true, title: true, priority: true } },
      },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.bug.findMany({
      where: { projectId: project.id },
    }),
    prisma.approval.findMany({
      where: { status: "PENDING", OR: [{ projectId: project.id }, { projectId: null }] },
      include: {
        requester: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.expense.findMany({
      where: {
        projectId: project.id,
        date: { gte: monthStart },
        approvalStatus: { in: ["APPROVED", "PENDING"] },
      },
    }),
    prisma.client.findMany({
      where: { projectId: project.id },
      include: {
        feedback: { where: { status: "OPEN" }, take: 5 },
        contacts: true,
      },
    }),
    prisma.travelEvent.findMany({
      where: {
        projectId: project.id,
        applicationStatus: {
          in: ["WATCHLIST", "APPLY", "APPLIED", "SHORTLISTED", "SELECTED", "ATTENDING"],
        },
      },
      orderBy: { eventDate: "asc" },
      take: 5,
    }),
    prisma.changeRequest.findMany({
      where: {
        projectId: project.id,
        status: { notIn: ["DONE", "REJECTED"] },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.document.findMany({
      where: { projectId: project.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        version: true,
        updatedAt: true,
      },
    }),
  ]);

  const activeSprint =
    project.sprints.find((s) => s.status === "ACTIVE") ?? project.sprints[0] ?? null;

  const totalTasks = tasks.length;
  const openTasks = tasks.filter((t) => OPEN_STATUSES.includes(t.status)).length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const inReview = tasks.filter((t) => t.status === "IN_REVIEW" || t.status === "QA").length;
  const blocked = tasks.filter((t) => t.status === "BLOCKED").length;
  const completed = tasks.filter((t) => DONE_STATUSES.includes(t.status)).length;
  const overdue = tasks.filter(
    (t) => t.dueDate && t.dueDate < now && !DONE_STATUSES.includes(t.status),
  ).length;

  const yesterdayCompleted = await prisma.taskActivity.count({
    where: {
      action: "STATUS_CHANGE",
      toValue: { in: DONE_STATUSES },
      createdAt: { gte: yesterday, lt: today },
      task: { projectId: project.id },
    },
  });

  const todayActive = tasks.filter((t) => ACTIVE_STATUSES.includes(t.status)).length;

  const completionPct =
    totalTasks > 0 ? Math.round((completed / totalTasks) * 1000) / 10 : 0;

  const employees = project.members.map((m) => m.employee);
  const utilScores = employees.map((emp) => {
    const hrs = emp.assignedTasks.reduce((s, t) => s + t.estimatedHours, 0);
    return utilizationPct(hrs, emp.weeklyCapacityHrs);
  });
  const teamUtilizationPct =
    utilScores.length > 0
      ? Math.round((utilScores.reduce((a, b) => a + b, 0) / utilScores.length) * 10) / 10
      : 0;

  const remaining = budgetRemaining(
    project.budgetAllocatedInr,
    project.budgetSpentInr,
    project.budgetCommittedInr,
  );
  const usedPct = budgetUsedPct(project.budgetAllocatedInr, project.budgetSpentInr);
  const expenseSum = expensesThisMonth.reduce((s, e) => s + e.amountInr, 0);
  const currentMonthBurn = monthlyBurn(expenseSum, 0);
  const budgetVarianceInr = variance(
    project.budgetSpentInr + project.budgetCommittedInr,
    project.budgetAllocatedInr,
  );
  const budgetVariancePct = variancePct(
    project.budgetSpentInr + project.budgetCommittedInr,
    project.budgetAllocatedInr,
  );

  const release = project.releases[0] ?? null;
  const releaseReadinessScore = release?.readinessScore ?? 0;
  const daysToRelease = daysUntil(project.targetReleaseDate);

  let scheduleVariancePct = 0;
  if (project.createdAt && project.targetReleaseDate) {
    const totalMs = project.targetReleaseDate.getTime() - project.createdAt.getTime();
    const elapsedMs = now.getTime() - project.createdAt.getTime();
    const expectedPct = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 0;
    scheduleVariancePct = completionPct - expectedPct;
  }

  const health = calculateProjectHealth({
    tasks,
    blockers,
    bugs,
    budgetAllocated: project.budgetAllocatedInr,
    budgetSpent: project.budgetSpentInr,
    teamUtilizationPct,
    releaseReadinessScore,
    scheduleVariancePct,
  });

  const p0Overdue = tasks.filter(
    (t) =>
      t.priority === "P0" &&
      t.dueDate &&
      t.dueDate < now &&
      !DONE_STATUSES.includes(t.status),
  ).length;
  const criticalBugs = bugs.filter(
    (b) =>
      (b.severity === "CRITICAL" || b.severity === "HIGH") &&
      (b.status === "OPEN" || b.status === "IN_PROGRESS"),
  ).length;
  const p1Blocked = tasks.filter((t) => t.priority === "P1" && t.status === "BLOCKED").length;
  const sprintBehind = activeSprint
    ? activeSprint.completedPoints < activeSprint.committedPoints * 0.5 &&
      activeSprint.endDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    : false;

  const tone = signalTone({
    p0Overdue,
    criticalBugs,
    budgetUsedPct: usedPct,
    releaseReadiness: releaseReadinessScore,
    daysToRelease,
    sprintBehind,
    p1Blocked,
  });

  const criticalBlockers = blockers.filter((b) => b.priority === "P0").length;

  const workstreamProgress = project.workstreams.map((ws) => {
    const wsTasks = tasks.filter((t) => t.workstreamId === ws.id);
    const wsDone = wsTasks.filter((t) => DONE_STATUSES.includes(t.status)).length;
    const wsInProgress = wsTasks.filter((t) => t.status === "IN_PROGRESS").length;
    const wsBlocked = wsTasks.filter((t) => t.status === "BLOCKED").length;
    const progress =
      wsTasks.length > 0 ? Math.round((wsDone / wsTasks.length) * 100) : ws.progressPct;

    return {
      id: ws.id,
      type: ws.type,
      name: ws.name,
      leadId: ws.leadId,
      totalTasks: wsTasks.length,
      completed: wsDone,
      inProgress: wsInProgress,
      blocked: wsBlocked,
      progressPct: progress,
      estimatedHours: ws.estimatedHours,
      actualHours: ws.actualHours,
      costInr: ws.costInr,
      riskLevel: ws.riskLevel,
    };
  });

  const teamActivity = employees.map((emp) => {
    const current = emp.assignedTasks[0] ?? null;
    return {
      employeeId: emp.id,
      name: emp.name,
      title: emp.title,
      photoUrl: emp.photoUrl,
      status: emp.status,
      currentTask: current
        ? {
            id: current.id,
            taskCode: current.taskCode,
            title: current.title,
            priority: current.priority,
            status: current.status,
            estimatedHours: current.estimatedHours,
            dueDate: current.dueDate,
            hasBlocker: current.blockers.length > 0,
          }
        : null,
      activeTaskCount: emp.assignedTasks.length,
      hasNoTask: emp.assignedTasks.length === 0,
    };
  });

  const ai = getAIProvider();
  const aiBrief = await ai.generateDailyBrief({
    projectName: project.name,
    healthScore: health.score,
    healthStatus: health.status,
    yesterdayCompleted,
    todayActive,
    criticalBlockers,
    budgetRemainingInr: remaining,
    daysToRelease,
    founderDecisionsPending: pendingApprovals.length,
    overdueCount: overdue,
    teamUtilizationPct,
    qaRisk: criticalBugs > 0 ? `${criticalBugs} critical/high bugs open` : "QA healthy",
    releaseRisk:
      releaseReadinessScore < 60
        ? `Release readiness ${releaseReadinessScore}/100`
        : "Release on watch",
    topRecommendation:
      criticalBlockers > 0
        ? "Resolve open P0 blockers before expanding scope this sprint."
        : pendingApprovals.length > 0
          ? "Clear pending founder approvals to unblock the team."
          : "Keep sprint focus on December RC path items.",
  });

  try {
    await prisma.aIExecution.create({
      data: {
        kind: "DAILY_CTO_BRIEF",
        prompt: `founder-dashboard:${project.code}`,
        response: aiBrief,
        model: process.env.AI_MODEL ?? "gemini-2.0-flash",
        success: true,
        metadata: {
          healthScore: health.score,
          projectId: project.id,
        },
      },
    });
  } catch {
    // non-blocking
  }

  return {
    greeting: `${greetingForHour()}, Founder`,
    generatedAt: now.toISOString(),
    signalTone: tone,
    signal: tone,
    project: {
      id: project.id,
      code: project.code,
      name: project.name,
      clientName: project.clientName,
      status: project.status,
      isPrimary: project.isPrimary,
      isSeedData: project.isSeedData,
      targetReleaseDate: project.targetReleaseDate,
      internalRcStart: project.internalRcStart,
      internalRcEnd: project.internalRcEnd,
      finalLaunchDate: project.finalLaunchDate,
      completionPct,
      daysToRelease,
    },
    kpis: {
      totalTasks,
      openTasks,
      inProgress,
      inReview,
      blocked,
      completed,
      overdue,
      sprintVelocity: activeSprint?.velocity ?? 0,
      projectCompletionPct: completionPct,
      teamUtilizationPct,
      budgetUsedInr: project.budgetSpentInr,
      budgetRemainingInr: remaining,
      budgetUsedPct: Math.round(usedPct * 10) / 10,
      currentMonthBurnInr: currentMonthBurn,
      currentMonthBurn: currentMonthBurn,
      releaseHealth: releaseReadinessScore,
      releaseReadinessScore,
      releaseHealthStatus: release?.readinessStatus ?? "NOT_READY",
    },
    health: {
      ...health,
      expectedCompletionPct: Math.round(completionPct - scheduleVariancePct),
      currentCompletionPct: completionPct,
      scheduleVariancePct: Math.round(scheduleVariancePct * 10) / 10,
      budgetVarianceInr,
      budgetVariancePct: Math.round(budgetVariancePct * 10) / 10,
      criticalBlockers,
      releaseConfidence: releaseReadinessScore,
    },
    finance: {
      allocatedInr: project.budgetAllocatedInr,
      spentInr: project.budgetSpentInr,
      spent: project.budgetSpentInr,
      committedInr: project.budgetCommittedInr,
      committed: project.budgetCommittedInr,
      remainingInr: remaining,
      remaining,
      usedPct: Math.round(usedPct * 10) / 10,
      currentMonthBurnInr: currentMonthBurn,
      budgets: project.budgets.map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        allocatedInr: b.allocatedInr,
        spentInr: b.spentInr,
        committedInr: b.committedInr,
        remainingInr: budgetRemaining(b.allocatedInr, b.spentInr, b.committedInr),
      })),
      note: "₹30L is a development cost/contribution basis and does NOT automatically convert to equity.",
    },
    activeSprint: activeSprint
      ? {
          id: activeSprint.id,
          name: activeSprint.name,
          goal: activeSprint.goal,
          startDate: activeSprint.startDate,
          endDate: activeSprint.endDate,
          status: activeSprint.status,
          committedPoints: activeSprint.committedPoints,
          completedPoints: activeSprint.completedPoints,
          velocity: activeSprint.velocity,
          carryoverCount: activeSprint.carryoverCount,
          completionPct:
            activeSprint.committedPoints > 0
              ? Math.round(
                  (activeSprint.completedPoints / activeSprint.committedPoints) * 1000,
                ) / 10
              : 0,
        }
      : null,
    workstreams: workstreamProgress.map((ws) => ({
      ...ws,
      tasks: ws.totalTasks,
    })),
    milestones: project.milestones,
    teamActivity: teamActivity.map((row) => ({
      ...row,
      id: row.employeeId,
    })),
    topBlockers: blockers.slice(0, 8),
    pendingApprovals,
    clientFeedback: clients.flatMap((c) =>
      c.feedback.map((f) => ({
        ...f,
        clientCompany: c.company,
        clientHealth: c.health,
      })),
    ),
    changeRequests,
    travelEvents,
    release,
    recentDocuments: documents,
    bugs: {
      open: bugs.filter((b) => b.status === "OPEN" || b.status === "IN_PROGRESS").length,
      critical: criticalBugs,
      total: bugs.length,
    },
    founderActionCenter: {
      approvals: pendingApprovals.length,
      blockers: blockers.length,
      clientDecisions: changeRequests.filter((cr) =>
        ["FOUNDER_APPROVAL", "CLIENT_APPROVAL", "CLIENT_REQUEST"].includes(cr.status),
      ).length,
      budgetAlerts: usedPct > 75 ? 1 : 0,
      releaseRisks:
        releaseReadinessScore < 60 || (daysToRelease !== null && daysToRelease < 45) ? 1 : 0,
    },
    founderActions: {
      approvals: pendingApprovals,
      blockers: blockers.slice(0, 5),
    },
    aiBrief,
  };
}

export async function getPrimaryProject() {
  return prisma.project.findFirst({
    where: { OR: [{ code: "CUR" }, { isPrimary: true }] },
  });
}
