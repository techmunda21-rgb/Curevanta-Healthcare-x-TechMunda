import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { getPrimaryProjectId } from "@/server/context";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EngineeringPage() {
  await requirePermission(PERMISSIONS.PROJECT_VIEW);
  const project = await getPrimaryProjectId();
  const [tasks, bugs, releases, workstreams] = await Promise.all([
    project
      ? prisma.task.groupBy({ by: ["status"], where: { projectId: project.id }, _count: true })
      : [],
    project
      ? prisma.bug.count({
          where: { projectId: project.id, status: { in: ["OPEN", "IN_PROGRESS"] } },
        })
      : 0,
    project
      ? prisma.release.findMany({
          where: { projectId: project.id },
          orderBy: { createdAt: "desc" },
          take: 3,
        })
      : [],
    project
      ? prisma.workstream.findMany({
          where: { projectId: project.id },
          orderBy: { sortOrder: "asc" },
        })
      : [],
  ]);

  const statusMap = Object.fromEntries(tasks.map((t) => [t.status, t._count]));
  const inDev =
    (statusMap.IN_PROGRESS ?? 0) + (statusMap.IN_REVIEW ?? 0) + (statusMap.QA ?? 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Development"
        description="Engineering pulse for Curevanta — tasks, defects, releases."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="In development" value={inDev} />
        <KpiCard
          label="Blocked"
          value={statusMap.BLOCKED ?? 0}
          tone={(statusMap.BLOCKED ?? 0) ? "danger" : "default"}
        />
        <KpiCard label="Open bugs" value={bugs} tone={bugs ? "warning" : "success"} />
        <KpiCard label="Workstreams" value={workstreams.length} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Workstream health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workstreams.map((w) => (
              <div key={w.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{w.name}</span>
                  <Badge variant={w.riskLevel === "HIGH" ? "danger" : "secondary"}>
                    {w.progressPct}%
                  </Badge>
                </div>
                <Progress value={w.progressPct} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent releases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {releases.map((r) => (
              <Link
                key={r.id}
                href="/releases"
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-muted)]"
              >
                <span className="font-medium">{r.version}</span>
                <Badge variant="outline">{r.readinessStatus}</Badge>
              </Link>
            ))}
            {!releases.length ? (
              <p className="text-sm text-[var(--text-muted)]">No releases yet.</p>
            ) : null}
            <div className="flex gap-3 pt-2 text-sm">
              <Link href="/qa/bugs" className="font-semibold text-[var(--primary-pressed)] underline">
                Bugs
              </Link>
              <Link href="/kanban" className="font-semibold text-[var(--primary-pressed)] underline">
                Kanban
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
