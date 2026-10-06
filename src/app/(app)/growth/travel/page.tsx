import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TravelPage() {
  await requirePermission(PERMISSIONS.TRAVEL_VIEW);
  const events = await prisma.travelEvent.findMany({
    include: { attendees: { include: { employee: true } }, expoLeads: true },
    orderBy: { eventDate: "asc" },
  });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Travel"
        description="Expo and expansion travel CRM — live."
      />
{events.map((e) => {
        const total =
          e.flightCostInr +
          e.hotelCostInr +
          e.visaCostInr +
          e.registrationCostInr +
          e.localTravelCostInr;
        return (
          <Card key={e.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{e.eventName}</CardTitle>
                <div className="mt-1 text-sm text-[var(--muted)]">
                  {e.city}, {e.country} · {formatDate(e.eventDate)}
                </div>
              </div>
              <Badge variant="outline">{e.applicationStatus}</Badge>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-3">
              <div>Travel support: {e.travelSupport ?? "Unconfirmed"}</div>
              <div>Est. total cost: {formatINR(total)}</div>
              <div>Leads: {e.leads} · Pipeline {formatINR(e.pipelineValueInr)}</div>
              <div className="md:col-span-3 text-xs text-[var(--muted)]">{e.notes}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
