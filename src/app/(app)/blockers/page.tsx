import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BlockersPage() {
  await requirePermission(PERMISSIONS.TASK_VIEW);
  const blockers = await prisma.blocker.findMany({
    include: { task: true, owner: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Blockers"
        description="P0 blocked > 4h escalates to Founder/CTO · P1 blocked > 24h escalates to PM"
      />
<div className="space-y-3">
        {blockers.map((b) => {
          const ageHrs = Math.round((Date.now() - b.createdAt.getTime()) / 36e5);
          return (
            <Card key={b.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{b.reason}</CardTitle>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                    <PriorityBadge priority={b.priority} />
                    <Badge variant={b.status === "ESCALATED" ? "danger" : "secondary"}>
                      {b.status}
                    </Badge>
                    <span>Age {ageHrs}h</span>
                    <span>Owner: {b.owner?.name ?? "—"}</span>
                    <span>Task: {b.task?.taskCode ?? "—"}</span>
                    <span>Since {formatDate(b.createdAt)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-[var(--muted)]">
                <div>Impact: {b.impact ?? "—"}</div>
                <div>Who can resolve: {b.whoCanResolve ?? "—"}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
