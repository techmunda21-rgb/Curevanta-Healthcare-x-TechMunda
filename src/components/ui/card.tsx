import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]",
  {
    variants: {
      variant: {
        standard: "shadow-[var(--elevation-low)]",
        elevated: "shadow-[var(--elevation-medium)]",
        interactive:
          "shadow-[var(--elevation-low)] transition-ui hover:-translate-y-0.5 hover:shadow-[var(--elevation-medium)]",
        status: "shadow-[var(--elevation-low)] bg-[var(--primary-soft)]/40",
        metric: "shadow-[var(--elevation-low)] overflow-hidden",
      },
    },
    defaultVariants: { variant: "standard" },
  },
);

export function Card({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-semibold tracking-tight text-[var(--text-primary)]", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-[var(--text-muted)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-2", className)} {...props} />;
}
