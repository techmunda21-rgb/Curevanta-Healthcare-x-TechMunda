import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { KpiCard } from "@/components/kpi-card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const [users, teams, audit, project, notifications] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.team.count(),
    prisma.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.project.findFirst({ where: { isPrimary: true } }),
    prisma.notification.count({ where: { read: false } }),
  ]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Settings"
        description="Org configuration, users, and live stream health."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Users" value={users.length} />
        <KpiCard label="Teams" value={teams} />
        <KpiCard label="Unread alerts" value={notifications} />
        <KpiCard label="Primary project" value={project?.code ?? "—"} />
      </div>

      <Card variant="status">
        <CardContent className="space-y-1 p-4 text-sm">
          <div>
            Signed in as <strong>{session.user.name}</strong> ({session.user.role})
          </div>
          <div className="text-[var(--text-muted)]">
            Live stream endpoint: <code className="text-xs">/api/live/stream</code> · modules
            auto-refresh via SSE + soft revalidation.
          </div>
          <div className="text-[var(--text-muted)]">
            Database: PostgreSQL via Prisma · Primary: {project?.name ?? "—"}
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Users & roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] py-2 text-sm"
            >
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-[var(--text-muted)]">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{u.role}</Badge>
                <Badge variant={u.isActive ? "success" : "danger"}>
                  {u.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent audit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {audit.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] py-2"
            >
              <div>
                <span className="font-medium">{a.action}</span>{" "}
                <span className="text-[var(--text-muted)]">
                  {a.entity}
                  {a.entityId ? ` · ${a.entityId.slice(0, 8)}` : ""}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {a.actor?.name ?? "system"} · {formatDate(a.createdAt)}
              </div>
            </div>
          ))}
          {!audit.length ? (
            <p className="text-[var(--text-muted)]">No audit events yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
