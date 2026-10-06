import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { ModuleHeader } from "@/components/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  await requirePermission(PERMISSIONS.CLIENT_VIEW);
  const feedback = await prisma.clientFeedback.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHeader title="Client Feedback" description="Stakeholder feedback queue — live." />
      {!feedback.length ? (
        <EmptyState title="No feedback" description="Client comments will appear here." />
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <Card key={f.id} variant="elevated">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{f.subject}</CardTitle>
                  <p className="text-xs text-[var(--text-muted)]">
                    {f.client.company} · {formatDate(f.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {f.rating != null ? <Badge variant="secondary">★ {f.rating}</Badge> : null}
                  <Badge variant={f.status === "OPEN" ? "warning" : "success"}>{f.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-[var(--text-secondary)]">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
