import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { listEmployees } from "@/server/employees";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  await requirePermission(PERMISSIONS.EMPLOYEE_VIEW);
  const employees = await listEmployees();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Performance"
        description="Delivery outcomes — completion, on-time %, performance score. Not surveillance."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((e) => (
          <Card key={e.id} variant="elevated">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{e.name}</CardTitle>
                <p className="text-xs text-[var(--text-muted)]">{e.title}</p>
              </div>
              <Badge variant="outline">{Math.round(e.performanceScore)}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <div className="mb-1 flex justify-between text-[var(--text-muted)]">
                  <span>Task completion</span>
                  <span>{Math.round(e.taskCompletionPct)}%</span>
                </div>
                <Progress value={e.taskCompletionPct} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[var(--text-muted)]">
                  <span>On-time</span>
                  <span>{Math.round(e.onTimePct)}%</span>
                </div>
                <Progress value={e.onTimePct} />
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Hours logged</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {Math.round(e.hoursLogged)}h
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
