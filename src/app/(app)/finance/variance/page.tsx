import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { getPrimaryProjectId } from "@/server/context";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatINR } from "@/lib/utils";
import { budgetUsedPct, variance, variancePct } from "@/lib/finance/calculations";
import { KpiCard } from "@/components/kpi-card";

export const dynamic = "force-dynamic";

export default async function VariancePage() {
  await requirePermission(PERMISSIONS.FINANCE_VIEW);
  const project = await getPrimaryProjectId();
  const budgets = project
    ? await prisma.budget.findMany({ where: { projectId: project.id } })
    : [];

  const allocated = budgets.reduce((s, b) => s + b.allocatedInr, 0);
  const spent = budgets.reduce((s, b) => s + b.spentInr, 0);
  const varAbs = variance(spent, allocated);
  const varP = variancePct(spent, allocated);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Budget vs Actual"
        description="Line-item variance across the ₹30L development basis — live."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Allocated" value={formatINR(allocated)} />
        <KpiCard label="Actual spent" value={formatINR(spent)} />
        <KpiCard
          label="Variance"
          value={formatINR(Math.abs(varAbs))}
          hint={varAbs > 0 ? "Over plan" : "Under plan"}
          tone={varAbs > 0 ? "warning" : "success"}
        />
        <KpiCard label="Variance %" value={`${varP}%`} />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>By category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((b) => {
            const pct = budgetUsedPct(b.allocatedInr, b.spentInr);
            return (
              <div key={b.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{b.name}</span>
                  <span className="text-[var(--text-muted)]">
                    {formatINR(b.spentInr)} / {formatINR(b.allocatedInr)} ({pct}%)
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
