import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function DeploymentsPage() {
  await requirePermission(PERMISSIONS.RELEASE_VIEW);
  const deployments = await prisma.deployment.findMany({
    include: { release: { include: { project: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader title="Deployments" description="Environment promotions — live." />
      {!deployments.length ? (
        <EmptyState
          title="No deployments logged"
          description="Deployments appear when releases are promoted across environments."
        />
      ) : (
        <div className="space-y-3">
          {deployments.map((d) => (
            <Card key={d.id} variant="elevated">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">
                    {d.release.version} → {d.environment}
                  </CardTitle>
                  <p className="text-xs text-[var(--text-muted)]">
                    {d.release.project.name} · {formatDate(d.deployedAt ?? d.createdAt)}
                  </p>
                </div>
                <Badge variant={d.status === "SUCCESS" ? "success" : "secondary"}>{d.status}</Badge>
              </CardHeader>
              {d.notes ? <CardContent className="text-sm text-[var(--text-secondary)]">{d.notes}</CardContent> : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
