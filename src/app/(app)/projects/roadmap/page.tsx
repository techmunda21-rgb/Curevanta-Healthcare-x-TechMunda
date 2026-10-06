import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  await requirePermission(PERMISSIONS.PROJECT_VIEW);
  const project = await prisma.project.findFirst({
    where: { isPrimary: true },
    include: {
      milestones: { include: { items: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Curevanta Roadmap"
        description="Internal RC 15–20 Dec 2026 · Final controlled launch by 31 Dec 2026"
      />

      <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--border)] md:before:left-1/2">
        {project?.milestones.map((m, idx) => (
          <div
            key={m.id}
            className={`relative grid gap-4 md:grid-cols-2 ${idx % 2 === 1 ? "md:text-right" : ""}`}
          >
            <div className={idx % 2 === 1 ? "md:col-start-2" : ""}>
              <Card variant="elevated">
                <CardHeader>
                  <div className="text-[11px] font-semibold tracking-[0.16em] text-[var(--primary)]">
                    {m.monthLabel}
                  </div>
                  <CardTitle>{m.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {m.items.map((item) => (
                    <Badge key={item.id} variant={item.completed ? "success" : "secondary"}>
                      {item.title}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
