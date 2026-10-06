import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const clayButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--clay-accent)]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.92] active:shadow-clay-pressed",
  {
    variants: {
      variant: {
        default:
          "rounded-[20px] bg-gradient-to-br from-[#48D7D2] to-[#009B9A] text-white shadow-clay-button hover:-translate-y-1 hover:shadow-clay-button-hover",
        secondary:
          "rounded-[20px] bg-white text-[var(--clay-foreground)] shadow-clay-button hover:-translate-y-1 hover:shadow-clay-button-hover",
        outline:
          "rounded-[20px] border-2 border-[var(--clay-accent)]/20 bg-transparent text-[var(--clay-accent)] hover:border-[var(--clay-accent)] hover:bg-[var(--clay-accent)]/5",
        ghost:
          "rounded-[20px] text-[var(--clay-foreground)] hover:bg-[var(--clay-accent)]/10 hover:text-[var(--clay-accent)]",
      },
      size: {
        sm: "h-11 px-5 text-sm",
        default: "h-14 px-6 text-base",
        lg: "h-16 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ClayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof clayButtonVariants> {}

export const ClayButton = React.forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(clayButtonVariants({ variant, size }), className)}
      style={{ fontFamily: "var(--font-clay), Nunito, sans-serif" }}
      {...props}
    />
  ),
);
ClayButton.displayName = "ClayButton";
