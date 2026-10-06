import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <Card variant="metric" className="transition-ui hover:-translate-y-0.5 hover:shadow-[var(--elevation-medium)]">
      <CardContent className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          {label}
        </div>
        <div
          className={cn(
            "mt-2 font-display text-[28px] font-bold tracking-tight tabular-nums",
            tone === "success" && "text-[var(--success)]",
            tone === "warning" && "text-[var(--warning)]",
            tone === "danger" && "text-[var(--error)]",
            tone === "default" && "text-[var(--text-primary)]",
          )}
        >
          {value}
        </div>
        {hint ? <div className="mt-1 text-xs text-[var(--text-muted)]">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}
