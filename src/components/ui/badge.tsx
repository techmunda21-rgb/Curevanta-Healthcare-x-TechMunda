import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-xs)] px-2 py-0.5 text-[11px] font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-soft)] text-[var(--primary-pressed)]",
        secondary: "bg-[var(--surface-muted)] text-[var(--text-primary)]",
        success: "bg-emerald-50 text-[var(--success)]",
        warning: "bg-amber-50 text-[var(--warning)]",
        danger: "bg-red-50 text-[var(--error)]",
        outline: "border border-[var(--border)] text-[var(--text-primary)]",
        p0: "bg-red-100 text-red-800",
        p1: "bg-orange-100 text-orange-800",
        p2: "bg-sky-100 text-sky-800",
        p3: "bg-slate-100 text-slate-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
