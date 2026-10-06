import { SeedBanner } from "@/components/empty-state";
import { PageHeader } from "@/components/empty-state";

export function ModuleHeader({
  title,
  description,
  actions,
  showSeed = true,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showSeed?: boolean;
}) {
  return (
    <div className="space-y-3">
      {showSeed ? <SeedBanner /> : null}
      <PageHeader title={title} description={description} actions={actions} />
    </div>
  );
}
