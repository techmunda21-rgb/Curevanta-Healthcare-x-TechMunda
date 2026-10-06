import { prisma } from "@/lib/db";
import { utilizationPct } from "@/lib/finance/calculations";
import { utilizationBand } from "@/lib/utils";

export async function listEmployees() {
  return prisma.employee.findMany({
    include: {
      skills: true,
      manager: true,
      assignedTasks: {
        where: { status: { notIn: ["DONE", "APPROVED"] } },
        include: { workstream: true, sprint: true },
      },
      projectMembers: { include: { project: true } },
    },
    orderBy: { employeeCode: "asc" },
  });
}

export async function getEmployee(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      skills: true,
      manager: true,
      assignedTasks: { include: { workstream: true, sprint: true, blockers: true } },
      worklogs: { orderBy: { date: "desc" }, take: 30 },
      payrollRecords: { orderBy: { month: "desc" }, take: 6 },
    },
  });
}

export async function getWorkload() {
  const employees = await listEmployees();
  return employees.map((e) => {
    const assigned = e.assignedTasks.reduce((s, t) => s + t.estimatedHours, 0);
    const pct = utilizationPct(assigned, e.weeklyCapacityHrs);
    return {
      employee: e,
      assignedHours: assigned,
      capacityHours: e.weeklyCapacityHrs,
      utilizationPct: pct,
      band: utilizationBand(pct),
      taskCount: e.assignedTasks.length,
    };
  });
}
