import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function QaPage() {
  await requirePermission(PERMISSIONS.QA_VIEW);
  const [bugs, testRuns, testCases, releases] = await Promise.all([
    prisma.bug.groupBy({ by: ["status"], _count: true }),
    prisma.testRun.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { cases: true } }),
    prisma.testCase.count(),
    prisma.release.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, version: true, qaStatus: true, securityStatus: true, uatStatus: true },
    }),
  ]);

  const openBugs = bugs
    .filter((b) => b.status === "OPEN" || b.status === "IN_PROGRESS")
    .reduce((s, b) => s + b._count, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="QA"
        description="Test runs, cases, security checks, and UAT readiness — live."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open bugs" value={openBugs} tone={openBugs ? "warning" : "success"} />
        <KpiCard label="Test cases" value={testCases} />
        <KpiCard label="Recent runs" value={testRuns.length} />
        <KpiCard label="Releases tracked" value={releases.length} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Test runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {testRuns.length ? (
              testRuns.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm"
                >
                  <span>{r.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">{r.environment}</Badge>
                    <Badge variant="secondary">{r.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                No test runs seeded yet. Bugs and release QA status remain live.
              </p>
            )}
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Release QA gates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {releases.map((r) => (
              <div
                key={r.id}
                className="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm"
              >
                <div className="font-medium">{r.version}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">QA {r.qaStatus}</Badge>
                  <Badge variant="outline">Security {r.securityStatus}</Badge>
                  <Badge variant="outline">UAT {r.uatStatus}</Badge>
                </div>
              </div>
            ))}
            <Link href="/qa/bugs" className="inline-block text-sm font-semibold text-[var(--primary-pressed)] underline">
              Open bug list →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
