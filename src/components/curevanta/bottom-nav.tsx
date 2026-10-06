"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, HeartPulse, Home, LifeBuoy, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export const PATIENT_NAV = [
  { href: "/patient/home", label: "Home", icon: Home },
  { href: "/patient/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/patient/care", label: "Care", icon: HeartPulse },
  { href: "/patient/support", label: "Support", icon: LifeBuoy },
  { href: "/patient/profile", label: "Profile", icon: UserRound },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "flex items-center gap-3 rounded-2xl font-semibold transition-colors",
        compact
          ? "flex-col gap-0.5 px-1 py-2 text-[10px]"
          : "px-3 py-2.5 text-sm",
        active
          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
      )}
    >
      <Icon className={cn(compact ? "h-5 w-5" : "h-5 w-5", active && "stroke-[2.4px]")} />
      {label}
    </Link>
  );
}

export function PatientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="cv-bottom-nav shrink-0 border-t border-[var(--border)] bg-white/95 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5 gap-0.5">
        {PATIENT_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <NavLink {...item} active={active} compact />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PatientSideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--border)] bg-white p-4 lg:flex">
      <div className="mb-6 px-2">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
          Curevanta
        </div>
        <div className="text-sm font-bold text-[var(--text-primary)]">Patient</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {PATIENT_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <NavLink key={item.href} {...item} active={active} />;
        })}
      </nav>
    </aside>
  );
}
