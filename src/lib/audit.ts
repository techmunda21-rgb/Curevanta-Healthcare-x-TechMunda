import { prisma } from "@/lib/db";

type AuditInput = {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
  sessionId?: string | null;
};

export async function writeAuditLog(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        before: input.before ? (input.before as object) : undefined,
        after: input.after ? (input.after as object) : undefined,
        ip: input.ip ?? null,
        sessionId: input.sessionId ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] failed to write log", error);
  }
}
