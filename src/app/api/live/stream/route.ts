import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Server-Sent Events heartbeat for Control Tower live modules */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();
  let closed = false;
  let interval: ReturnType<typeof setInterval> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          closed = true;
        }
      };

      send("connected", { ok: true, at: new Date().toISOString(), userId });

      const tick = async () => {
        if (closed) return;
        try {
          const [tasks, bugs, approvals, notifications, project] = await Promise.all([
            prisma.task.count({ where: { status: { not: "DONE" } } }),
            prisma.bug.count({
              where: { status: { notIn: ["CLOSED", "RESOLVED", "WONT_FIX"] } },
            }),
            prisma.approval.count({ where: { status: "PENDING" } }),
            prisma.notification.count({ where: { userId, read: false } }),
            prisma.project.findFirst({
              where: { isPrimary: true },
              select: { id: true, completionPct: true, healthStatus: true, updatedAt: true },
            }),
          ]);

          send("snapshot", {
            at: new Date().toISOString(),
            openTasks: tasks,
            openBugs: bugs,
            pendingApprovals: approvals,
            unreadNotifications: notifications,
            primary: project,
          });
        } catch {
          send("error", { message: "snapshot_failed", at: new Date().toISOString() });
        }
      };

      void tick();
      interval = setInterval(() => void tick(), 10000);
      heartbeat = setInterval(() => {
        send("ping", { at: new Date().toISOString() });
      }, 15000);
    },
    cancel() {
      closed = true;
      if (interval) clearInterval(interval);
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
