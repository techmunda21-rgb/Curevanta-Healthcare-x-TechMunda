import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  await requirePermission(PERMISSIONS.PROJECT_VIEW);
  const project = await prisma.project.findFirst({
    where: { isPrimary: true },
    include: {
      milestones: {
        orderBy: { sortOrder: "asc" },
        include: { items: true },
      },
    },
  });

  if (!project?.milestones.length) {
    return <EmptyState title="No milestones" description="No milestone data for the primary project." />;
  }

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Milestones"
        description={`${project.name} roadmap milestones — live from database.`}
      />
      <div className="space-y-4">
        {project.milestones.map((m) => {
          const done = m.items.filter((i) => i.completed).length;
          const total = m.items.length || 1;
          return (
            <Card key={m.id} variant="elevated">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <div className="text-[11px] font-bold tracking-[0.14em] text-[var(--primary)]">
                    {m.monthLabel}
                  </div>
                  <CardTitle className="mt-1">{m.title}</CardTitle>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Target {formatDate(m.targetDate)} · {done}/{total} items complete
                  </p>
                </div>
                <Badge variant={m.status === "IN_PROGRESS" ? "warning" : "secondary"}>
                  {m.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {m.items.map((item) => (
                  <Badge key={item.id} variant={item.completed ? "success" : "outline"}>
                    {item.title}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
