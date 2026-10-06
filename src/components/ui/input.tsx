import { cn } from "@/lib/utils";

export function Input({
  className,
  "aria-invalid": invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      aria-invalid={invalid}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--elevation-low)] transition-ui placeholder:text-[var(--text-muted)] focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-50",
        invalid &&
          "border-[var(--error)] focus-visible:border-[var(--error)] focus-visible:ring-[var(--error)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  "aria-invalid": invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      aria-invalid={invalid}
      className={cn(
        "flex min-h-[88px] w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--elevation-low)] transition-ui placeholder:text-[var(--text-muted)] focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--primary)]/20",
        invalid && "border-[var(--error)]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]",
        className,
      )}
      {...props}
    />
  );
}
