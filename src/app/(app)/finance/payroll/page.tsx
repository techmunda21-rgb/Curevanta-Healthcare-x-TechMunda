import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { updatePayrollAction } from "@/app/actions/payroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
  await requirePermission(PERMISSIONS.PAYROLL_VIEW);
  const records = await prisma.payrollRecord.findMany({
    where: { month: "2026-10" },
    include: { employee: true },
    orderBy: { employee: { employeeCode: "asc" } },
  });
  const total = records.reduce((s, r) => s + r.netPay, 0);

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Payroll"
        description="Confidential salary register — founder/finance only."
      />
<Card>
        <CardHeader>
          <CardTitle>Monthly salaries (admin editable)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.map((r) => (
            <form
              key={r.id}
              action={updatePayrollAction}
              className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] py-3"
            >
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="employeeId" value={r.employeeId} />
              <div className="min-w-[220px] flex-1">
                <div className="font-medium">{r.employee.name}</div>
                <div className="text-xs text-[var(--muted)]">{r.employee.title}</div>
              </div>
              <Input
                name="baseSalary"
                type="number"
                defaultValue={r.baseSalary}
                className="w-36"
              />
              <Button type="submit" size="sm" variant="outline">
                Save
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
