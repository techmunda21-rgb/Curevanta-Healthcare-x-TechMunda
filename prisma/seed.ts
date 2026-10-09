/**
 * DEVELOPMENT SEED DATA ONLY
 * Password for all demo users: Founder@2026
 * Never treat these as real company records.
 */
import {
  PrismaClient,
  SystemRole,
  EmploymentType,
  EmployeeStatus,
  WorkstreamType,
  TaskPriority,
  TaskStatus,
  ExpenseCategory,
  ApprovalCategory,
  ApprovalStatus,
  TravelStatus,
  BugSeverity,
  Environment,
  DocumentCategory,
  DocumentVisibility,
  EquityType,
  ChangeRequestStatus,
  BlockerStatus,
  NotificationType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TechMunda Control Tower (DEV DATA)...");

  await prisma.aIExecution.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.testRunCase.deleteMany();
  await prisma.testRun.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.bug.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.release.deleteMany();
  await prisma.changeRequest.deleteMany();
  await prisma.clientFeedback.deleteMany();
  await prisma.clientContact.deleteMany();
  await prisma.client.deleteMany();
  await prisma.expoLead.deleteMany();
  await prisma.travelEventAttendee.deleteMany();
  await prisma.travelEvent.deleteMany();
  await prisma.equityTransaction.deleteMany();
  await prisma.equityHolder.deleteMany();
  await prisma.payrollRecord.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.blocker.deleteMany();
  await prisma.standup.deleteMany();
  await prisma.worklog.deleteMany();
  await prisma.taskActivity.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.task.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.workstream.deleteMany();
  await prisma.milestoneItem.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.employeeSkill.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Founder@2026", 10);

  const founder = await prisma.user.create({
    data: {
      email: "founder@techmunda.com",
      name: "Founder",
      passwordHash,
      role: SystemRole.FOUNDER,
    },
  });
  const cto = await prisma.user.create({
    data: {
      email: "cto@techmunda.com",
      name: "CTO",
      passwordHash,
      role: SystemRole.CTO,
    },
  });
  const pm = await prisma.user.create({
    data: {
      email: "pm@techmunda.com",
      name: "Project Manager",
      passwordHash,
      role: SystemRole.PROJECT_MANAGER,
    },
  });

  const project = await prisma.project.create({
    data: {
      code: "CUR",
      name: "Curevanta",
      description:
        "Healthcare platform — patient, doctor, career/ops apps with realtime dispatch. DEV SEED.",
      clientName: "Curevanta Stakeholders",
      status: "ACTIVE",
      isPrimary: true,
      isSeedData: true,
      budgetAllocatedInr: 3_000_000,
      budgetSpentInr: 1_160_000,
      budgetCommittedInr: 420_000,
      completionPct: 38,
      healthScore: 78,
      healthStatus: "ON_TRACK",
      targetReleaseDate: new Date("2026-12-31"),
      internalRcStart: new Date("2026-12-15"),
      internalRcEnd: new Date("2026-12-20"),
      finalLaunchDate: new Date("2026-12-31"),
    },
  });

  const workstreamDefs: { type: WorkstreamType; name: string; order: number; progress: number }[] = [
    { type: "PRODUCT_UIUX", name: "Product/UIUX", order: 1, progress: 55 },
    { type: "MOBILE_PATIENT", name: "Mobile - Patient", order: 2, progress: 42 },
    { type: "MOBILE_DOCTOR", name: "Mobile - Doctor", order: 3, progress: 35 },
    { type: "MOBILE_CAREER_OPS", name: "Mobile - Career/Ops", order: 4, progress: 28 },
    { type: "BACKEND_API", name: "Backend/API", order: 5, progress: 48 },
    { type: "REALTIME_DISPATCH", name: "Realtime/Dispatch", order: 6, progress: 22 },
    { type: "QA_SECURITY", name: "QA/Security", order: 7, progress: 30 },
    { type: "DEVOPS_RELEASE", name: "DevOps/Release", order: 8, progress: 40 },
    { type: "AI_DATA", name: "AI/Data", order: 9, progress: 25 },
  ];

  const workstreams = await Promise.all(
    workstreamDefs.map((w) =>
      prisma.workstream.create({
        data: {
          projectId: project.id,
          type: w.type,
          name: w.name,
          sortOrder: w.order,
          progressPct: w.progress,
          estimatedHours: 320,
          actualHours: Math.round(320 * (w.progress / 100)),
          costInr: Math.round(250000 * (w.progress / 100)),
          riskLevel: w.progress < 30 ? "HIGH" : w.progress < 45 ? "MEDIUM" : "LOW",
        },
      }),
    ),
  );

  const ws = Object.fromEntries(workstreams.map((w) => [w.type, w]));

  type EmpSeed = {
    code: string;
    name: string;
    email: string;
    title: string;
    department: string;
    domain: string;
    cost: number;
    role: SystemRole;
    skills: string[];
    status: EmployeeStatus;
  };

  const empSeeds: EmpSeed[] = [
    {
      code: "TM-001",
      name: "Founder / Tech Lead",
      email: "founder.eng@techmunda.com",
      title: "Founder / Tech Lead",
      department: "Engineering",
      domain: "Architecture",
      cost: 125000,
      role: SystemRole.TECH_LEAD,
      skills: ["TypeScript", "NestJS", "PostgreSQL", "Redis", "AI Gateway", "AWS", "Architecture"],
      status: "ACTIVE",
    },
    {
      code: "TM-002",
      name: "Aanya Patient Dev",
      email: "patient.dev@techmunda.com",
      title: "Mobile Engineer — Patient",
      department: "Engineering",
      domain: "Patient App",
      cost: 65000,
      role: SystemRole.DEVELOPER,
      skills: ["React Native", "Expo", "TypeScript", "TanStack Query"],
      status: "ACTIVE",
    },
    {
      code: "TM-003",
      name: "Rohan Doctor Dev",
      email: "doctor.dev@techmunda.com",
      title: "Mobile Engineer — Doctor",
      department: "Engineering",
      domain: "Doctor App",
      cost: 65000,
      role: SystemRole.DEVELOPER,
      skills: ["React Native", "Expo", "TypeScript", "Socket.IO", "Maps"],
      status: "ACTIVE",
    },
    {
      code: "TM-004",
      name: "Neha Career Dev",
      email: "career.dev@techmunda.com",
      title: "Mobile Engineer — Career/Ops",
      department: "Engineering",
      domain: "Career/Ops",
      cost: 55000,
      role: SystemRole.DEVELOPER,
      skills: ["React Native", "Expo", "TypeScript"],
      status: "AVAILABLE",
    },
    {
      code: "TM-005",
      name: "Kabir Backend",
      email: "backend@techmunda.com",
      title: "Backend Engineer",
      department: "Engineering",
      domain: "API",
      cost: 75000,
      role: SystemRole.DEVELOPER,
      skills: ["NestJS", "Prisma", "PostgreSQL", "PostGIS", "Redis", "BullMQ"],
      status: "ACTIVE",
    },
    {
      code: "TM-006",
      name: "Isha Designer",
      email: "design@techmunda.com",
      title: "UI/UX Designer",
      department: "Product",
      domain: "Design System",
      cost: 45000,
      role: SystemRole.DESIGNER,
      skills: ["Figma", "Design Systems", "UX Research"],
      status: "ACTIVE",
    },
    {
      code: "TM-007",
      name: "Vikram QA",
      email: "qa@techmunda.com",
      title: "QA / Security Engineer",
      department: "Quality",
      domain: "QA/Security",
      cost: 55000,
      role: SystemRole.QA,
      skills: ["Playwright", "Jest", "Postman", "OWASP", "Mobile QA"],
      status: "ACTIVE",
    },
    {
      code: "TM-008",
      name: "Arjun DevOps",
      email: "devops@techmunda.com",
      title: "DevOps / Cloud Engineer",
      department: "Infrastructure",
      domain: "Cloud",
      cost: 50000,
      role: SystemRole.DEVOPS,
      skills: ["Docker", "GitHub Actions", "AWS", "Monitoring"],
      status: "ACTIVE",
    },
    {
      code: "TM-009",
      name: "Meera AI",
      email: "ai@techmunda.com",
      title: "AI / Data Engineer",
      department: "AI",
      domain: "Intelligence",
      cost: 55000,
      role: SystemRole.AI_ENGINEER,
      skills: ["Python", "Gemini", "LLM APIs", "RAG", "Analytics"],
      status: "ACTIVE",
    },
  ];

  const employees: Array<{
    id: string;
    title: string;
    monthlyCostInr: number;
  }> = [];
  for (const e of empDefs(empSeeds)) {
    const user =
      e.email === "founder.eng@techmunda.com"
        ? founder
        : await prisma.user.create({
            data: {
              email: e.email,
              name: e.name,
              passwordHash,
              role: e.role,
            },
          });

    const emp = await prisma.employee.create({
      data: {
        employeeCode: e.code,
        userId: user.id,
        name: e.name,
        email: e.email,
        phone: "+91 90000 00000",
        title: e.title,
        department: e.department,
        domain: e.domain,
        employmentType: e.code === "TM-001" ? EmploymentType.FOUNDER : EmploymentType.FULL_TIME,
        joiningDate: new Date("2026-09-01"),
        monthlyCostInr: e.cost,
        weeklyCapacityHrs: 40,
        performanceScore: 78 + Math.random() * 15,
        taskCompletionPct: 70 + Math.random() * 20,
        onTimePct: 75 + Math.random() * 15,
        hoursLogged: 80 + Math.random() * 40,
        status: e.status,
        isSeedData: true,
        skills: { create: e.skills.map((name) => ({ name, level: 4 })) },
      },
    });
    employees.push(emp);
  }

  const byTitle = (t: string) => employees.find((e) => e.title.includes(t))!;
  const founderEmp = employees[0];
  const patient = byTitle("Patient");
  const doctor = byTitle("Doctor");
  const career = byTitle("Career");
  const backend = byTitle("Backend");
  const designer = byTitle("UI/UX");
  const qa = byTitle("QA");
  const devops = byTitle("DevOps");
  const ai = byTitle("AI");

  await prisma.workstream.update({
    where: { id: ws.PRODUCT_UIUX.id },
    data: { leadId: designer.id },
  });
  await prisma.workstream.update({
    where: { id: ws.MOBILE_PATIENT.id },
    data: { leadId: patient.id },
  });
  await prisma.workstream.update({
    where: { id: ws.MOBILE_DOCTOR.id },
    data: { leadId: doctor.id },
  });
  await prisma.workstream.update({
    where: { id: ws.MOBILE_CAREER_OPS.id },
    data: { leadId: career.id },
  });
  await prisma.workstream.update({
    where: { id: ws.BACKEND_API.id },
    data: { leadId: backend.id },
  });
  await prisma.workstream.update({
    where: { id: ws.REALTIME_DISPATCH.id },
    data: { leadId: backend.id },
  });
  await prisma.workstream.update({
    where: { id: ws.QA_SECURITY.id },
    data: { leadId: qa.id },
  });
  await prisma.workstream.update({
    where: { id: ws.DEVOPS_RELEASE.id },
    data: { leadId: devops.id },
  });
  await prisma.workstream.update({
    where: { id: ws.AI_DATA.id },
    data: { leadId: ai.id },
  });

  await prisma.projectMember.createMany({
    data: employees.map((e) => ({
      projectId: project.id,
      employeeId: e.id,
      role: e.title,
    })),
  });

  const team = await prisma.team.create({
    data: {
      name: "Curevanta Core",
      description: "Primary delivery team (seed)",
      leadId: founderEmp.id,
      projectId: project.id,
      members: {
        create: employees.map((e) => ({ employeeId: e.id, role: e.title })),
      },
    },
  });
  void team;

  const oct = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: "October 2026 — Foundation",
      monthLabel: "OCTOBER 2026",
      targetDate: new Date("2026-10-31"),
      status: "IN_PROGRESS",
      sortOrder: 1,
      items: {
        create: [
          { title: "Architecture", completed: true },
          { title: "Design System", completed: true },
          { title: "Database", completed: true },
          { title: "Authentication", completed: true },
          { title: "RBAC", completed: false },
          { title: "Recruitment", completed: true },
          { title: "Booking foundation", completed: false },
        ],
      },
    },
  });
  const nov = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: "November 2026 — Realtime Ops",
      monthLabel: "NOVEMBER 2026",
      targetDate: new Date("2026-11-30"),
      status: "PLANNED",
      sortOrder: 2,
      items: {
        create: [
          { title: "Provider availability" },
          { title: "Dispatch" },
          { title: "PostGIS" },
          { title: "Realtime" },
          { title: "Socket.IO" },
          { title: "Tracking" },
          { title: "Notifications" },
          { title: "Operations" },
        ],
      },
    },
  });
  const dec = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: "December 2026 — Production",
      monthLabel: "DECEMBER 2026",
      targetDate: new Date("2026-12-31"),
      status: "PLANNED",
      sortOrder: 3,
      items: {
        create: [
          { title: "Payments" },
          { title: "Analytics" },
          { title: "Security" },
          { title: "QA" },
          { title: "UAT" },
          { title: "Production" },
          { title: "App store release" },
        ],
      },
    },
  });
  void oct;
  void nov;
  void dec;

  await prisma.budget.createMany({
    data: [
      { projectId: project.id, name: "3-month team payroll", category: "PAYROLL", allocatedInr: 1_770_000, spentInr: 590_000, committedInr: 590_000, isSeedData: true },
      { projectId: project.id, name: "Cloud/APIs/tools/devices", category: "CLOUD", allocatedInr: 300_000, spentInr: 85_000, committedInr: 40_000, isSeedData: true },
      { projectId: project.id, name: "Security/QA", category: "SECURITY", allocatedInr: 200_000, spentInr: 45_000, committedInr: 20_000, isSeedData: true },
      { projectId: project.id, name: "Release/Monitoring", category: "MONITORING", allocatedInr: 100_000, spentInr: 15_000, committedInr: 10_000, isSeedData: true },
      { projectId: project.id, name: "Documentation/UAT", category: "DOCUMENTATION", allocatedInr: 100_000, spentInr: 20_000, committedInr: 0, isSeedData: true },
      { projectId: project.id, name: "Contingency/Rework", category: "REWORK", allocatedInr: 330_000, spentInr: 40_000, committedInr: 0, isSeedData: true },
      { projectId: project.id, name: "Post-launch stabilization", category: "POST_LAUNCH_SUPPORT", allocatedInr: 200_000, spentInr: 0, committedInr: 0, isSeedData: true },
    ],
  });

  const sprint = await prisma.sprint.create({
    data: {
      projectId: project.id,
      name: "Sprint 04 — Dispatch Foundations",
      goal: "Establish booking foundation + dispatch API contracts for Doctor realtime.",
      startDate: new Date("2026-10-06"),
      endDate: new Date("2026-10-19"),
      ownerId: founderEmp.id,
      committedPoints: 42,
      completedPoints: 18,
      velocity: 18,
      status: "ACTIVE",
      isSeedData: true,
    },
  });

  const taskDefs: {
    code: string;
    title: string;
    ws: WorkstreamType;
    assigneeId: string;
    priority: TaskPriority;
    status: TaskStatus;
    hours: number;
    dueOffset: number;
  }[] = [
    { code: "CUR-101", title: "Finalize design system tokens", ws: "PRODUCT_UIUX", assigneeId: designer.id, priority: "P1", status: "DONE", hours: 12, dueOffset: -3 },
    { code: "CUR-102", title: "Patient booking flow screens", ws: "MOBILE_PATIENT", assigneeId: patient.id, priority: "P0", status: "IN_PROGRESS", hours: 20, dueOffset: 2 },
    { code: "CUR-103", title: "Doctor availability calendar", ws: "MOBILE_DOCTOR", assigneeId: doctor.id, priority: "P1", status: "IN_PROGRESS", hours: 16, dueOffset: 3 },
    { code: "CUR-104", title: "Career ops shift roster", ws: "MOBILE_CAREER_OPS", assigneeId: career.id, priority: "P2", status: "READY", hours: 14, dueOffset: 5 },
    { code: "CUR-105", title: "Auth + RBAC API hardening", ws: "BACKEND_API", assigneeId: backend.id, priority: "P0", status: "IN_REVIEW", hours: 18, dueOffset: 1 },
    { code: "CUR-106", title: "Dispatch event schema", ws: "REALTIME_DISPATCH", assigneeId: backend.id, priority: "P0", status: "BLOCKED", hours: 10, dueOffset: 0 },
    { code: "CUR-107", title: "PostGIS provider radius query", ws: "BACKEND_API", assigneeId: backend.id, priority: "P1", status: "IN_PROGRESS", hours: 12, dueOffset: 4 },
    { code: "CUR-108", title: "Socket.IO gateway scaffolding", ws: "REALTIME_DISPATCH", assigneeId: doctor.id, priority: "P1", status: "BLOCKED", hours: 16, dueOffset: 2 },
    { code: "CUR-109", title: "Playwright smoke suite", ws: "QA_SECURITY", assigneeId: qa.id, priority: "P2", status: "QA", hours: 10, dueOffset: 3 },
    { code: "CUR-110", title: "OWASP checklist for auth", ws: "QA_SECURITY", assigneeId: qa.id, priority: "P1", status: "READY", hours: 8, dueOffset: 6 },
    { code: "CUR-111", title: "CI pipeline + staging deploy", ws: "DEVOPS_RELEASE", assigneeId: devops.id, priority: "P1", status: "IN_PROGRESS", hours: 14, dueOffset: 2 },
    { code: "CUR-112", title: "Gemini intake summarizer PoC", ws: "AI_DATA", assigneeId: ai.id, priority: "P2", status: "IN_PROGRESS", hours: 12, dueOffset: 5 },
    { code: "CUR-113", title: "Patient onboarding analytics", ws: "AI_DATA", assigneeId: ai.id, priority: "P3", status: "BACKLOG", hours: 8, dueOffset: 10 },
    { code: "CUR-114", title: "Design handoff — Doctor dispatch", ws: "PRODUCT_UIUX", assigneeId: designer.id, priority: "P1", status: "IN_REVIEW", hours: 6, dueOffset: 1 },
    { code: "CUR-115", title: "Staging monitoring dashboards", ws: "DEVOPS_RELEASE", assigneeId: devops.id, priority: "P2", status: "READY", hours: 8, dueOffset: 7 },
    { code: "CUR-116", title: "Patient maps integration spike", ws: "MOBILE_PATIENT", assigneeId: patient.id, priority: "P2", status: "BACKLOG", hours: 10, dueOffset: 9 },
    { code: "CUR-117", title: "UAT script draft", ws: "QA_SECURITY", assigneeId: qa.id, priority: "P2", status: "BACKLOG", hours: 6, dueOffset: 12 },
    { code: "CUR-118", title: "Architecture decision — queue rooms", ws: "BACKEND_API", assigneeId: founderEmp.id, priority: "P0", status: "IN_PROGRESS", hours: 4, dueOffset: 1 },
  ];

  function due(offset: number) {
    const d = new Date("2026-10-05");
    d.setDate(d.getDate() + offset);
    return d;
  }

  const tasks = [];
  for (let i = 0; i < taskDefs.length; i++) {
    const t = taskDefs[i];
    const task = await prisma.task.create({
      data: {
        taskCode: t.code,
        title: t.title,
        description: `Seed task for Curevanta — ${t.title}`,
        projectId: project.id,
        sprintId: sprint.id,
        workstreamId: ws[t.ws].id,
        module: t.ws,
        assigneeId: t.assigneeId,
        reviewerId: founderEmp.id,
        priority: t.priority,
        status: t.status,
        startDate: due(-5),
        dueDate: due(t.dueOffset),
        estimatedHours: t.hours,
        actualHours: t.status === "DONE" ? t.hours : Math.round(t.hours * 0.4),
        storyPoints: Math.ceil(t.hours / 4),
        techStack: [],
        founderApprovalRequired: t.priority === "P0" && t.ws === "BACKEND_API",
        kanbanOrder: i,
        isSeedData: true,
      },
    });
    tasks.push(task);
  }

  // ── Software accuracy + annotation dataset (still DEV SEED only) ──
  const byCode = Object.fromEntries(tasks.map((t) => [t.taskCode, t]));
  const accuracySpecs: Record<
    string,
    { description: string; techStack: string[]; prUrl?: string; outputUrl?: string }
  > = {
    "CUR-101": {
      description:
        "[SEED] Design tokens: primary #009B9A, spacing 4–64, motion 100–450ms. Acceptance: tokens exported for web + RN packages; contrast AA for textPrimary on background.",
      techStack: ["TypeScript", "design-tokens"],
      outputUrl: "/docs/DESIGN_SYSTEM.md",
    },
    "CUR-102": {
      description:
        "[SEED] Patient booking vertical slice UI. Acceptance: Home → Care → request; loading/empty/error states; no invented GPS. Annotate review comments on API contract drift.",
      techStack: ["Expo", "React Native", "TanStack Query"],
      prUrl: "https://github.com/example/curevanta/pull/102",
    },
    "CUR-105": {
      description:
        "[SEED] Auth + RBAC hardening. Acceptance: credentials Zod-validated; inactive users rejected; role on session JWT; audit on login success/fail.",
      techStack: ["NextAuth", "Zod", "bcrypt"],
      prUrl: "https://github.com/example/curevanta/pull/105",
    },
    "CUR-106": {
      description:
        "[SEED] Dispatch event schema (authoritative). Acceptance: booking states match CareBookingStatus; mobile must not invent transitions. Blocked pending architecture approval.",
      techStack: ["Prisma", "PostgreSQL", "Zod"],
    },
    "CUR-109": {
      description:
        "[SEED] Playwright smoke: login → tasks list → create task → kanban. Acceptance: estimatedHours ≥ 0; seed banner visible; no PHI in fixtures.",
      techStack: ["Playwright", "Vitest"],
    },
    "CUR-111": {
      description:
        "[SEED] CI: lint + test + typecheck on main; Railway deploy when token present. Acceptance: workflow green locally via npm test.",
      techStack: ["GitHub Actions", "Prisma"],
    },
  };

  for (const [code, spec] of Object.entries(accuracySpecs)) {
    const task = byCode[code];
    if (!task) continue;
    await prisma.task.update({
      where: { id: task.id },
      data: {
        description: spec.description,
        techStack: spec.techStack,
        prUrl: spec.prUrl,
        outputUrl: spec.outputUrl,
      },
    });
  }

  await prisma.taskComment.createMany({
    data: [
      {
        taskId: byCode["CUR-102"].id,
        authorId: pm.id,
        body: "[ANNOTATION][SEED] Accuracy check: Care CTA must call POST /api/mobile/bookings with Idempotency-Key; do not fake provider search progress.",
      },
      {
        taskId: byCode["CUR-102"].id,
        authorId: cto.id,
        body: "[ANNOTATION][SEED] QA: verify empty Bookings state copy + Find Care CTA; font scale 150% on Home hierarchy.",
      },
      {
        taskId: byCode["CUR-105"].id,
        authorId: cto.id,
        body: "[ANNOTATION][SEED] Security review: session cookies HttpOnly; no password hashes in logs; middleware allows /api/mobile without NextAuth cookie.",
      },
      {
        taskId: byCode["CUR-106"].id,
        authorId: founder.id,
        body: "[ANNOTATION][SEED] Founder note: keep REQUEST_CREATED→SEARCHING→PROVIDER_NOTIFIED→PROVIDER_ACCEPTED→ON_THE_WAY as backend-authoritative.",
      },
      {
        taskId: byCode["CUR-109"].id,
        authorId: pm.id,
        body: "[ANNOTATION][SEED] Regression: creating task with blank est. hours must default to 4h and never 500 Zod too_small.",
      },
      {
        taskId: byCode["CUR-111"].id,
        authorId: cto.id,
        body: "[ANNOTATION][SEED] Deploy gate: DATABASE_URL from Neon; AUTH_SECRET set; never commit .env.",
      },
      {
        taskId: byCode["CUR-101"].id,
        authorId: pm.id,
        body: "[ANNOTATION][SEED] Token parity: packages/design-tokens must match src/theme colors (primary #009B9A).",
      },
    ],
  });

  await prisma.taskActivity.createMany({
    data: [
      {
        taskId: byCode["CUR-101"].id,
        actorId: pm.id,
        action: "STATUS_CHANGE",
        fromValue: "IN_REVIEW",
        toValue: "DONE",
      },
      {
        taskId: byCode["CUR-102"].id,
        actorId: pm.id,
        action: "STATUS_CHANGE",
        fromValue: "READY",
        toValue: "IN_PROGRESS",
      },
      {
        taskId: byCode["CUR-105"].id,
        actorId: cto.id,
        action: "STATUS_CHANGE",
        fromValue: "IN_PROGRESS",
        toValue: "IN_REVIEW",
      },
      {
        taskId: byCode["CUR-106"].id,
        actorId: cto.id,
        action: "STATUS_CHANGE",
        fromValue: "IN_PROGRESS",
        toValue: "BLOCKED",
      },
      {
        taskId: byCode["CUR-106"].id,
        actorId: founder.id,
        action: "ANNOTATION_FLAG",
        fromValue: null,
        toValue: "NEEDS_ARCHITECTURE_APPROVAL",
      },
      {
        taskId: byCode["CUR-109"].id,
        actorId: pm.id,
        action: "STATUS_CHANGE",
        fromValue: "IN_PROGRESS",
        toValue: "QA",
      },
      {
        taskId: byCode["CUR-102"].id,
        actorId: cto.id,
        action: "ACCURACY_CHECK",
        fromValue: "mock_dispatch",
        toValue: "real_api_booking_slice",
      },
    ],
  });

  await prisma.worklog.createMany({
    data: [
      {
        employeeId: designer.id,
        taskId: byCode["CUR-101"].id,
        date: due(-4),
        hours: 6,
        description: "[SEED] Token export + RN elevation mapping",
      },
      {
        employeeId: designer.id,
        taskId: byCode["CUR-101"].id,
        date: due(-3),
        hours: 6,
        description: "[SEED] Final QA pass on contrast",
      },
      {
        employeeId: patient.id,
        taskId: byCode["CUR-102"].id,
        date: due(-1),
        hours: 8,
        description: "[SEED] Patient Home + Care booking hook",
      },
      {
        employeeId: backend.id,
        taskId: byCode["CUR-105"].id,
        date: due(-2),
        hours: 7,
        description: "[SEED] Session + middleware mobile bypass",
      },
      {
        employeeId: backend.id,
        taskId: byCode["CUR-106"].id,
        date: due(-1),
        hours: 4,
        description: "[SEED] Schema draft only — blocked",
      },
      {
        employeeId: qa.id,
        taskId: byCode["CUR-109"].id,
        date: due(0),
        hours: 5,
        description: "[SEED] Smoke cases + hours validation check",
      },
      {
        employeeId: devops.id,
        taskId: byCode["CUR-111"].id,
        date: due(-1),
        hours: 6,
        description: "[SEED] GitHub Actions workflow + railway.json",
      },
    ],
  });

  const qaUser = await prisma.user.findUniqueOrThrow({
    where: { email: "qa@techmunda.com" },
  });
  const patientUser = await prisma.user.findUniqueOrThrow({
    where: { email: "patient.dev@techmunda.com" },
  });
  const backendUser = await prisma.user.findUniqueOrThrow({
    where: { email: "backend@techmunda.com" },
  });

  await prisma.standup.createMany({
    data: [
      {
        userId: patientUser.id,
        date: due(0),
        yesterday: "[SEED] Wired Care → create booking API client",
        today: "[SEED] Annotate tracking screen against ON_THE_WAY status",
        blockers: "Waiting on live map package choice",
      },
      {
        userId: backendUser.id,
        date: due(0),
        yesterday: "[SEED] Mobile accept atomic path + 409 conflict",
        today: "[SEED] Accuracy audit logs for booking transitions",
        blockers: "CUR-106 architecture approval",
      },
      {
        userId: qaUser.id,
        date: due(0),
        yesterday: "[SEED] Listed accuracy cases for tasks form",
        today: "[SEED] Annotate CUR-109 with regression notes",
        blockers: "None",
      },
    ],
  });

  await prisma.testCase.createMany({
    data: [
      {
        code: "TC-ACC-01",
        title: "[SEED] Task create with empty estimatedHours defaults safely",
        module: "Tasks",
        steps: "Open /tasks → submit with blank hours → expect success, hours=4",
        expected: "No Zod 500; task appears in list",
        priority: "HIGH",
      },
      {
        code: "TC-ACC-02",
        title: "[SEED] Mobile booking idempotency",
        module: "Mobile API",
        steps: "POST /api/mobile/bookings twice with same Idempotency-Key",
        expected: "Same booking id returned; no duplicate rows",
        priority: "HIGH",
      },
      {
        code: "TC-ACC-03",
        title: "[SEED] Doctor double-accept conflict",
        module: "Mobile API",
        steps: "Accept same booking twice",
        expected: "Second call HTTP 409 ACCEPT_CONFLICT",
        priority: "HIGH",
      },
      {
        code: "TC-ACC-04",
        title: "[SEED] Annotation trail on blocked dispatch task",
        module: "Tasks",
        steps: "Open CUR-106 → verify comments + activity ANNOTATION_FLAG",
        expected: "Founder annotation and BLOCKED status present",
        priority: "MEDIUM",
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: founder.id,
        action: "SEED_ACCURACY_PACK_APPLIED",
        entity: "Project",
        entityId: project.id,
        after: {
          pack: "software-accuracy-annotations",
          tasksAnnotated: ["CUR-101", "CUR-102", "CUR-105", "CUR-106", "CUR-109", "CUR-111"],
          note: "DEV SEED ONLY — not real company data",
        },
      },
      {
        actorId: cto.id,
        action: "ACCURACY_CHECK",
        entity: "Task",
        entityId: byCode["CUR-102"].id,
        before: { status: "READY" },
        after: { status: "IN_PROGRESS", contract: "real_api_booking_slice" },
      },
      {
        actorId: pm.id,
        action: "ANNOTATION_ADDED",
        entity: "Task",
        entityId: byCode["CUR-109"].id,
        after: { topic: "estimatedHours_regression" },
      },
      {
        actorId: founder.id,
        action: "LOGIN",
        entity: "User",
        entityId: founder.id,
        after: { role: "FOUNDER", seed: true },
      },
    ],
  });

  console.log("   ✓ Software accuracy + annotation pack seeded (DEV ONLY)");

  const blockedDispatch = tasks.find((t) => t.taskCode === "CUR-106")!;
  await prisma.blocker.createMany({
    data: [
      {
        taskId: blockedDispatch.id,
        ownerId: backend.id,
        reason: "Waiting on Socket.IO gateway contract approval from architecture review",
        impact: "Blocks Patient Tracking continuation",
        whoCanResolve: "Founder / Tech Lead",
        status: BlockerStatus.ESCALATED,
        priority: "P0",
        escalatedAt: new Date(),
        isSeedData: true,
      },
      {
        taskId: tasks.find((t) => t.taskCode === "CUR-108")!.id,
        ownerId: doctor.id,
        reason: "Depends on Dispatch event schema",
        impact: "Doctor realtime delayed",
        whoCanResolve: "Backend Engineer",
        status: BlockerStatus.OPEN,
        priority: "P1",
        isSeedData: true,
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      {
        expenseCode: "EXP-001",
        date: new Date("2026-10-01"),
        employeeId: devops.id,
        category: ExpenseCategory.CLOUD,
        vendor: "AWS",
        description: "Staging environment October",
        amountInr: 42000,
        projectId: project.id,
        businessPurpose: "Hosting",
        approvalStatus: "APPROVED",
        isSeedData: true,
      },
      {
        expenseCode: "EXP-002",
        date: new Date("2026-10-03"),
        employeeId: ai.id,
        category: ExpenseCategory.AI,
        vendor: "Google Gemini",
        description: "Gemini API credits",
        amountInr: 18000,
        projectId: project.id,
        businessPurpose: "AI PoC",
        approvalStatus: "PENDING",
        isSeedData: true,
      },
      {
        expenseCode: "EXP-003",
        date: new Date("2026-10-04"),
        employeeId: designer.id,
        category: ExpenseCategory.SOFTWARE,
        vendor: "Figma",
        description: "Design seats",
        amountInr: 12000,
        projectId: project.id,
        approvalStatus: "APPROVED",
        isSeedData: true,
      },
    ],
  });

  for (const e of employees) {
    await prisma.payrollRecord.create({
      data: {
        employeeId: e.id,
        month: "2026-10",
        baseSalary: e.monthlyCostInr,
        netPay: e.monthlyCostInr,
        isSeedData: true,
      },
    });
  }

  await prisma.approval.createMany({
    data: [
      {
        projectId: project.id,
        title: "Approve Socket.IO room architecture",
        description: "Namespace strategy for doctor dispatch sessions",
        category: ApprovalCategory.ARCHITECTURE,
        impact: "Unblocks realtime track",
        costInr: 0,
        risk: "MEDIUM",
        status: ApprovalStatus.PENDING,
        requesterId: cto.id,
        isSeedData: true,
      },
      {
        projectId: project.id,
        title: "Gemini API spend increase",
        category: ApprovalCategory.EXPENSE,
        impact: "AI PoC continuation",
        costInr: 25000,
        risk: "LOW",
        status: ApprovalStatus.PENDING,
        requesterId: pm.id,
        isSeedData: true,
      },
      {
        projectId: project.id,
        title: "Staging → Production promotion policy",
        category: ApprovalCategory.PRODUCTION_DEPLOYMENT,
        impact: "Release governance",
        risk: "HIGH",
        status: ApprovalStatus.NEEDS_CHANGES,
        requesterId: cto.id,
        founderComments: "Add rollback checklist",
        isSeedData: true,
      },
    ],
  });

  await prisma.decision.create({
    data: {
      decisionCode: "DEC-001",
      projectId: project.id,
      problem: "Choose realtime transport for doctor dispatch",
      options: "1) Socket.IO 2) Ably 3) Custom WS",
      finalDecision: "Socket.IO on NestJS gateway with Redis adapter",
      reason: "Team familiarity + self-host control for healthcare data path",
      impact: "Locks Nov realtime architecture",
      ownerId: founder.id,
      affectedModule: "Realtime/Dispatch",
      costImpactInr: 0,
      timelineImpact: "Enables Nov milestone",
      isSeedData: true,
    },
  });

  const release = await prisma.release.create({
    data: {
      projectId: project.id,
      version: "0.3.0-rc",
      environment: Environment.STAGING,
      features: "Auth, design system, patient booking WIP",
      bugFixes: "Login redirect loop",
      knownIssues: "Dispatch blocked",
      qaStatus: "IN_PROGRESS",
      securityStatus: "PENDING",
      uatStatus: "NOT_STARTED",
      founderApproved: false,
      rollbackPlan: "Redeploy previous staging image; feature-flag dispatch",
      releaseDate: new Date("2026-12-20"),
      readinessScore: 42,
      readinessStatus: "NOT_READY",
      isSeedData: true,
    },
  });

  await prisma.bug.createMany({
    data: [
      {
        bugCode: "BUG-001",
        projectId: project.id,
        title: "Patient booking date timezone skew",
        severity: BugSeverity.HIGH,
        environment: Environment.STAGING,
        module: "Patient",
        reporterId: qa.id,
        ownerId: patient.id,
        steps: "Create booking near midnight IST",
        expected: "Correct local date",
        actual: "Previous day stored",
        status: "OPEN",
        releaseId: release.id,
        isSeedData: true,
      },
      {
        bugCode: "BUG-002",
        projectId: project.id,
        title: "RBAC missing permission check on document download",
        severity: BugSeverity.CRITICAL,
        environment: Environment.DEVELOPMENT,
        module: "Documents",
        reporterId: qa.id,
        ownerId: backend.id,
        status: "IN_PROGRESS",
        isSeedData: true,
      },
    ],
  });

  const client = await prisma.client.create({
    data: {
      projectId: project.id,
      company: "Curevanta Pilot Partner",
      health: "AMBER",
      pendingPayment: 0,
      isSeedData: true,
      contacts: {
        create: [
          {
            name: "Stakeholder Lead",
            email: "stakeholder@example.com",
            role: "Product Owner",
            nextMeeting: new Date("2026-10-10"),
          },
        ],
      },
      feedback: {
        create: [
          {
            subject: "Booking UX clarity",
            body: "Need clearer confirmation state after booking.",
            rating: 3,
            status: "OPEN",
          },
        ],
      },
    },
  });

  await prisma.changeRequest.create({
    data: {
      crCode: "CR-001",
      projectId: project.id,
      clientId: client.id,
      title: "Add multi-language support to patient app",
      description: "Hindi + English for MVP",
      status: ChangeRequestStatus.TECH_REVIEW,
      effortHours: 80,
      costImpactInr: 180000,
      timelineImpact: "+2 weeks",
      isSeedData: true,
    },
  });

  await prisma.travelEvent.create({
    data: {
      projectId: project.id,
      eventName: "Global Health Tech Expo (WATCHLIST)",
      country: "UAE",
      city: "Dubai",
      category: "Expo",
      eventDate: new Date("2026-11-18"),
      applicationDeadline: new Date("2026-10-20"),
      healthcareFit: "HIGH",
      startupFit: "MEDIUM",
      travelSupport: "Unconfirmed — do not label FREE",
      accommodationSupport: "Unconfirmed",
      applicationStatus: TravelStatus.WATCHLIST,
      flightCostInr: 55000,
      hotelCostInr: 40000,
      registrationCostInr: 25000,
      founderAttending: true,
      notes: "Support amounts not confirmed in writing — track as estimated cost.",
      isSeedData: true,
      attendees: { create: [{ employeeId: founderEmp.id }] },
      expoLeads: {
        create: [
          { company: "Regional Clinic Network", contactName: "Ops Lead", status: "NEW", valueInr: 500000 },
        ],
      },
    },
  });

  await prisma.equityHolder.createMany({
    data: [
      {
        holderName: "Founder",
        type: EquityType.FOUNDER,
        shares: 0,
        equityPct: 0,
        notes:
          "ADMIN TRACKING PLACEHOLDER. Development contribution ₹30L does NOT automatically equal equity %. Any change requires founder approval + legal/board confirmation.",
        legalConfirmed: false,
        boardConfirmed: false,
        isSeedData: true,
      },
      {
        holderName: "ESOP Pool (planned)",
        type: EquityType.ESOP,
        shares: 0,
        equityPct: 0,
        notes: "Not issued. Tracking only.",
        legalConfirmed: false,
        boardConfirmed: false,
        isSeedData: true,
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      {
        title: "Curevanta PRD (seed)",
        category: DocumentCategory.PRD,
        projectId: project.id,
        ownerId: founder.id,
        version: "0.4",
        tags: ["seed", "prd"],
        visibility: DocumentVisibility.INTERNAL,
        isSeedData: true,
      },
      {
        title: "Architecture — Realtime Dispatch",
        category: DocumentCategory.ARCHITECTURE,
        projectId: project.id,
        ownerId: cto.id,
        version: "0.2",
        tags: ["architecture", "socket"],
        visibility: DocumentVisibility.INTERNAL,
        isSeedData: true,
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: founder.id,
        type: NotificationType.APPROVAL_REQUESTED,
        title: "Architecture approval pending",
        body: "Socket.IO room architecture needs founder decision",
        href: "/founder/approvals",
      },
      {
        userId: founder.id,
        type: NotificationType.TASK_BLOCKED,
        title: "P0 blocker escalated",
        body: "Dispatch event schema blocked > threshold",
        href: "/blockers",
      },
      {
        userId: founder.id,
        type: NotificationType.BUDGET_THRESHOLD,
        title: "Budget watch",
        body: "Committed + spent approaching planning band",
        href: "/finance/budget",
      },
    ],
  });

  const mobilePassword = await bcrypt.hash("Curevanta@2026", 10);
  const mobilePatient = await prisma.mobileAccount.upsert({
    where: { email: "patient@curevanta.com" },
    update: { passwordHash: mobilePassword, name: "Aanya Patel", role: "PATIENT" },
    create: {
      email: "patient@curevanta.com",
      phone: "+919876543210",
      passwordHash: mobilePassword,
      name: "Aanya Patel",
      role: "PATIENT",
    },
  });
  const mobileDoctor = await prisma.mobileAccount.upsert({
    where: { email: "doctor@curevanta.com" },
    update: { passwordHash: mobilePassword, name: "Dr. Meera Shah", role: "DOCTOR" },
    create: {
      email: "doctor@curevanta.com",
      phone: "+919876543211",
      passwordHash: mobilePassword,
      name: "Dr. Meera Shah",
      role: "DOCTOR",
    },
  });
  await prisma.careProviderProfile.upsert({
    where: { accountId: mobileDoctor.id },
    update: {
      specialty: "General Physician",
      isVerified: true,
      isOnline: true,
      rating: 4.9,
    },
    create: {
      accountId: mobileDoctor.id,
      specialty: "General Physician",
      isVerified: true,
      isOnline: true,
      rating: 4.9,
    },
  });
  void mobilePatient;

  console.log("✅ Seed complete");
  console.log("   Login: founder@techmunda.com / Founder@2026");
  console.log("   Mobile patient: patient@curevanta.com / Curevanta@2026");
  console.log("   Mobile doctor:  doctor@curevanta.com / Curevanta@2026");
  console.log("   Project:", project.code, project.name);
}

function empDefs(seeds: EmpSeed[]) {
  return seeds;
}

type EmpSeed = {
  code: string;
  name: string;
  email: string;
  title: string;
  department: string;
  domain: string;
  cost: number;
  role: SystemRole;
  skills: string[];
  status: EmployeeStatus;
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
