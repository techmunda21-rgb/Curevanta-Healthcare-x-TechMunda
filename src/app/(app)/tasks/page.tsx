import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { listTasks } from "@/server/tasks";
import { getPrimaryProject } from "@/server/dashboard";
import { ModuleHeader } from "@/components/module-header";
import { PriorityBadge, TaskStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { createTaskAction } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  await requirePermission(PERMISSIONS.TASK_VIEW);
  const project = await getPrimaryProject();
  const tasks = project ? await listTasks(project.id) : [];
  const employees = await prisma.employee.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Daily Tasks"
        description="Execution queue for Curevanta."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="text-[11px] uppercase text-[var(--muted)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2 text-left">ID</th>
                  <th className="py-2 text-left">Title</th>
                  <th className="py-2 text-left">Owner</th>
                  <th className="py-2 text-left">Priority</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-[var(--border)]/60">
                    <td className="py-2 pr-2 font-mono text-xs">{t.taskCode}</td>
                    <td className="py-2 pr-2">{t.title}</td>
                    <td className="py-2 pr-2">{t.assignee?.name ?? "—"}</td>
                    <td className="py-2 pr-2">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-2 pr-2">
                      <TaskStatusBadge status={t.status} />
                    </td>
                    <td className="py-2">{formatDate(t.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
          </CardHeader>
          <CardContent>
            {project ? (
              <form action={createTaskAction} className="space-y-3">
                <input type="hidden" name="projectId" value={project.id} />
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="assigneeId">Assignee</Label>
                  <select
                    id="assigneeId"
                    name="assigneeId"
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-white px-2 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      className="h-9 w-full rounded-md border border-[var(--border)] bg-white px-2 text-sm"
                      defaultValue="P2"
                    >
                      <option value="P0">P0</option>
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="estimatedHours">Est. hours</Label>
                    <Input id="estimatedHours" name="estimatedHours" type="number" defaultValue={4} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
                <Button type="submit" className="w-full">
                  Create task
                </Button>
              </form>
            ) : (
              <p className="text-sm text-[var(--muted)]">No project available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
