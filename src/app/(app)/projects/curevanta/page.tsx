import Link from "next/link";
import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { formatDate, formatINR, daysUntil } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { KpiCard } from "@/components/kpi-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Curevanta · TechMunda Control Tower" };

export default async function CurevantaProjectPage() {
  await requirePermission(PERMISSIONS.PROJECT_VIEW);

  const project = await prisma.project.findFirst({
    where: { OR: [{ code: "CUR" }, { name: { contains: "Curevanta", mode: "insensitive" } }] },
    include: {
      workstreams: { orderBy: { sortOrder: "asc" } },
      milestones: { orderBy: { sortOrder: "asc" }, include: { items: true } },
      releases: { orderBy: { createdAt: "desc" }, take: 1 },
      members: { include: { employee: { select: { name: true, title: true } } } },
      _count: { select: { tasks: true, bugs: true } },
    },
  });

  if (!project) {
    return (
      <EmptyState
        title="Curevanta not found"
        description="Run prisma seed to create the primary Curevanta project."
        action={
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        }
      />
    );
  }

  const days = daysUntil(project.targetReleaseDate);
  const release = project.releases[0];

  return (
    <div className="space-y-6">
      <div className="seed-banner rounded-lg px-4 py-2 text-xs">
        Seed / demo project dossier for Curevanta.
      </div>

      <header
        className="rounded-2xl border border-[var(--border)] px-6 py-7"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,155,154,0.1) 0%, transparent 50%), #fff",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#009B9A]">
          {project.code}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#30363A]">
          {project.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6B7578]">
          {project.description ??
            "Healthcare marketplace execution program — patient, doctor, and ops surfaces."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={project.status} kind="health" />
          <StatusBadge status={project.healthStatus} kind="health" />
          <Link href="/projects/roadmap">
            <Button type="button" size="sm" variant="outline">
              Roadmap
            </Button>
          </Link>
          <Link href="/kanban">
            <Button type="button" size="sm" variant="outline">
              Kanban
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Completion" value={`${project.completionPct}%`} />
        <KpiCard
          label="Days to release"
          value={days === null ? "—" : days}
          hint={formatDate(project.targetReleaseDate)}
        />
        <KpiCard label="Tasks" value={project._count.tasks} />
        <KpiCard
          label="Budget left"
          value={formatINR(
            project.budgetAllocatedInr - project.budgetSpentInr - project.budgetCommittedInr,
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workstreams</CardTitle>
            <CardDescription>{project.workstreams.length} streams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.workstreams.map((ws) => (
              <div key={ws.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{ws.name}</span>
                  <span className="tabular-nums text-[var(--muted)]">{ws.progressPct}%</span>
                </div>
                <Progress value={ws.progressPct} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release readiness</CardTitle>
            <CardDescription>
              {release ? `v${release.version}` : "No release record"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {release ? (
              <>
                <div className="flex items-center justify-between">
                  <StatusBadge status={release.readinessStatus} kind="health" />
                  <span className="text-2xl font-semibold tabular-nums text-[#009B9A]">
                    {release.readinessScore}
                  </span>
                </div>
                <Progress value={release.readinessScore} />
                <p className="text-xs text-[var(--muted)]">
                  QA {release.qaStatus} · Security {release.securityStatus} · UAT{" "}
                  {release.uatStatus}
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Seed a release to track readiness.</p>
            )}

            <div className="border-t border-[var(--border)] pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Team ({project.members.length})
              </p>
              <ul className="mt-2 space-y-1">
                {project.members.slice(0, 8).map((m) => (
                  <li key={m.id} className="text-sm text-[var(--graphite)]">
                    {m.employee.name}
                    <span className="text-[var(--muted)]"> · {m.employee.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.milestones.map((m) => {
            const done = m.items.filter((i) => i.completed).length;
            const total = m.items.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={m.id} className="rounded-lg border border-[var(--border)] px-3 py-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-[var(--graphite)]">{m.title}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {m.monthLabel ?? formatDate(m.targetDate)} · {done}/{total} items
                    </p>
                  </div>
                  <StatusBadge status={m.status} kind="health" />
                </div>
                <Progress value={pct} className="mt-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
