"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { TaskStatus } from "@prisma/client";
import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { createTask, createTaskSchema, updateTaskStatus } from "@/server/tasks";

const updateStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum([
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
  ]),
  kanbanOrder: z.number().int().optional(),
});

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Supports object form (preferred) or legacy (taskId, status) for kanban DnD */
export async function updateTaskStatusAction(
  taskId: string,
  status: TaskStatus,
): Promise<void>;
export async function updateTaskStatusAction(input: {
  taskId: string;
  status: TaskStatus;
  kanbanOrder?: number;
}): Promise<ActionResult>;
export async function updateTaskStatusAction(
  inputOrTaskId: { taskId: string; status: TaskStatus; kanbanOrder?: number } | string,
  maybeStatus?: TaskStatus,
): Promise<ActionResult | void> {
  const session = await requirePermission(PERMISSIONS.TASK_MANAGE);
  const parsed =
    typeof inputOrTaskId === "string"
      ? updateStatusSchema.parse({ taskId: inputOrTaskId, status: maybeStatus })
      : updateStatusSchema.parse(inputOrTaskId);

  const updated = await updateTaskStatus(parsed.taskId, parsed.status, {
    actorId: session.user.id,
    kanbanOrder: parsed.kanbanOrder,
  });

  revalidatePath("/kanban");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  if (typeof inputOrTaskId === "string") return;
  return { ok: true, data: { id: updated.id, status: updated.status } };
}

/** Supports FormData (tasks page form) or plain object */
export async function createTaskAction(raw: FormData): Promise<void>;
export async function createTaskAction(
  raw: unknown,
): Promise<ActionResult<{ id: string; taskCode: string }>>;
export async function createTaskAction(
  raw: FormData | unknown,
): Promise<void | ActionResult<{ id: string; taskCode: string }>> {
  const session = await requirePermission(PERMISSIONS.TASK_MANAGE);

  const payload =
    raw instanceof FormData
      ? {
          title: raw.get("title"),
          description: raw.get("description") || undefined,
          projectId: raw.get("projectId"),
          assigneeId: raw.get("assigneeId") || undefined,
          priority: raw.get("priority") || "P2",
          estimatedHours: Number(raw.get("estimatedHours") || 0),
          dueDate: raw.get("dueDate") || undefined,
        }
      : raw;

  const parsed = createTaskSchema.parse(payload);
  const task = await createTask(parsed, session.user.id);

  revalidatePath("/tasks");
  revalidatePath("/kanban");
  revalidatePath("/dashboard");

  if (raw instanceof FormData) return;
  return { ok: true, data: { id: task.id, taskCode: task.taskCode } };
}
