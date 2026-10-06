import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--surface-muted)]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[var(--radius-pill)] bg-[var(--primary)] transition-[width] duration-[var(--motion-slow)] ease-[var(--ease-standard)]",
          indicatorClassName,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
