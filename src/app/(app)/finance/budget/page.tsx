import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { budgetRemaining, budgetUsedPct } from "@/lib/finance/calculations";
import { Progress } from "@/components/ui/progress";
import { BudgetDonut } from "@/components/charts";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  await requirePermission(PERMISSIONS.FINANCE_VIEW);
  const project = await prisma.project.findFirst({ where: { isPrimary: true } });
  const budgets = project
    ? await prisma.budget.findMany({ where: { projectId: project.id } })
    : [];

  const allocated = budgets.reduce((s, b) => s + b.allocatedInr, 0);
  const spent = budgets.reduce((s, b) => s + b.spentInr, 0);
  const committed = budgets.reduce((s, b) => s + b.committedInr, 0);
  const remaining = budgetRemaining(allocated, spent, committed);
  const usedPct = budgetUsedPct(allocated, spent);

  const chartData = budgets.map((b) => ({
    name: b.name,
    value: b.allocatedInr,
  }));
  const colors = ["#009B9A", "#007A7A", "#30363A", "#5B8A8A", "#88B0B0", "#C4DADA", "#E2EAEA"];

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Development Budget"
        description="₹30,00,000 development cost/contribution basis — not automatic equity."
      />
<div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-[var(--muted)]">Allocated</div>
            <div className="font-display text-2xl">{formatINR(allocated)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-[var(--muted)]">Spent</div>
            <div className="font-display text-2xl">{formatINR(spent)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-[var(--muted)]">Committed</div>
            <div className="font-display text-2xl">{formatINR(committed)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-[var(--muted)]">Remaining</div>
            <div className="font-display text-2xl text-[var(--success)]">{formatINR(remaining)}</div>
          </CardContent>
        </Card>
      </div>

      <Progress value={usedPct} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <BudgetDonut data={chartData} colors={colors} formatValue={formatINR} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgets.map((b) => (
              <div key={b.id} className="rounded-lg border border-[var(--border)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{b.name}</div>
                  <Badge variant="outline">{b.category}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>Alloc {formatINR(b.allocatedInr)}</div>
                  <div>Spent {formatINR(b.spentInr)}</div>
                  <div>Commit {formatINR(b.committedInr)}</div>
                </div>
                <Progress
                  className="mt-2"
                  value={budgetUsedPct(b.allocatedInr, b.spentInr)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-[var(--muted)]">Updated {formatDate(new Date())}</p>
    </div>
  );
}
