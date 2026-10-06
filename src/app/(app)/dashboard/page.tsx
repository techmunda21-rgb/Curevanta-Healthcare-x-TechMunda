import Link from "next/link";
import { getFounderDashboard } from "@/server/dashboard";
import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { KpiCard } from "@/components/kpi-card";
import { EmptyState, SeedBanner } from "@/components/empty-state";
import { HealthBadge, PriorityBadge, TaskStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const data = await getFounderDashboard();

  if (!data) {
    return (
      <EmptyState
        title="No primary project"
        description="Run database seed to load Curevanta demo data."
        action={
          <Link href="/settings">
            <Button>Open settings</Button>
          </Link>
        }
      />
    );
  }

  const { kpis, project, health, workstreams, teamActivity, finance, founderActions, aiBrief } =
    data;

  const primaryKpis = [
    { label: "Open", value: kpis.openTasks },
    { label: "In Progress", value: kpis.inProgress },
    {
      label: "Blocked",
      value: kpis.blocked,
      tone: kpis.blocked ? ("danger" as const) : ("default" as const),
    },
    {
      label: "Overdue",
      value: kpis.overdue,
      tone: kpis.overdue ? ("danger" as const) : ("default" as const),
    },
    { label: "Completed", value: kpis.completed, tone: "success" as const },
    { label: "Completion", value: `${kpis.projectCompletionPct}%` },
    { label: "Utilization", value: `${kpis.teamUtilizationPct}%` },
    {
      label: "Budget left",
      value: formatINR(kpis.budgetRemainingInr),
      tone: "success" as const,
    },
    { label: "Month burn", value: formatINR(kpis.currentMonthBurn) },
    { label: "Release", value: `${kpis.releaseHealth}/100` },
  ];

  return (
    <div className="space-y-8">
      {project.isSeedData ? <SeedBanner /> : null}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--elevation-medium)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 320px at 0% 0%, rgba(72,215,210,0.16), transparent), linear-gradient(120deg, #ffffff 0%, #f3faf9 55%, #eaf6f6 100%)",
          }}
        />
        <div className="relative px-6 py-8 md:px-8 md:py-9">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            TechMunda Control Tower
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--text-secondary)]">{data.greeting}</p>
              <h1 className="mt-1 font-display text-[36px] font-bold tracking-tight text-[var(--text-primary)] md:text-[44px]">
                {project.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Production MVP target December 2026. Open one dashboard and know completion,
                blockers, burn, and founder decisions in under 30 seconds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <HealthBadge status={health.status} />
              <Badge variant="default">Health {health.score}/100</Badge>
              <Badge variant="secondary">
                Release in {project.daysToRelease ?? "—"} days
              </Badge>
              <Badge
                variant={
                  data.signal === "RED" ? "danger" : data.signal === "AMBER" ? "warning" : "success"
                }
              >
                Signal {data.signal}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Primary KPI strip */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Execution pulse</h2>
          <span className="text-xs text-[var(--text-muted)]">
            Velocity {kpis.sprintVelocity} · Total tasks {kpis.totalTasks}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {primaryKpis.map((k) => (
            <KpiCard key={k.label} label={k.label} value={k.value} tone={k.tone ?? "default"} />
          ))}
        </div>
      </section>

      {/* Action center + health */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Founder action center</CardTitle>
            <CardDescription>Approvals, blockers, and alerts requiring attention today.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-muted)]/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Approvals
                </span>
                <Badge variant="warning">{founderActions.approvals.length}</Badge>
              </div>
              <div className="space-y-2">
                {founderActions.approvals.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  >
                    {a.title}
                  </div>
                ))}
                {!founderActions.approvals.length ? (
                  <p className="text-sm text-[var(--text-muted)]">No pending approvals.</p>
                ) : null}
              </div>
              <Link
                href="/founder/approvals"
                className="mt-3 inline-block text-sm font-semibold text-[var(--primary-pressed)] hover:underline"
              >
                Review queue →
              </Link>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-muted)]/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Top blockers
                </span>
                <Badge variant="danger">{founderActions.blockers.length}</Badge>
              </div>
              <div className="space-y-2">
                {founderActions.blockers.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  >
                    <PriorityBadge priority={b.priority} />
                    <span className="ml-2 text-[var(--text-primary)]">{b.reason}</span>
                  </div>
                ))}
                {!founderActions.blockers.length ? (
                  <p className="text-sm text-[var(--text-muted)]">No open blockers.</p>
                ) : null}
              </div>
              <Link
                href="/blockers"
                className="mt-3 inline-block text-sm font-semibold text-[var(--primary-pressed)] hover:underline"
              >
                Open blockers →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Project health</CardTitle>
            <CardDescription>Composite score from schedule, P0, QA, budget, capacity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div className="font-display text-5xl font-bold tabular-nums text-[var(--text-primary)]">
                {health.score}
              </div>
              <HealthBadge status={health.status} />
            </div>
            <Progress value={health.score} />
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(health.components).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-2 rounded-[var(--radius-xs)] bg-[var(--surface-muted)] px-2.5 py-2 text-xs"
                >
                  <span className="capitalize text-[var(--text-muted)]">
                    {k.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-semibold tabular-nums text-[var(--text-primary)]">{v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Team activity */}
      <section>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Today — team activity</CardTitle>
            <CardDescription>Who is working on what, and who is idle or blocked.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-3 pr-3 font-semibold">Employee</th>
                  <th className="pb-3 pr-3 font-semibold">Current task</th>
                  <th className="pb-3 pr-3 font-semibold">Priority</th>
                  <th className="pb-3 pr-3 font-semibold">Status</th>
                  <th className="pb-3 pr-3 font-semibold">Hours</th>
                  <th className="pb-3 pr-3 font-semibold">Due</th>
                  <th className="pb-3 font-semibold">Blocker</th>
                </tr>
              </thead>
              <tbody>
                {teamActivity.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--border)]/70 transition-ui hover:bg-[var(--surface-muted)]/60"
                  >
                    <td className="py-3.5 pr-3">
                      <div className="font-medium text-[var(--text-primary)]">{row.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{row.title}</div>
                    </td>
                    <td className="py-3.5 pr-3">
                      {row.currentTask?.title ?? (
                        <span className="font-medium text-[var(--warning)]">No assigned task</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-3">
                      {row.currentTask ? (
                        <PriorityBadge priority={row.currentTask.priority} />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3.5 pr-3">
                      {row.currentTask ? (
                        <TaskStatusBadge status={row.currentTask.status} />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3.5 pr-3 tabular-nums">
                      {row.currentTask?.estimatedHours ?? "—"}
                    </td>
                    <td className="py-3.5 pr-3">{formatDate(row.currentTask?.dueDate)}</td>
                    <td className="py-3.5">
                      {row.currentTask?.hasBlocker ? (
                        <Badge variant="danger">Yes</Badge>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Workstreams */}
      <section>
        <div className="mb-3">
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Workstream progress
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Curevanta delivery lanes — patient, doctor, backend, dispatch, QA, and more.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {workstreams.map((w) => (
            <Card key={w.id} variant="interactive">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-[var(--text-primary)]">{w.name}</div>
                  <Badge
                    variant={
                      w.riskLevel === "HIGH"
                        ? "danger"
                        : w.riskLevel === "MEDIUM"
                          ? "warning"
                          : "success"
                    }
                  >
                    {w.riskLevel}
                  </Badge>
                </div>
                <Progress value={w.progressPct} />
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="text-[var(--text-muted)]">Tasks</div>
                    <div className="font-semibold tabular-nums">{w.tasks}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)]">Done</div>
                    <div className="font-semibold tabular-nums">{w.completed}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)]">Active</div>
                    <div className="font-semibold tabular-nums">{w.inProgress}</div>
                  </div>
                  <div>
                    <div className="text-[var(--text-muted)]">Blocked</div>
                    <div className="font-semibold tabular-nums text-[var(--error)]">{w.blocked}</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>
                    {w.actualHours}h / {w.estimatedHours}h
                  </span>
                  <span>{formatINR(w.costInr)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Finance + AI */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Finance — ₹30L development budget</CardTitle>
            <CardDescription>Contribution basis — not automatic equity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-muted)] p-3">
                <div className="text-xs text-[var(--text-muted)]">Used</div>
                <div className="mt-1 text-xl font-bold tabular-nums">{formatINR(finance.spent)}</div>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-muted)] p-3">
                <div className="text-xs text-[var(--text-muted)]">Committed</div>
                <div className="mt-1 text-xl font-bold tabular-nums">
                  {formatINR(finance.committed)}
                </div>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-[var(--primary-soft)] p-3">
                <div className="text-xs text-[var(--text-muted)]">Remaining</div>
                <div className="mt-1 text-xl font-bold tabular-nums text-[var(--success)]">
                  {formatINR(finance.remaining)}
                </div>
              </div>
              <div className="rounded-[var(--radius-sm)] bg-[var(--surface-muted)] p-3">
                <div className="text-xs text-[var(--text-muted)]">Used %</div>
                <div className="mt-1 text-xl font-bold tabular-nums">{finance.usedPct}%</div>
              </div>
            </div>
            <Progress value={finance.usedPct} />
            <Link href="/finance/budget">
              <Button variant="outline" size="sm">
                Open budget detail
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>AI CTO brief</CardTitle>
            <CardDescription>Morning summary — proposals only, no irreversible actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-[var(--radius-md)] bg-[var(--sidebar)] p-4 text-xs leading-relaxed text-[#e8eeee] shadow-[var(--elevation-low)]">
              {aiBrief}
            </pre>
            <Link href="/ai" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                Open AI Command Center
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
