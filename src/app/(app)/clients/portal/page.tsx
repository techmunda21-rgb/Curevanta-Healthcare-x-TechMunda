import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientPortalPage() {
  await requirePermission(PERMISSIONS.CLIENT_VIEW);
  const clients = await prisma.client.findMany({
    include: {
      contacts: true,
      project: {
        include: {
          milestones: { orderBy: { sortOrder: "asc" }, take: 3 },
          releases: { orderBy: { createdAt: "desc" }, take: 2 },
        },
      },
      feedback: { take: 3, orderBy: { createdAt: "desc" } },
      changeRequests: { take: 3, orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Client Portal"
        description="Stakeholder-safe progress view — no salaries, margins, or cap table."
      />
      {!clients.length ? (
        <EmptyState title="No clients" description="Seed includes a pilot partner record." />
      ) : (
        clients.map((c) => (
          <Card key={c.id} variant="elevated">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{c.company}</CardTitle>
                <p className="text-xs text-[var(--text-muted)]">
                  Project {c.project?.name ?? "—"} · Contacts {c.contacts.length}
                </p>
              </div>
              <Badge
                variant={
                  c.health === "GREEN" ? "success" : c.health === "AMBER" ? "warning" : "danger"
                }
              >
                Health {c.health}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 text-xs font-semibold text-[var(--text-muted)]">Progress</div>
                <Progress value={c.project?.completionPct ?? 0} />
              </div>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Milestones</div>
                  {c.project?.milestones.map((m) => (
                    <div key={m.id} className="py-1">
                      {m.title}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Releases</div>
                  {c.project?.releases.map((r) => (
                    <div key={r.id} className="py-1">
                      {r.version} · {formatDate(r.releaseDate)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Contacts</div>
                  {c.contacts.map((ct) => (
                    <div key={ct.id} className="py-1">
                      {ct.name} · {ct.role}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href="/clients/feedback" className="font-semibold text-[var(--primary-pressed)] underline">
                  Feedback
                </Link>
                <Link
                  href="/clients/change-requests"
                  className="font-semibold text-[var(--primary-pressed)] underline"
                >
                  Change requests
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
