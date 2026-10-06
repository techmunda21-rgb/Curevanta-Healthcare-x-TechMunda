import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { KpiCard } from "@/components/kpi-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BugsPage() {
  await requirePermission(PERMISSIONS.QA_VIEW);
  const bugs = await prisma.bug.findMany({
    include: { reporter: true, owner: true },
    orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
  });
  const open = bugs.filter((b) => b.status === "OPEN" || b.status === "IN_PROGRESS").length;
  const critical = bugs.filter((b) => b.severity === "CRITICAL").length;

  return (
    <div className="space-y-6">
      <ModuleHeader title="Bugs" description="Defect register — live from PostgreSQL." />
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Total" value={bugs.length} />
        <KpiCard label="Open" value={open} tone={open ? "warning" : "success"} />
        <KpiCard label="Critical" value={critical} tone={critical ? "danger" : "default"} />
      </div>
      {!bugs.length ? (
        <EmptyState title="No bugs" description="QA findings will appear here." />
      ) : (
        <div className="space-y-3">
          {bugs.map((b) => (
            <Card key={b.id} variant="elevated">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">
                    {b.bugCode} · {b.title}
                  </CardTitle>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {b.module ?? "—"} · {b.environment} · Owner {b.owner?.name ?? "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={b.severity} kind="bug" />
                  <Badge variant="outline">{b.status}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      <Link href="/qa" className="text-sm font-semibold text-[var(--primary-pressed)] underline">
        QA overview →
      </Link>
    </div>
  );
}
