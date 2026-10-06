import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function UatPage() {
  await requirePermission(PERMISSIONS.CLIENT_VIEW);
  const releases = await prisma.release.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="UAT"
        description="User acceptance status by release — client-safe view."
      />
      {!releases.length ? (
        <EmptyState title="No releases for UAT" description="UAT status tracks against releases." />
      ) : (
        <div className="space-y-3">
          {releases.map((r) => (
            <Card key={r.id} variant="elevated">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">
                    {r.project.name} · {r.version}
                  </CardTitle>
                  <p className="text-xs text-[var(--text-muted)]">{r.environment}</p>
                </div>
                <Badge
                  variant={
                    r.uatStatus === "PASSED" || r.uatStatus === "APPROVED"
                      ? "success"
                      : r.uatStatus === "IN_PROGRESS"
                        ? "warning"
                        : "secondary"
                  }
                >
                  UAT {r.uatStatus}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">QA {r.qaStatus}</Badge>
                <Badge variant="outline">Security {r.securityStatus}</Badge>
                <Badge variant="outline">
                  Founder {r.founderApproved ? "approved" : "pending"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
