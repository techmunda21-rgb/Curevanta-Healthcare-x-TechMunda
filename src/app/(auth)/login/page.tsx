"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/curevanta/phone-shell";
import { CurevantaLogo } from "@/components/curevanta/logo";
import { CvButton } from "@/components/curevanta/ui";

const demos = [
  {
    label: "Patient",
    email: "patient.dev@techmunda.com",
    href: "/patient/home",
  },
  {
    label: "Doctor",
    email: "doctor.dev@techmunda.com",
    href: "/doctor",
  },
  {
    label: "Founder / Ops",
    email: "founder@techmunda.com",
    href: "/dashboard",
  },
];

function homeForEmail(email: string) {
  const e = email.toLowerCase();
  if (e.includes("patient")) return "/patient/home";
  if (e.includes("doctor")) return "/doctor";
  return "/dashboard";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("patient.dev@techmunda.com");
  const [password, setPassword] = useState("Founder@2026");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loginAs(nextEmail: string, fallbackHref: string) {
    setLoading(true);
    setError(null);
    setEmail(nextEmail);
    const res = await signIn("credentials", {
      email: nextEmail,
      password: "Founder@2026",
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials — run db seed if needed.");
      return;
    }
    router.push(params.get("callbackUrl") || fallbackHref);
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push(params.get("callbackUrl") || homeForEmail(email));
    router.refresh();
  }

  return (
    <AppFrame>
      <div className="flex h-full flex-col bg-white px-5 pb-8 pt-8 sm:px-8 md:justify-center">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <CurevantaLogo size={64} />
            <h1 className="mt-4 font-[family-name:var(--font-clay)] text-[clamp(1.75rem,4vw,2.25rem)] font-black text-[var(--text-primary)]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)] sm:text-base">
              Care. Closer to You. — sign in to continue
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {demos.map((d) => (
              <button
                key={d.label}
                type="button"
                disabled={loading}
                onClick={() => void loginAs(d.email, d.href)}
                className="rounded-2xl bg-[var(--primary-soft)] px-2 py-3 text-[11px] font-bold text-[var(--primary-pressed)] transition hover:bg-[var(--primary)] hover:text-white disabled:opacity-60 sm:text-xs"
              >
                {d.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block text-xs font-bold text-[var(--text-muted)]">
              Email
              <input
                className="mt-1 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block text-xs font-bold text-[var(--text-muted)]">
              Password
              <input
                className="mt-1 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? <p className="text-sm font-medium text-[var(--error)]">{error}</p> : null}
            <CvButton type="submit">{loading ? "Signing in…" : "Continue"}</CvButton>
          </form>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
            Demo password for all seed users: <strong>Founder@2026</strong>
          </p>
        </div>
      </div>
    </AppFrame>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-dvh items-center justify-center">Loading…</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
