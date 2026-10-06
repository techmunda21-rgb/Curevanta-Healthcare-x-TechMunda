import { cn } from "@/lib/utils";

type LoadingStateProps = {
  className?: string;
  label?: string;
  rows?: number;
  variant?: "spinner" | "skeleton";
};

export function LoadingState({
  className,
  label = "Loading…",
  rows = 3,
  variant = "skeleton",
}: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}
        role="status"
        aria-live="polite"
      >
        <div
          className="size-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]"
          aria-hidden
        />
        <p className="text-sm text-[var(--muted)]">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-10 animate-pulse rounded-md bg-[var(--surface-muted)]"
          style={{ opacity: 1 - index * 0.12 }}
        />
      ))}
    </div>
  );
}
