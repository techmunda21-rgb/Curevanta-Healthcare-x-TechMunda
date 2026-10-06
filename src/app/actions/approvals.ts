"use server";

import { auth } from "@/lib/auth";
import { assertPermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { ApprovalStatus, SystemRole } from "@prisma/client";

export async function decideApprovalAction(
  approvalId: string,
  status: ApprovalStatus,
  comments?: string,
) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.APPROVAL_DECIDE);

  const before = await prisma.approval.findUnique({ where: { id: approvalId } });
  const after = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status,
      founderComments: comments,
      deciderId: session.user.id,
      decidedAt: new Date(),
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "APPROVAL_DECIDE",
    entity: "Approval",
    entityId: approvalId,
    before,
    after,
  });

  revalidatePath("/founder/approvals");
  revalidatePath("/founder");
  revalidatePath("/dashboard");
}
