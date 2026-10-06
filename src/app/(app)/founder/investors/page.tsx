import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  await requirePermission(PERMISSIONS.EQUITY_VIEW);
  const holders = await prisma.equityHolder.findMany({
    where: { type: { in: ["INVESTOR", "STRATEGIC", "ADVISOR"] } },
    include: { transactions: true },
    orderBy: { holderName: "asc" },
  });
  const all = await prisma.equityHolder.findMany();
  const investorPct = all
    .filter((h) => h.type === "INVESTOR" || h.type === "STRATEGIC")
    .reduce((s, h) => s + h.equityPct, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Investors"
        description="Administrative investor / strategic holder tracking. No auto-issuance."
      />
      <Card variant="status">
        <CardContent className="p-4 text-sm">
          Tracked investor/strategic %: <strong>{investorPct}%</strong>. Development contribution of
          ₹30L does not automatically convert to equity.
        </CardContent>
      </Card>
      {!holders.length ? (
        <EmptyState
          title="No investor holders on record"
          description="Seed includes founder/ESOP placeholders only. Add investors via equity workflow with legal/board confirmation."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {holders.map((h) => (
            <Card key={h.id} variant="elevated">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle>{h.holderName}</CardTitle>
                <Badge variant="outline">{h.type}</Badge>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>Equity: {h.equityPct}%</div>
                <div>Investment: {formatINR(h.investmentInr)}</div>
                <div className="flex gap-2">
                  <Badge variant={h.legalConfirmed ? "success" : "warning"}>
                    Legal {h.legalConfirmed ? "ok" : "pending"}
                  </Badge>
                  <Badge variant={h.boardConfirmed ? "success" : "warning"}>
                    Board {h.boardConfirmed ? "ok" : "pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
