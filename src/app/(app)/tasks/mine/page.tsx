import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { listTasks } from "@/server/tasks";
import { getPrimaryProjectId, getSessionEmployee } from "@/server/context";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, TaskStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  await requirePermission(PERMISSIONS.TASK_VIEW);
  const [project, me] = await Promise.all([getPrimaryProjectId(), getSessionEmployee()]);
  const all = project ? await listTasks(project.id) : [];
  const tasks = me ? all.filter((t) => t.assigneeId === me.id) : all.filter(() => false);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="My Tasks"
        description={
          me
            ? `Assigned to ${me.name} — live queue.`
            : "No employee profile linked to this user. Showing empty personal queue."
        }
      />
      {!tasks.length ? (
        <EmptyState
          title="No tasks assigned to you"
          description="Team tasks may still exist — check Team Tasks or Daily Tasks."
          action={
            <Link href="/tasks" className="text-sm font-semibold text-[var(--primary-pressed)] underline">
              Browse all tasks
            </Link>
          }
        />
      ) : (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{tasks.length} assigned</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="text-[11px] uppercase text-[var(--text-muted)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left">ID</th>
                  <th className="pb-2 text-left">Title</th>
                  <th className="pb-2 text-left">Priority</th>
                  <th className="pb-2 text-left">Status</th>
                  <th className="pb-2 text-left">Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--border)]/60">
                    <td className="py-2.5 font-mono text-xs">{t.taskCode}</td>
                    <td className="py-2.5">{t.title}</td>
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
