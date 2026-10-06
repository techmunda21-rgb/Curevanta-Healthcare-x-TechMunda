import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ChangeRequestsPage() {
  await requirePermission(PERMISSIONS.CLIENT_VIEW);
  const crs = await prisma.changeRequest.findMany({
    include: { client: true, project: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Change Requests"
        description="CLIENT ? PM ? TECH ? EFFORT ? COST ? TIMELINE ? FOUNDER ? CLIENT ? DEV. No silent scope changes."
      />
{crs.map((cr) => (
        <Card key={cr.id}>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>
                {cr.crCode} · {cr.title}
              </CardTitle>
              <div className="text-sm text-[var(--muted)]">{cr.client?.company}</div>
            </div>
            <Badge variant="outline">{cr.status.replaceAll("_", " ")}</Badge>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm md:grid-cols-3">
            <div>{cr.description}</div>
            <div>Effort: {cr.effortHours ?? "—"}h</div>
            <div>Cost impact: {cr.costImpactInr != null ? formatINR(cr.costImpactInr) : "—"}</div>
            <div>Timeline: {cr.timelineImpact ?? "—"}</div>
            <div>Founder approved: {cr.founderApproved ? "Yes" : "No"}</div>
            <div>Client approved: {cr.clientApproved ? "Yes" : "No"}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
