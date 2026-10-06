import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { KpiCard } from "@/components/kpi-card";

export const dynamic = "force-dynamic";

export default async function ExposPage() {
  await requirePermission(PERMISSIONS.TRAVEL_VIEW);
  const events = await prisma.travelEvent.findMany({
    where: { category: { contains: "Expo", mode: "insensitive" } },
    include: { expoLeads: true, attendees: { include: { employee: true } } },
    orderBy: { eventDate: "asc" },
  });
  // also show all travel if no expo-tagged
  const list =
    events.length > 0
      ? events
      : await prisma.travelEvent.findMany({
          include: { expoLeads: true, attendees: { include: { employee: true } } },
          orderBy: { eventDate: "asc" },
        });

  const leads = list.reduce((s, e) => s + e.expoLeads.length + e.leads, 0);
  const pipeline = list.reduce((s, e) => s + e.pipelineValueInr, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader title="Expos" description="Expo pipeline and leads — live CRM." />
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Events" value={list.length} />
        <KpiCard label="Leads" value={leads} />
        <KpiCard label="Pipeline" value={formatINR(pipeline)} />
      </div>
      {!list.length ? (
        <EmptyState title="No expo records" description="Add events under Travel / Expansion." />
      ) : (
        <div className="space-y-3">
          {list.map((e) => {
            const total =
              e.flightCostInr +
              e.hotelCostInr +
              e.visaCostInr +
              e.registrationCostInr +
              e.localTravelCostInr;
            return (
              <Card key={e.id} variant="elevated">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{e.eventName}</CardTitle>
                    <p className="text-xs text-[var(--text-muted)]">
                      {e.city}, {e.country} · {formatDate(e.eventDate)}
                    </p>
                  </div>
                  <Badge variant="outline">{e.applicationStatus}</Badge>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm md:grid-cols-3">
                  <div>Est. cost {formatINR(total)}</div>
                  <div>
                    Leads {e.leads} · Qualified {e.qualifiedLeads}
                  </div>
                  <div>Pipeline {formatINR(e.pipelineValueInr)}</div>
                  <div className="md:col-span-3 flex flex-wrap gap-2">
                    {e.expoLeads.map((l) => (
                      <Badge key={l.id} variant="secondary">
                        {l.company}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
