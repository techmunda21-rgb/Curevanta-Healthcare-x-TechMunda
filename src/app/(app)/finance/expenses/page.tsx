import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { createExpenseAction, decideExpenseAction } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  await requirePermission(PERMISSIONS.FINANCE_VIEW);
  const [expenses, employees, project] = await Promise.all([
    prisma.expense.findMany({
      include: { employee: true },
      orderBy: { date: "desc" },
    }),
    prisma.employee.findMany({ orderBy: { name: "asc" } }),
    prisma.project.findFirst({ where: { isPrimary: true } }),
  ]);

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Expenses"
        description="Receipt-backed spend with approval workflow."
      />
<div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Expense register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenses.map((e) => (
              <div key={e.id} className="rounded-lg border border-[var(--border)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">
                      {e.expenseCode} · {e.description}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {formatDate(e.date)} · {e.vendor ?? "—"} · {e.employee?.name ?? "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatINR(e.amountInr)}</div>
                    <Badge
                      variant={
                        e.approvalStatus === "APPROVED"
                          ? "success"
                          : e.approvalStatus === "REJECTED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {e.approvalStatus}
                    </Badge>
                  </div>
                </div>
                {e.approvalStatus === "PENDING" ? (
                  <div className="mt-2 flex gap-2">
                    <form action={decideExpenseAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <Button size="sm" type="submit">
                        Approve
                      </Button>
                    </form>
                    <form action={decideExpenseAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <Button size="sm" variant="danger" type="submit">
                        Reject
                      </Button>
                    </form>
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createExpenseAction} className="space-y-3">
              <input type="hidden" name="projectId" value={project?.id ?? ""} />
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amountInr">Amount (INR)</Label>
                <Input id="amountInr" name="amountInr" type="number" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="h-9 w-full rounded-md border border-[var(--border)] px-2 text-sm"
                  defaultValue="SOFTWARE"
                >
                  {[
                    "CLOUD",
                    "APIS",
                    "AI",
                    "SOFTWARE",
                    "TRAVEL",
                    "QA",
                    "OTHER",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="employeeId">Employee</Label>
                <select
                  id="employeeId"
                  name="employeeId"
                  className="h-9 w-full rounded-md border border-[var(--border)] px-2 text-sm"
                >
                  <option value="">—</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" name="vendor" />
              </div>
              <Button type="submit" className="w-full">
                Submit expense
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
