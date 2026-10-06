"use server";

import { auth } from "@/lib/auth";
import { assertPermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { ExpenseApprovalStatus, ExpenseCategory, SystemRole } from "@prisma/client";

export async function createExpenseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.EXPENSE_CREATE);

  const count = await prisma.expense.count();
  const expense = await prisma.expense.create({
    data: {
      expenseCode: `EXP-${String(count + 1).padStart(3, "0")}`,
      date: new Date(),
      description: String(formData.get("description")),
      amountInr: Number(formData.get("amountInr")),
      category: String(formData.get("category")) as ExpenseCategory,
      employeeId: String(formData.get("employeeId") || "") || null,
      vendor: String(formData.get("vendor") || "") || null,
      projectId: String(formData.get("projectId") || "") || null,
      approvalStatus: "PENDING",
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "EXPENSE_CREATE",
    entity: "Expense",
    entityId: expense.id,
    after: expense,
  });

  revalidatePath("/finance/expenses");
}

export async function decideExpenseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.EXPENSE_APPROVE);

  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as ExpenseApprovalStatus;
  const before = await prisma.expense.findUnique({ where: { id } });
  const after = await prisma.expense.update({
    where: { id },
    data: { approvalStatus: status },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "EXPENSE_DECIDE",
    entity: "Expense",
    entityId: id,
    before,
    after,
  });

  revalidatePath("/finance/expenses");
  revalidatePath("/dashboard");
}
