import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { BurndownChart } from "@/components/charts";

export const dynamic = "force-dynamic";

export default async function SprintsPage() {
  await requirePermission(PERMISSIONS.PROJECT_VIEW);
  const sprints = await prisma.sprint.findMany({
    include: { tasks: true, project: true },
    orderBy: { startDate: "desc" },
  });

  const active = sprints.find((s) => s.status === "ACTIVE") ?? sprints[0];
  const completion = active
    ? Math.round(
        (active.tasks.filter((t) => ["DONE", "APPROVED"].includes(t.status)).length /
          Math.max(active.tasks.length, 1)) *
          100,
      )
    : 0;

  const burndown = active
    ? Array.from({ length: 10 }).map((_, i) => {
        const ideal = active.committedPoints - (active.committedPoints / 9) * i;
        const actual =
          i === 0
            ? active.committedPoints
            : Math.max(active.committedPoints - active.completedPoints * (i / 5), active.committedPoints - active.completedPoints);
        return { day: `D${i + 1}`, ideal: Math.round(ideal), actual: Math.round(actual) };
      })
    : [];

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Sprint Board"
        description="2-week sprint execution for Curevanta."
      />
{active ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{active.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-[var(--muted)]">{active.goal}</p>
              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div>
                  <div className="text-xs text-[var(--muted)]">Start</div>
                  {formatDate(active.startDate)}
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">End</div>
                  {formatDate(active.endDate)}
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Committed</div>
                  {active.committedPoints} pts
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Velocity</div>
                  {active.velocity}
                </div>
              </div>
              <Progress value={completion} />
              <div className="text-sm">{completion}% complete · {active.tasks.length} tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Burndown</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <BurndownChart data={burndown} />
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="space-y-2">
        {sprints.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {formatDate(s.startDate)} → {formatDate(s.endDate)} · {s.status}
                </div>
              </div>
              <div className="text-sm">
                {s.completedPoints}/{s.committedPoints} pts
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
