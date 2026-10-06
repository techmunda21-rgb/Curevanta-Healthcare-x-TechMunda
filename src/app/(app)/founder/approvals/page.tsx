import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { ApprovalActions } from "./approval-actions";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  await requirePermission(PERMISSIONS.APPROVAL_DECIDE);
  const approvals = await prisma.approval.findMany({
    include: { requester: true, decider: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Founder Approvals"
        description="Architecture, deployments, expenses, hiring, travel, equity, releases."
      />
<div className="space-y-3">
        {approvals.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{a.title}</CardTitle>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <Badge variant="outline">{a.category}</Badge>
                  <Badge
                    variant={
                      a.status === "APPROVED"
                        ? "success"
                        : a.status === "REJECTED"
                          ? "danger"
                          : a.status === "NEEDS_CHANGES"
                            ? "warning"
                            : "secondary"
                    }
                  >
                    {a.status}
                  </Badge>
                  <span>Requested by {a.requester.name}</span>
                  <span>{formatDate(a.createdAt)}</span>
                  {a.costInr != null ? <span>{formatINR(a.costInr)}</span> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {a.description ? <p className="text-sm">{a.description}</p> : null}
              {a.impact ? (
                <p className="text-xs text-[var(--muted)]">Impact: {a.impact}</p>
              ) : null}
              {a.founderComments ? (
                <p className="text-sm">Founder: {a.founderComments}</p>
              ) : null}
              {a.status === "PENDING" ? <ApprovalActions approvalId={a.id} /> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
