import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import { formatINR, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ExpansionPage() {
  await requirePermission(PERMISSIONS.TRAVEL_VIEW);
  const events = await prisma.travelEvent.findMany({
    include: { expoLeads: true },
    orderBy: { eventDate: "asc" },
  });

  const byStatus = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.applicationStatus] = (acc[e.applicationStatus] ?? 0) + 1;
    return acc;
  }, {});
  const pipeline = events.reduce((s, e) => s + e.pipelineValueInr, 0);
  const countries = new Set(events.map((e) => e.country)).size;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Global Expansion"
        description="Geographic pipeline across travel/expo CRM — live."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Events" value={events.length} />
        <KpiCard label="Countries" value={countries} />
        <KpiCard label="Pipeline" value={formatINR(pipeline)} />
        <KpiCard label="Watchlist" value={byStatus.WATCHLIST ?? 0} />
      </div>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Pipeline board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] py-2 text-sm"
            >
              <div>
                <div className="font-medium">{e.eventName}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {e.city}, {e.country} · {formatDate(e.eventDate)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{e.applicationStatus}</Badge>
                <span className="tabular-nums text-[var(--text-muted)]">
                  {formatINR(e.pipelineValueInr)}
                </span>
              </div>
            </div>
          ))}
          {!events.length ? (
            <p className="text-sm text-[var(--text-muted)]">No expansion events yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
