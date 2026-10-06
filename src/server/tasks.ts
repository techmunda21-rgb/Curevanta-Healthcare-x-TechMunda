import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";
import type { TaskStatus } from "@prisma/client";

export const KANBAN_COLUMNS: TaskStatus[] = [
  "BACKLOG",
  "READY",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "QA",
  "REWORK",
  "CLIENT_REVIEW",
  "APPROVED",
  "DONE",
];

export const createTaskSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  projectId: z.string().min(1),
  sprintId: z.string().optional().nullable(),
  workstreamId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  priority: z.enum(["P0", "P1", "P2", "P3"]).default("P2"),
  estimatedHours: z.coerce.number().finite().min(0).max(1000).default(4),
  dueDate: z.union([z.string(), z.date()]).optional().nullable(),
  founderApprovalRequired: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export async function listTasks(projectIdOrFilters?: string | { projectId?: string }) {
  const projectId =
    typeof projectIdOrFilters === "string"
      ? projectIdOrFilters
      : projectIdOrFilters?.projectId;

  return prisma.task.findMany({
    where: projectId ? { projectId } : undefined,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          photoUrl: true,
          title: true,
          employeeCode: true,
        },
      },
      reviewer: { select: { id: true, name: true, photoUrl: true, title: true } },
      workstream: { select: { id: true, name: true, type: true } },
      sprint: { select: { id: true, name: true, status: true } },
      project: { select: { id: true, code: true, name: true } },
      blockers: {
        where: { status: { in: ["OPEN", "IN_PROGRESS", "ESCALATED"] } },
        select: {
          id: true,
          reason: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      },
    },
    orderBy: [{ priority: "asc" }, { kanbanOrder: "asc" }, { dueDate: "asc" }],
  });
}

type KanbanColumn = {
  status: TaskStatus;
  label: string;
  count: number;
  tasks: Array<{
    id: string;
    taskCode: string;
    title: string;
    priority: "P0" | "P1" | "P2" | "P3";
    status: TaskStatus;
    dueDate: Date | null;
    estimatedHours: number;
    storyPoints: number;
    kanbanOrder: number;
    assignee: {
      id: string;
      name: string;
      photoUrl: string | null;
      title: string;
      employeeCode: string;
    } | null;
    workstream: { id: string; name: string; type: string } | null;
    hasBlocker: boolean;
    blockers: Array<{
      id: string;
      reason: string;
      status: string;
      priority: string;
      createdAt: Date;
    }>;
  }>;
};

export async function getKanbanBoard(projectId: string): Promise<KanbanColumn[]>;
export async function getKanbanBoard(opts: {
  projectId: string;
  sprintId?: string;
}): Promise<{ projectId: string; columns: KanbanColumn[]; totalTasks: number }>;
export async function getKanbanBoard(
  opts: string | { projectId: string; sprintId?: string },
): Promise<KanbanColumn[] | { projectId: string; columns: KanbanColumn[]; totalTasks: number }> {
  const projectId = typeof opts === "string" ? opts : opts.projectId;
  const tasks = await listTasks(projectId);

  const columns: KanbanColumn[] = KANBAN_COLUMNS.map((status) => {
    const columnTasks = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.kanbanOrder - b.kanbanOrder);

    return {
      status,
      label: status.replaceAll("_", " "),
      count: columnTasks.length,
      tasks: columnTasks.map((t) => ({
        id: t.id,
        taskCode: t.taskCode,
        title: t.title,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        estimatedHours: t.estimatedHours,
        storyPoints: t.storyPoints,
        kanbanOrder: t.kanbanOrder,
        assignee: t.assignee,
        workstream: t.workstream,
        hasBlocker: t.blockers.length > 0,
        blockers: t.blockers,
      })),
    };
  });

  if (typeof opts === "string") {
    return columns;
  }

  return {
    projectId,
    columns,
    totalTasks: tasks.length,
  };
}

export async function createTask(input: CreateTaskInput, actorId?: string) {
  const data = createTaskSchema.parse(input);
  const count = await prisma.task.count({ where: { projectId: data.projectId } });
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    select: { code: true },
  });
  const prefix = project?.code ?? "TSK";

  const maxOrder = await prisma.task.aggregate({
    where: { projectId: data.projectId, status: "BACKLOG" },
    _max: { kanbanOrder: true },
  });

  const dueDate =
    data.dueDate == null
      ? null
      : typeof data.dueDate === "string"
        ? new Date(data.dueDate)
        : data.dueDate;

  const task = await prisma.task.create({
    data: {
      taskCode: `${prefix}-${String(count + 1).padStart(3, "0")}`,
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      sprintId: data.sprintId ?? null,
      workstreamId: data.workstreamId ?? null,
      assigneeId: data.assigneeId ?? null,
      priority: data.priority,
      estimatedHours: data.estimatedHours,
      dueDate,
      founderApprovalRequired: data.founderApprovalRequired ?? false,
      status: "BACKLOG",
      kanbanOrder: (maxOrder._max.kanbanOrder ?? 0) + 1,
      activities: {
        create: {
          actorId: actorId ?? null,
          action: "CREATED",
          toValue: "BACKLOG",
        },
      },
    },
  });

  await writeAuditLog({
    actorId,
    action: "TASK_CREATED",
    entity: "Task",
    entityId: task.id,
    after: {
      taskCode: task.taskCode,
      title: task.title,
      status: task.status,
      priority: task.priority,
    },
  });

  if (task.assigneeId) {
    const emp = await prisma.employee.findUnique({
      where: { id: task.assigneeId },
      select: { userId: true },
    });
    if (emp?.userId) {
      await prisma.notification.create({
        data: {
          userId: emp.userId,
          type: "TASK_ASSIGNED",
          title: `Assigned: ${task.taskCode}`,
          body: task.title,
          href: `/tasks`,
        },
      });
    }
  }

  return task;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  opts?: { actorId?: string; kanbanOrder?: number } | string,
) {
  // Support legacy signature updateTaskStatus(id, status, actorId)
  const actorId = typeof opts === "string" ? opts : opts?.actorId;
  const kanbanOrder = typeof opts === "string" ? undefined : opts?.kanbanOrder;

  const before = await prisma.task.findUnique({ where: { id: taskId } });
  if (!before) throw new Error("TASK_NOT_FOUND");

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      ...(kanbanOrder !== undefined ? { kanbanOrder } : {}),
      activities: {
        create: {
          actorId: actorId ?? null,
          action: "STATUS_CHANGE",
          fromValue: before.status,
          toValue: status,
        },
      },
    },
    include: {
      assignee: { select: { id: true, name: true, photoUrl: true } },
      workstream: { select: { id: true, name: true, type: true } },
      blockers: {
        where: { status: { in: ["OPEN", "IN_PROGRESS", "ESCALATED"] } },
      },
    },
  });

  await writeAuditLog({
    actorId,
    action: "TASK_STATUS_UPDATE",
    entity: "Task",
    entityId: taskId,
    before: { status: before.status },
    after: { status: updated.status },
  });

  return updated;
}
