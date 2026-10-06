"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Code2,
  Wallet,
  Crown,
  Globe,
  Building2,
  FileText,
  Sparkles,
  BarChart3,
  Settings,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { NAVIGATION, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Code2,
  Wallet,
  Crown,
  Globe,
  Building2,
  FileText,
  Sparkles,
  BarChart3,
  Settings,
};

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;
  const childActive = item.children?.some((c) => c.href && pathname.startsWith(c.href));
  const [open, setOpen] = useState(Boolean(childActive));
  const Icon = item.icon ? ICONS[item.icon] : null;

  if (!hasChildren && item.href) {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50",
          active
            ? "bg-[var(--primary)] text-white shadow-[var(--elevation-low)]"
            : "text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white",
        )}
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-90" /> : null}
        {item.title}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-[var(--sidebar-text)] transition-ui hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50"
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-90" /> : null}
        <span className="flex-1 text-left">{item.title}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 opacity-70 transition-ui", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-2.5">
          {item.children?.map((child) => {
            const active = child.href
              ? pathname === child.href || pathname.startsWith(child.href + "/")
              : false;
            return (
              <Link
                key={child.href ?? child.title}
                href={child.href ?? "#"}
                className={cn(
                  "block rounded-[var(--radius-xs)] px-2.5 py-1.5 text-[13px] transition-ui",
                  active
                    ? "bg-white/12 font-medium text-white"
                    : "text-[#b7c2c2] hover:text-white",
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[264px] shrink-0 flex-col bg-[var(--sidebar)] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="text-[11px] font-bold tracking-[0.18em] text-[var(--accent)]">
          TECHMUNDA
        </div>
        <div className="mt-1 font-display text-xl font-bold leading-tight tracking-tight">
          Control Tower
        </div>
        <div className="mt-1 text-[11px] text-[#9aa6a6]">× Curevanta</div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAVIGATION.map((item) => (
          <NavGroup key={item.title} item={item} />
        ))}
      </nav>
      <div className="border-t border-white/10 px-4 py-3 text-[10px] leading-relaxed text-[#8a9696]">
        DEV SEED MODE · Not production records
      </div>
    </aside>
  );
}
