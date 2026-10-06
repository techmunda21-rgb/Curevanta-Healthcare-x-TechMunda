import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { upsertStandupAction } from "@/app/actions/standups";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StandupsPage() {
  await requirePermission(PERMISSIONS.TASK_VIEW);
  const session = await auth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [standups, employees] = await Promise.all([
    prisma.standup.findMany({
      where: { date: today },
      include: { user: true },
    }),
    prisma.employee.findMany({
      include: {
        assignedTasks: { where: { status: { notIn: ["DONE", "APPROVED"] } } },
        user: true,
      },
    }),
  ]);

  const byUser = new Map(standups.map((s) => [s.userId, s]));

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Daily Standup"
        description="Founder summary view — live team updates."
      />
<Card>
        <CardHeader>
          <CardTitle>Submit your update</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertStandupAction} className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <Label>Yesterday</Label>
              <Textarea name="yesterday" placeholder="What did you complete?" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Today</Label>
              <Textarea name="today" placeholder="What will you complete?" />
            </div>
            <div className="space-y-1">
              <Label>Blockers</Label>
              <Textarea name="blockers" />
            </div>
            <div className="space-y-1">
              <Label>Help needed</Label>
              <Textarea name="helpNeeded" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Expected EOD output</Label>
              <Textarea name="expectedEodOutput" />
            </div>
            <Button type="submit">Save standup</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {employees.map((e) => {
          const s = e.userId ? byUser.get(e.userId) : undefined;
          const flags: string[] = [];
          if (!s) flags.push("No update");
          if (!e.assignedTasks.length) flags.push("No assigned task");
          return (
            <Card key={e.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{e.name}</CardTitle>
                  <div className="text-xs text-[var(--muted)]">{e.title}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {flags.map((f) => (
                    <Badge key={f} variant="warning">
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-semibold text-[var(--muted)]">YESTERDAY</span>
                  <p>{s?.yesterday ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--muted)]">TODAY</span>
                  <p>{s?.today ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--muted)]">BLOCKERS</span>
                  <p>{s?.blockers ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--muted)]">EOD</span>
                  <p>{s?.expectedEodOutput ?? "—"}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-[var(--muted)]">Signed in as {session?.user?.email}</p>
    </div>
  );
}
