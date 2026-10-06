"use client";

import { Bell, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LiveRefresh } from "@/components/live-refresh";

export function Topbar({ title }: { title?: string }) {
  const { data } = useSession();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 backdrop-blur-md md:px-6">
      <div>
        <div className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
          {title ?? "TechMunda Control Tower"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LiveRefresh />
        <button
          type="button"
          className="hidden h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--text-muted)] shadow-[var(--elevation-low)] transition-ui hover:border-[var(--primary)]/40 md:flex"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
            );
          }}
        >
          <Search className="h-3.5 w-3.5" />
          Search
          <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-2 py-1 shadow-[var(--elevation-low)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary-pressed)]">
            {(data?.user?.name ?? "F").slice(0, 1)}
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              {data?.user?.name ?? "Guest"}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">{data?.user?.role ?? "—"}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
            Out
          </Button>
        </div>
      </div>
    </header>
  );
}
