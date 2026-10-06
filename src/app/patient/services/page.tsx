"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { CvHeader } from "@/components/curevanta/ui";
import { services } from "@/lib/curevanta/demo";

const tabs = ["All", "Doctor", "Nursing", "Diagnostics"] as const;

export default function ServicesPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = useMemo(
    () => (tab === "All" ? services : services.filter((s) => s.category === tab)),
    [tab],
  );

  return (
    <div className="flex h-full flex-col">
      <CvHeader title="Services" backHref="/patient/home" />
      <div className="flex gap-2 overflow-x-auto px-1 pb-3 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold sm:text-sm ${
              tab === t
                ? "bg-[var(--primary)] text-white"
                : "bg-white text-[var(--text-secondary)] shadow-[var(--elevation-low)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-3 pb-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <Link
            key={s.id}
            href="/patient/finding"
            prefetch
            className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[var(--elevation-low)] transition hover:-translate-y-0.5"
          >
            <Image
              src={s.image}
              alt=""
              width={64}
              height={64}
              sizes="64px"
              className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[var(--text-primary)]">{s.title}</div>
              <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                {s.description}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
