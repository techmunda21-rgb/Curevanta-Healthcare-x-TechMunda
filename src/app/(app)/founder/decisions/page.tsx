import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatINR } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  await requirePermission(PERMISSIONS.DECISION_MANAGE);
  const decisions = await prisma.decision.findMany({
    include: { owner: true, project: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Decision Log"
        description="Permanent founder/CTO decision register — live."
      />
      {!decisions.length ? (
        <EmptyState title="No decisions logged" description="Architecture and product decisions appear here." />
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => (
            <Card key={d.id} variant="elevated">
              <CardHeader>
                <div className="text-xs text-[var(--text-muted)]">
                  {d.decisionCode} · {formatDate(d.date)} · {d.owner.name}
                </div>
                <CardTitle className="text-base">{d.finalDecision}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <span className="font-semibold text-[var(--text-primary)]">Problem: </span>
                  {d.problem}
                </p>
                <p>
                  <span className="font-semibold text-[var(--text-primary)]">Options: </span>
                  {d.options}
                </p>
                <p>
                  <span className="font-semibold text-[var(--text-primary)]">Reason: </span>
                  {d.reason}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                  <span>Module: {d.affectedModule ?? "—"}</span>
                  <span>Cost: {d.costImpactInr != null ? formatINR(d.costImpactInr) : "—"}</span>
                  <span>Timeline: {d.timelineImpact ?? "—"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
