import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { listEmployees } from "@/server/employees";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  await requirePermission(PERMISSIONS.EMPLOYEE_VIEW);
  const employees = await listEmployees();

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Employees"
        description="Curevanta delivery team — capacity, stack, and current workload."
      />
<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((e) => (
          <Card key={e.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-[var(--muted)]">{e.employeeCode}</div>
                  <Link href={`/employees/${e.id}`} className="font-semibold hover:underline">
                    {e.name}
                  </Link>
                  <div className="text-sm text-[var(--muted)]">{e.title}</div>
                </div>
                <Badge
                  variant={
                    e.status === "OVERLOADED"
                      ? "danger"
                      : e.status === "AVAILABLE"
                        ? "success"
                        : "secondary"
                  }
                >
                  {e.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {e.skills.slice(0, 6).map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.name}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-[var(--muted)]">Cost/mo</div>
                  <div className="font-semibold">{formatINR(e.monthlyCostInr)}</div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">Capacity</div>
                  <div className="font-semibold">{e.weeklyCapacityHrs}h</div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">Active</div>
                  <div className="font-semibold">{e.assignedTasks.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
