import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="font-display text-[22px] font-bold tracking-tight text-[var(--text-primary)] md:text-[28px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center shadow-[var(--elevation-low)]">
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "We couldn't load this view",
  description = "Your data is safe. Try again, or contact support if this continues.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center shadow-[var(--elevation-low)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[var(--error)]">
        !
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      {onRetry ? (
        <Button className="mt-5" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function SeedBanner() {
  return (
    <div className="seed-banner mb-4 px-4 py-2.5 text-xs font-medium">
      Development seed data — labeled demo records only. Not real TechMunda / Curevanta company data.
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-sm text-[var(--text-muted)]">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      {label}
    </div>
  );
}
