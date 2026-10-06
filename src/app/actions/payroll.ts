"use server";

import { auth } from "@/lib/auth";
import { assertPermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { SystemRole } from "@prisma/client";

export async function updatePayrollAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.PAYROLL_MANAGE);

  const id = String(formData.get("id"));
  const employeeId = String(formData.get("employeeId"));
  const baseSalary = Number(formData.get("baseSalary"));
  if (!Number.isFinite(baseSalary) || baseSalary < 0) throw new Error("Invalid salary");

  const before = await prisma.payrollRecord.findUnique({ where: { id } });
  const after = await prisma.payrollRecord.update({
    where: { id },
    data: { baseSalary, netPay: baseSalary },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: { monthlyCostInr: baseSalary },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "PAYROLL_UPDATE",
    entity: "PayrollRecord",
    entityId: id,
    before,
    after,
  });

  revalidatePath("/finance/payroll");
  revalidatePath("/finance/budget");
  revalidatePath("/dashboard");
}
