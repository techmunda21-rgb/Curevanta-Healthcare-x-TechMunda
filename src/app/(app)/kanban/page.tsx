import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { getPrimaryProject } from "@/server/dashboard";
import { getKanbanBoard } from "@/server/tasks";
import { ModuleHeader } from "@/components/module-header";
import { KanbanBoard } from "./kanban-board";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  await requirePermission(PERMISSIONS.TASK_VIEW);
  const project = await getPrimaryProject();
  if (!project) return <div>No project</div>;
  const columns = await getKanbanBoard(project.id);

  const serializable = columns.map((c) => ({
    status: c.status,
    tasks: c.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      estimatedHours: t.estimatedHours,
      assignee: t.assignee ? { name: t.assignee.name } : null,
      workstream: t.workstream ? { name: t.workstream.name } : null,
      blockers: t.blockers?.map((b) => ({ id: b.id })) ?? [],
    })),
  }));

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Kanban"
        description="Drag cards to update status — changes persist to the database."
      />
<KanbanBoard initialColumns={serializable} />
    </div>
  );
}
