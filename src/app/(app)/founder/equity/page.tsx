import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EquityPage() {
  await requirePermission(PERMISSIONS.EQUITY_VIEW);
  const holders = await prisma.equityHolder.findMany({
    include: { transactions: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Equity Cap Table"
        description="Administrative equity tracking with legal and board confirmation gates."
      />
<div className="seed-banner rounded-lg px-4 py-3 text-sm">
        No equity is auto-issued by this system. All rows below are placeholders / planning trackers.
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {holders.map((h) => (
          <Card key={h.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{h.holderName}</span>
                <Badge variant="outline">{h.type}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Equity %: {h.equityPct}%</div>
              <div>Shares: {h.shares}</div>
              <div>Vested: {h.vestedPct}%</div>
              <div className="flex gap-2">
                <Badge variant={h.legalConfirmed ? "success" : "warning"}>
                  Legal {h.legalConfirmed ? "confirmed" : "pending"}
                </Badge>
                <Badge variant={h.boardConfirmed ? "success" : "warning"}>
                  Board {h.boardConfirmed ? "confirmed" : "pending"}
                </Badge>
              </div>
              <p className="text-xs text-[var(--muted)]">{h.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
