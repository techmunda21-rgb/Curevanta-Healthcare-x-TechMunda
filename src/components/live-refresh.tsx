"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Live stream: SSE snapshot channel + soft RSC refresh fallback */
export function LiveRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [mode, setMode] = useState<"connecting" | "sse" | "poll">("connecting");

  useEffect(() => {
    let es: EventSource | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const startPoll = () => {
      if (cancelled) return;
      setMode("poll");
      pollId = setInterval(() => router.refresh(), intervalMs);
    };

    try {
      es = new EventSource("/api/live/stream");

      es.addEventListener("connected", () => {
        if (!cancelled) setMode("sse");
      });

      es.addEventListener("snapshot", () => {
        if (!cancelled) router.refresh();
      });

      es.onerror = () => {
        es?.close();
        es = null;
        if (!cancelled) startPoll();
      };
    } catch {
      startPoll();
    }

    // Safety poll even when SSE is healthy (covers non-snapshot mutations)
    const safetyId = setInterval(() => router.refresh(), Math.max(intervalMs * 2, 30000));

    return () => {
      cancelled = true;
      es?.close();
      if (pollId) clearInterval(pollId);
      clearInterval(safetyId);
    };
  }, [router, intervalMs]);

  return (
    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
      </span>
      Live{mode === "sse" ? " · stream" : mode === "poll" ? " · poll" : ""}
    </div>
  );
}
