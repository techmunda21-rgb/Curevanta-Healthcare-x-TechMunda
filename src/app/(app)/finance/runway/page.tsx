import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { getPrimaryProjectId } from "@/server/context";
import { ModuleHeader } from "@/components/module-header";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { budgetRemaining, monthlyBurn, runwayMonths } from "@/lib/finance/calculations";

export const dynamic = "force-dynamic";

export default async function RunwayPage() {
  await requirePermission(PERMISSIONS.FINANCE_VIEW);
  const project = await getPrimaryProjectId();
  const [budgets, employees, expenses] = await Promise.all([
    project ? prisma.budget.findMany({ where: { projectId: project.id } }) : [],
    prisma.employee.findMany(),
    project ? prisma.expense.findMany({ where: { projectId: project.id } }) : [],
  ]);

  const allocated = budgets.reduce((s, b) => s + b.allocatedInr, 0);
  const spent = budgets.reduce((s, b) => s + b.spentInr, 0);
  const committed = budgets.reduce((s, b) => s + b.committedInr, 0);
  const remaining = budgetRemaining(allocated, spent, committed);
  const payroll = employees.reduce((s, e) => s + e.monthlyCostInr, 0);
  const monthKey = new Date().toISOString().slice(0, 7);
  const monthExp = expenses
    .filter((e) => e.date.toISOString().startsWith(monthKey))
    .reduce((s, e) => s + e.amountInr, 0);
  const burn = monthlyBurn(monthExp, payroll);
  const runway = runwayMonths(remaining, burn);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Runway"
        description="Remaining development budget vs monthly burn — live forecast."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Remaining" value={formatINR(remaining)} tone="success" />
        <KpiCard label="Monthly burn" value={formatINR(burn)} />
        <KpiCard label="Payroll / mo" value={formatINR(payroll)} />
        <KpiCard
          label="Runway"
          value={runway == null ? "—" : `${runway} mo`}
          hint="At current burn"
        />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--text-secondary)]">
          Runway uses remaining development budget (allocated − spent − committed) divided by
          current-month payroll + expenses. This is a planning signal — not cash-account runway.
        </CardContent>
      </Card>
    </div>
  );
}
