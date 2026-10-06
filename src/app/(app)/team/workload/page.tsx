import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { getWorkload } from "@/server/employees";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function WorkloadPage() {
  await requirePermission(PERMISSIONS.EMPLOYEE_VIEW);
  const rows = await getWorkload();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Workload"
        description="Assigned estimated hours vs weekly capacity — live utilization."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <Card key={r.employee.id} variant="interactive">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{r.employee.name}</CardTitle>
                <p className="text-xs text-[var(--text-muted)]">{r.employee.title}</p>
              </div>
              <Badge
                variant={
                  r.band.tone === "overloaded"
                    ? "danger"
                    : r.band.tone === "high"
                      ? "warning"
                      : r.band.tone === "healthy"
                        ? "success"
                        : "secondary"
                }
              >
                {r.band.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={Math.min(r.utilizationPct, 100)} />
              <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>
                  {r.assignedHours}h / {r.capacityHours}h
                </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {r.utilizationPct}% · {r.taskCount} tasks
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
