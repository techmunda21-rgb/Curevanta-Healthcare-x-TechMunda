import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function WorklogsPage() {
  await requirePermission(PERMISSIONS.EMPLOYEE_VIEW);
  const logs = await prisma.worklog.findMany({
    include: { employee: true, task: true },
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Attendance / Worklogs"
        description="Logged hours against tasks — live register."
      />
      {!logs.length ? (
        <EmptyState
          title="No worklogs yet"
          description="Worklogs appear when the team logs hours against tasks."
        />
      ) : (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{logs.length} recent entries</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="text-[11px] uppercase text-[var(--text-muted)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left">Date</th>
                  <th className="pb-2 text-left">Employee</th>
                  <th className="pb-2 text-left">Task</th>
                  <th className="pb-2 text-left">Hours</th>
                  <th className="pb-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-[var(--border)]/60">
                    <td className="py-2.5">{formatDate(l.date)}</td>
                    <td className="py-2.5">{l.employee.name}</td>
                    <td className="py-2.5">{l.task?.taskCode ?? "—"}</td>
                    <td className="py-2.5 tabular-nums">{l.hours}</td>
                    <td className="py-2.5 text-[var(--text-muted)]">{l.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
