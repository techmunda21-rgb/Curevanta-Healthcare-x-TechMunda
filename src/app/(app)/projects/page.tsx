import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatINR, formatDate, daysUntil } from "@/lib/utils";
import { HealthBadge } from "@/components/status-badge";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requirePermission(PERMISSIONS.PROJECT_VIEW);
  const projects = await prisma.project.findMany({
    include: {
      _count: { select: { tasks: true, members: true, workstreams: true } },
      sprints: { where: { status: "ACTIVE" }, take: 1 },
    },
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
  });

  if (!projects.length) {
    return (
      <EmptyState title="No projects" description="Seed the database to load Curevanta." />
    );
  }

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="All Projects"
        description="Live project portfolio from PostgreSQL."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} href={p.code === "CUR" ? "/projects/curevanta" : `/projects`}>
            <Card variant="interactive" className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {p.name}{" "}
                      <span className="text-[var(--text-muted)]">({p.code})</span>
                    </CardTitle>
                    <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <HealthBadge status={p.healthStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={p.completionPct} />
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-[var(--text-muted)]">Tasks</div>
                    <div className="font-semibold">{p._count.tasks}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)]">Team</div>
                    <div className="font-semibold">{p._count.members}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)]">Budget left</div>
                    <div className="font-semibold">
                      {formatINR(
                        Math.max(0, p.budgetAllocatedInr - p.budgetSpentInr - p.budgetCommittedInr),
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                  <Badge variant="outline">Health {p.healthScore}</Badge>
                  <Badge variant="secondary">
                    Release {daysUntil(p.targetReleaseDate) ?? "—"}d
                  </Badge>
                  {p.sprints[0] ? <Badge variant="default">{p.sprints[0].name}</Badge> : null}
                  <span>Target {formatDate(p.targetReleaseDate)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
