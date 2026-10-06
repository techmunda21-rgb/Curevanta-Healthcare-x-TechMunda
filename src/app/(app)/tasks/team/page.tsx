import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { listTasks } from "@/server/tasks";
import { getPrimaryProjectId } from "@/server/context";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, TaskStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function TeamTasksPage() {
  await requirePermission(PERMISSIONS.TASK_VIEW);
  const project = await getPrimaryProjectId();
  const tasks = project ? await listTasks(project.id) : [];
  const active = tasks.filter((t) => !["DONE", "APPROVED", "BACKLOG"].includes(t.status));

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Team Tasks"
        description="Active work across the Curevanta delivery team — live."
      />
      {!active.length ? (
        <EmptyState title="No active team tasks" description="Everything is backlog or done." />
      ) : (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{active.length} active</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="text-[11px] uppercase text-[var(--text-muted)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left">ID</th>
                  <th className="pb-2 text-left">Title</th>
                  <th className="pb-2 text-left">Owner</th>
                  <th className="pb-2 text-left">Workstream</th>
                  <th className="pb-2 text-left">Priority</th>
                  <th className="pb-2 text-left">Status</th>
                  <th className="pb-2 text-left">Due</th>
                </tr>
              </thead>
              <tbody>
                {active.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--border)]/60 hover:bg-[var(--surface-muted)]/50">
                    <td className="py-2.5 font-mono text-xs">{t.taskCode}</td>
                    <td className="py-2.5">{t.title}</td>
                    <td className="py-2.5">{t.assignee?.name ?? "—"}</td>
                    <td className="py-2.5">{t.workstream?.name ?? "—"}</td>
                    <td className="py-2.5">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-2.5">
                      <TaskStatusBadge status={t.status} />
                    </td>
                    <td className="py-2.5">{formatDate(t.dueDate)}</td>
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
