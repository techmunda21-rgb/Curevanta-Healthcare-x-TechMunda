import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  await requirePermission(PERMISSIONS.RELEASE_VIEW);
  const releases = await prisma.release.findMany({
    include: { project: true, deployments: true, bugs: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Releases"
        description="Readiness score from P0/QA/security/UAT/infra — founder approval required for production."
      />
{releases.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>
                {r.version} · {r.project.name}
              </CardTitle>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">{r.environment}</Badge>
                <Badge
                  variant={
                    r.readinessStatus === "READY"
                      ? "success"
                      : r.readinessStatus === "AT_RISK"
                        ? "warning"
                        : "danger"
                  }
                >
                  {r.readinessStatus.replace("_", " ")}
                </Badge>
                <span className="text-[var(--muted)]">Target {formatDate(r.releaseDate)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl">{r.readinessScore}</div>
              <div className="text-xs text-[var(--muted)]">readiness</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Progress value={r.readinessScore} />
            <div className="grid gap-2 md:grid-cols-3">
              <div>QA: {r.qaStatus}</div>
              <div>Security: {r.securityStatus}</div>
              <div>UAT: {r.uatStatus}</div>
            </div>
            <div>Features: {r.features}</div>
            <div>Known issues: {r.knownIssues}</div>
            <div>Rollback: {r.rollbackPlan}</div>
            <div>Open bugs linked: {r.bugs.length}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
