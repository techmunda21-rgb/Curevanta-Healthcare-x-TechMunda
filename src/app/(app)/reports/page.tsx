import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW);

  const [
    project,
    openTasks,
    openBugs,
    pendingApprovals,
    expenses,
    employees,
    releases,
    travel,
  ] = await Promise.all([
    prisma.project.findFirst({ where: { isPrimary: true } }),
    prisma.task.count({ where: { status: { not: "DONE" } } }),
    prisma.bug.count({ where: { status: { notIn: ["CLOSED", "RESOLVED", "WONT_FIX"] } } }),
    prisma.approval.count({ where: { status: "PENDING" } }),
    prisma.expense.aggregate({ _sum: { amountInr: true } }),
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.release.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.travelEvent.findMany({ orderBy: { eventDate: "asc" }, take: 5 }),
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Reports"
        description="Cross-module ops snapshot — live Prisma aggregates."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Primary completion" value={`${project?.completionPct ?? 0}%`} />
        <KpiCard label="Open tasks" value={openTasks} />
        <KpiCard label="Open bugs" value={openBugs} />
        <KpiCard label="Pending approvals" value={pendingApprovals} />
        <KpiCard label="Expense total" value={formatINR(expenses._sum.amountInr ?? 0)} />
        <KpiCard label="Active employees" value={employees} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent releases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {releases.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between border-b border-[var(--border)] py-2"
              >
                <span>
                  {r.project.name} · {r.version}
                </span>
                <Badge variant="outline">{r.readinessStatus}</Badge>
              </div>
            ))}
            {!releases.length ? (
              <p className="text-[var(--text-muted)]">No releases yet.</p>
            ) : null}
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Growth pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {travel.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border-b border-[var(--border)] py-2"
              >
                <span>
                  {t.eventName} · {t.country}
                </span>
                <span className="tabular-nums text-[var(--text-muted)]">
                  {formatINR(t.pipelineValueInr)}
                </span>
              </div>
            ))}
            {!travel.length ? (
              <p className="text-[var(--text-muted)]">No travel events.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
