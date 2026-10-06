import { requirePermission } from "@/lib/auth-guards";
import { PERMISSIONS } from "@/lib/rbac";
import { getFounderDashboard } from "@/server/dashboard";
import { ModuleHeader } from "@/components/module-header";
import { AICommandClient } from "./ai-command-client";

export const dynamic = "force-dynamic";

export default async function AIPage() {
  await requirePermission(PERMISSIONS.AI_USE);
  const dash = await getFounderDashboard();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="AI Command Center"
        description="Gemini-backed management copilot. Humans retain irreversible decisions."
      />
      <AICommandClient initialBrief={dash?.aiBrief ?? "Run seed data to generate brief."} />
    </div>
  );
}
