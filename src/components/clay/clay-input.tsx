import { cn } from "@/lib/utils";

export function ClayInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-14 w-full rounded-2xl border-0 bg-[var(--clay-input-bg)] px-6 py-4 text-base text-[var(--clay-foreground)] shadow-clay-pressed transition-all duration-200 placeholder:text-[var(--clay-muted)] focus:bg-white focus:ring-4 focus:ring-[var(--clay-accent)]/20 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function ClayLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-bold tracking-wide text-[var(--clay-muted)]",
        className,
      )}
      style={{ fontFamily: "var(--font-clay), Nunito, sans-serif" }}
      {...props}
    />
  );
}
