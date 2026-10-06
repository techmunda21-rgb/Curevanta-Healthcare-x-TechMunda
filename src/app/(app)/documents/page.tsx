import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  await requirePermission(PERMISSIONS.DOCUMENT_VIEW);
  const docs = await prisma.document.findMany({
    include: { owner: true, project: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Documents"
        description="Controlled document register — live from PostgreSQL."
      />
      {!docs.length ? (
        <EmptyState
          title="No documents"
          description="Seed includes product and legal placeholders."
        />
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <Card key={d.id} variant="elevated">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <p className="text-xs text-[var(--text-muted)]">
                    {d.project?.name ?? "Org"} · v{d.version} · {formatDate(d.updatedAt)}
                    {d.owner ? ` · ${d.owner.name}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{d.category}</Badge>
                  <Badge variant="secondary">{d.visibility}</Badge>
                </div>
              </CardHeader>
              {d.tags.length ? (
                <CardContent className="flex flex-wrap gap-1.5">
                  {d.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
