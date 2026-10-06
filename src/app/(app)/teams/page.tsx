import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  await requirePermission(PERMISSIONS.EMPLOYEE_VIEW);
  const teams = await prisma.team.findMany({
    include: {
      members: { include: { employee: true } },
      project: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader title="Teams" description="Delivery teams and membership — live." />
      {!teams.length ? (
        <EmptyState title="No teams" description="Seed data will create Curevanta Core." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((t) => (
            <Card key={t.id} variant="elevated">
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <p className="text-xs text-[var(--text-muted)]">
                  {t.project?.name ?? "No project"} · {t.members.length} members
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {t.members.map((m) => (
                  <Badge key={m.id} variant="outline">
                    {m.employee.name}
                    {m.role ? ` · ${m.role}` : ""}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
