"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ClayBlobs } from "@/components/clay/clay-blobs";
import { ClayButton } from "@/components/clay/clay-button";
import { ClayCard } from "@/components/clay/clay-card";
import { ClayInput, ClayLabel } from "@/components/clay/clay-input";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("founder@techmunda.com");
  const [password, setPassword] = useState("Founder@2026");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push(params.get("callbackUrl") || "/dashboard");
    router.refresh();
  }

  return (
    <ClayCard interactive className="w-full max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="animate-clay-breathe flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#48D7D2] to-[#009B9A] text-lg font-black text-white shadow-clay-button">
          TM
        </div>
        <div>
          <div
            className="text-[11px] font-extrabold tracking-[0.22em] text-[var(--clay-accent)]"
            style={{ fontFamily: "var(--font-clay), Nunito, sans-serif" }}
          >
            TECHMUNDA × CUREVANTA
          </div>
          <p className="text-sm font-medium text-[var(--clay-muted)]">Project Control Tower</p>
        </div>
      </div>

      <h1
        className="clay-text-gradient text-4xl font-black tracking-tight sm:text-5xl"
        style={{ fontFamily: "var(--font-clay), Nunito, sans-serif", lineHeight: 1.1 }}
      >
        Enter the Tower
      </h1>
      <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-[var(--clay-muted)]">
        Founder execution OS — see health, blockers, burn, and decisions in under 30 seconds.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <ClayLabel htmlFor="email">Email</ClayLabel>
          <ClayInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-2">
          <ClayLabel htmlFor="password">Password</ClayLabel>
          <ClayInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error ? (
          <p className="rounded-2xl bg-[#FDF2F8] px-4 py-3 text-sm font-medium text-[var(--clay-accent-alt)] shadow-clay-pressed">
            {error}
          </p>
        ) : null}
        <ClayButton type="submit" className="w-full sm:w-auto sm:min-w-[220px]" disabled={loading}>
          {loading ? "Signing in…" : "Enter Control Tower"}
        </ClayButton>
      </form>

      <div className="mt-6 rounded-[24px] bg-gradient-to-br from-[#FEF3C7]/80 to-white/80 px-4 py-3 text-xs font-medium leading-relaxed text-[#92400E] shadow-clay-pressed">
        Demo seed login only: <strong>founder@techmunda.com</strong> /{" "}
        <strong>Founder@2026</strong> — not production credentials.
      </div>
    </ClayCard>
  );
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      <div className="animate-clay-float-slow absolute top-[18%] right-[8%] flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#48D7D2] to-[#009B9A] text-sm font-black text-white shadow-clay-button">
        AI
      </div>
      <div className="animate-clay-float-delayed animation-delay-2000 absolute bottom-[22%] right-[14%] flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#007A7A] to-[#30363A] text-xs font-black text-white shadow-clay-button">
        QA
      </div>
      <div className="animate-clay-float animation-delay-4000 absolute top-[42%] right-[22%] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-black text-white shadow-clay-button">
        OK
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="clay-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <ClayBlobs />
      <FloatingOrbs />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:block">
          <p
            className="text-sm font-extrabold tracking-[0.2em] text-[var(--clay-accent)]"
            style={{ fontFamily: "var(--font-clay), Nunito, sans-serif" }}
          >
            HIGH-FIDELITY OPS GATEWAY
          </p>
          <h2
            className="mt-4 max-w-xl text-5xl font-black tracking-tight text-[var(--clay-foreground)] xl:text-6xl"
            style={{ fontFamily: "var(--font-clay), Nunito, sans-serif", lineHeight: 1.1 }}
          >
            Soft on the outside.
            <span className="clay-text-gradient"> Sharp on execution.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-[var(--clay-muted)]">
            Sign in to the TechMunda × Curevanta Control Tower — December 2026 release visibility,
            founder approvals, and team pulse in one tactile command surface.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
            {[
              { label: "Project Health", value: "Live" },
              { label: "Release Gate", value: "Dec 2026" },
              { label: "Budget Basis", value: "₹30L" },
              { label: "AI CTO Brief", value: "Daily" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="animate-clay-breathe rounded-[24px] bg-white/60 p-4 shadow-clay-card backdrop-blur-xl"
              >
                <div className="text-xs font-bold tracking-wide text-[var(--clay-muted)]">
                  {stat.label}
                </div>
                <div
                  className="mt-1 text-2xl font-black text-[var(--clay-foreground)]"
                  style={{ fontFamily: "var(--font-clay), Nunito, sans-serif" }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-[40px] bg-white/50 shadow-clay-card" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
