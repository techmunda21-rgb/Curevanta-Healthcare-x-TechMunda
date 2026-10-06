"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { CurevantaLogo } from "@/components/curevanta/logo";

const steps = [
  "Searching nearby providers",
  "Checking availability",
  "Matching your requirements",
  "Almost there…",
];

export default function FindingProviderPage() {
  const router = useRouter();
  const [done, setDone] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDone((d) => {
        if (d >= steps.length) return d;
        return d + 1;
      });
    }, 700);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done >= steps.length) {
      const t = setTimeout(() => router.push("/patient/doctor"), 600);
      return () => clearTimeout(t);
    }
  }, [done, router]);

  return (
    <div className="flex h-full flex-col items-center bg-white px-6 pb-10 pt-16 text-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--primary-soft)] opacity-40" />
        <span className="absolute inset-4 rounded-full border border-[var(--primary)]/20" />
        <span className="absolute inset-10 rounded-full border border-[var(--primary)]/30" />
        <span className="absolute inset-16 rounded-full border border-[var(--primary)]/40" />
        <CurevantaLogo size={64} className="relative z-10" />
        <span className="absolute left-4 top-10 h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[var(--primary-soft)] shadow" />
        <span className="absolute right-6 top-20 h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[var(--accent)]/40 shadow" />
        <span className="absolute bottom-10 left-10 h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[var(--primary)]/20 shadow" />
      </div>

      <h1 className="mt-6 text-xl font-bold text-[var(--text-primary)]">
        Finding the best available provider nearby
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Checking verified doctors in your area…
      </p>

      <ul className="mt-8 w-full space-y-3 text-left">
        {steps.map((label, idx) => {
          const complete = idx < done;
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  complete
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--border)] bg-white"
                }`}
              >
                {complete ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span className={complete ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
