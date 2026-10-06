import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { getPrimaryProjectId } from "@/server/context";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { formatINR } from "@/lib/utils";
import { ExpenseCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

const CLOUD_CATS: ExpenseCategory[] = ["CLOUD", "APIS", "AI", "MAPS", "SMS", "SOFTWARE", "MONITORING"];

export default async function CloudCostPage() {
  await requirePermission(PERMISSIONS.FINANCE_VIEW);
  const project = await getPrimaryProjectId();
  const [budgets, expenses] = await Promise.all([
    project
      ? prisma.budget.findMany({
          where: { projectId: project.id, category: { in: CLOUD_CATS } },
        })
      : [],
    project
      ? prisma.expense.findMany({
          where: { projectId: project.id, category: { in: CLOUD_CATS } },
          orderBy: { date: "desc" },
        })
      : [],
  ]);

  const allocated = budgets.reduce((s, b) => s + b.allocatedInr, 0);
  const spent = expenses
    .filter((e) => e.approvalStatus === "APPROVED")
    .reduce((s, e) => s + e.amountInr, 0);
  const pending = expenses
    .filter((e) => e.approvalStatus === "PENDING")
    .reduce((s, e) => s + e.amountInr, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Cloud / API Cost"
        description="Cloud, APIs, AI, maps, SMS, software, monitoring — live spend."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Allocated" value={formatINR(allocated)} />
        <KpiCard label="Approved spend" value={formatINR(spent)} />
        <KpiCard label="Pending" value={formatINR(pending)} tone={pending ? "warning" : "default"} />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Expense lines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] py-2 text-sm"
            >
              <div>
                <div className="font-medium">
                  {e.expenseCode} · {e.description}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {e.category} · {e.vendor ?? "—"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold tabular-nums">{formatINR(e.amountInr)}</div>
                <div className="text-xs text-[var(--text-muted)]">{e.approvalStatus}</div>
              </div>
            </div>
          ))}
          {!expenses.length ? (
            <p className="text-sm text-[var(--text-muted)]">No cloud/API expenses yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
