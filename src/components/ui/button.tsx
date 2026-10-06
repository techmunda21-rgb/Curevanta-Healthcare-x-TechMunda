import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-ui focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--primary)]/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-sm)] bg-[var(--primary)] text-white shadow-[var(--elevation-low)] hover:bg-[var(--primary-pressed)]",
        secondary:
          "rounded-[var(--radius-sm)] bg-[var(--text-primary)] text-white hover:bg-[#1f2427]",
        outline:
          "rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]",
        ghost: "rounded-[var(--radius-sm)] text-[var(--text-primary)] hover:bg-[var(--primary-soft)]",
        danger:
          "rounded-[var(--radius-sm)] bg-[var(--error)] text-white hover:bg-[#a61f1f]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[var(--radius-xs)] px-3 text-xs",
        lg: "h-11 rounded-[var(--radius-md)] px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
