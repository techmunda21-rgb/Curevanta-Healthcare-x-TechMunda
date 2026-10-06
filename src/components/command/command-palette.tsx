"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { COMMAND_ITEMS } from "@/lib/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 p-4 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
      <Command
        className="mx-auto mt-[12vh] w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command.Input
          placeholder="Search commands…"
          className="h-12 w-full border-b border-[var(--border)] px-4 text-sm outline-none"
        />
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--muted)]">
            No results.
          </Command.Empty>
          {COMMAND_ITEMS.map((item) => (
            <Command.Item
              key={item.id}
              value={item.label}
              onSelect={() => {
                setOpen(false);
                router.push(item.href);
              }}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm aria-selected:bg-[var(--brand-soft)]"
            >
              <span>{item.label}</span>
              <kbd className="rounded border border-[var(--border)] px-1.5 text-[10px] text-[var(--muted)]">
                {item.shortcut}
              </kbd>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
