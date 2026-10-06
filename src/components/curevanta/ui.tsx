"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function CvHeader({
  title,
  backHref,
  right,
  className,
}: {
  title?: string;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center gap-2 px-4 pb-2 pt-4",
        className,
      )}
    >
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)]"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="flex-1 text-center text-base font-bold tracking-tight text-[var(--text-primary)]">
        {title}
      </h1>
      <div className="flex min-w-10 justify-end">{right}</div>
    </header>
  );
}

export function CvButton({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const styles = cn(
    "inline-flex h-12 w-full items-center justify-center rounded-full px-5 text-sm font-bold tracking-wide transition active:scale-[0.98]",
    variant === "primary" &&
      "bg-[var(--primary)] text-white shadow-[0_10px_24px_rgba(0,155,154,0.28)] hover:bg-[var(--primary-pressed)]",
    variant === "outline" &&
      "border-2 border-[var(--primary)] bg-white text-[var(--primary)]",
    variant === "ghost" && "bg-[var(--surface-muted)] text-[var(--text-primary)]",
    variant === "danger" && "border-2 border-red-400 bg-white text-red-600",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
