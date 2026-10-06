"use server";

import { auth } from "@/lib/auth";
import { assertPermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { getAIProvider, type AITaskProposal } from "@/lib/ai/provider";
import { getFounderDashboard } from "@/server/dashboard";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { createTask } from "@/server/tasks";
import type { SystemRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function generateBriefAction() {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.AI_USE);

  const dash = await getFounderDashboard();
  if (!dash) return "No project data available.";

  const text = dash.aiBrief;
  await prisma.aIExecution.create({
    data: {
      userId: session.user.id,
      kind: "DAILY_BRIEF",
      prompt: "founder-dashboard-context",
      response: text,
      model: process.env.AI_MODEL ?? "deterministic-fallback",
      success: true,
    },
  });
  return text;
}

export async function proposeTasksAction(prompt: string) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.AI_USE);

  const ai = getAIProvider();
  const proposals = await ai.proposeTasks(prompt, "Curevanta December 2026");

  await prisma.aIExecution.create({
    data: {
      userId: session.user.id,
      kind: "TASK_PROPOSAL",
      prompt,
      response: JSON.stringify(proposals),
      model: process.env.AI_MODEL ?? "deterministic-fallback",
      success: true,
    },
  });

  return {
    proposals,
    note: "Proposals only — tasks are NOT created until you explicitly approve.",
  };
}

export async function createProposedTasksAction(
  confirmed: boolean,
  proposals: AITaskProposal[],
) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  assertPermission(session.user.role as SystemRole, PERMISSIONS.TASK_MANAGE);

  if (!confirmed) {
    return { created: false, message: "Confirmation required. Type yes to create." };
  }

  const project = await prisma.project.findFirst({ where: { isPrimary: true } });
  if (!project) return { created: false, message: "No primary project." };

  let created = 0;
  for (const p of proposals) {
    await createTask(
      {
        title: p.title,
        description: `${p.description}\n\nAC:\n- ${p.acceptanceCriteria.join("\n- ")}`,
        projectId: project.id,
        priority: p.priority,
        estimatedHours: p.estimatedHours,
      },
      session.user.id,
    );
    created += 1;
  }

  await writeAuditLog({
    actorId: session.user.id,
    action: "AI_TASKS_CREATED",
    entity: "Task",
    after: { count: created, proposals },
  });

  revalidatePath("/tasks");
  revalidatePath("/kanban");
  return { created: true, message: `Created ${created} tasks after founder approval.` };
}
