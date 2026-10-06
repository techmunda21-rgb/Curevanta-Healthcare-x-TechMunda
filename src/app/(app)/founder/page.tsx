import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/status-badge";
import { formatINR, formatDate } from "@/lib/utils";
import Link from "next/link";
import { getAIProvider } from "@/lib/ai/provider";
import { getFounderDashboard } from "@/server/dashboard";

export const dynamic = "force-dynamic";

export default async function FounderPage() {
  await requirePermission(PERMISSIONS.APPROVAL_DECIDE);
  const data = await getFounderDashboard();
  const decisions = await prisma.decision.findMany({ orderBy: { date: "desc" }, take: 5 });
  const approvals = await prisma.approval.findMany({
    where: { status: "PENDING" },
    include: { requester: true },
  });

  const brief =
    data?.aiBrief ??
    (await getAIProvider().generateDailyBrief({
      projectName: "Curevanta",
      healthScore: 0,
      healthStatus: "AT_RISK",
      yesterdayCompleted: 0,
      todayActive: 0,
      criticalBlockers: 0,
      budgetRemainingInr: 0,
      daysToRelease: null,
      founderDecisionsPending: approvals.length,
    }));

  return (
    <div className="space-y-4">
      <ModuleHeader
        title="Founder Control Center"
        description="Daily cadence: 09:00 Control Tower · 09:30 Standup · 13:30 Blockers · 18:30 QA/Demo"
      />
<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { t: "Today's Priorities", href: "/tasks" },
          { t: "Top Blockers", href: "/blockers" },
          { t: "Founder Approvals", href: "/founder/approvals" },
          { t: "Team Performance", href: "/team/performance" },
          { t: "Project Health", href: "/dashboard" },
          { t: "Finance", href: "/finance/budget" },
          { t: "Client Feedback", href: "/clients/feedback" },
          { t: "Release Readiness", href: "/releases" },
          { t: "Global Expansion", href: "/growth/expansion" },
          { t: "AI CTO Brief", href: "/ai" },
          { t: "Decision Log", href: "/founder/decisions" },
          { t: "Equity", href: "/founder/equity" },
        ].map((item) => (
          <Link key={item.t} href={item.href}>
            <Card className="transition hover:border-[var(--brand)]">
              <CardContent className="p-4 font-medium">{item.t}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvals.map((a) => (
              <div key={a.id} className="rounded-lg border border-[var(--border)] p-3">
                <div className="font-medium">{a.title}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <Badge variant="outline">{a.category}</Badge>
                  <span>by {a.requester.name}</span>
                  {a.costInr ? <span>{formatINR(a.costInr)}</span> : null}
                  <span>{formatDate(a.createdAt)}</span>
                </div>
              </div>
            ))}
            {!approvals.length ? <p className="text-sm text-[var(--muted)]">No pending approvals.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI CTO Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-lg bg-[var(--graphite)] p-4 text-xs text-[#e8eeee]">
              {brief}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Decisions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {decisions.map((d) => (
            <div key={d.id} className="border-b border-[var(--border)] pb-3">
              <div className="text-xs text-[var(--muted)]">
                {d.decisionCode} · {formatDate(d.date)}
              </div>
              <div className="font-medium">{d.finalDecision}</div>
              <div className="text-sm text-[var(--muted)]">{d.problem}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {data ? (
        <Card>
          <CardHeader>
            <CardTitle>Open Blockers Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.founderActions.blockers.map((b) => (
              <div key={b.id} className="flex items-start gap-2 text-sm">
                <PriorityBadge priority={b.priority} />
                <span>{b.reason}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
