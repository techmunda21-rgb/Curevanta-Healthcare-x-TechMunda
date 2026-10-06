import Link from "next/link";
import { CurevantaLogo } from "@/components/curevanta/logo";
import { brand } from "@/lib/curevanta/demo";

export default function SplashPage() {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,#d9f3f3,transparent_70%)] md:h-64" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center sm:px-10">
        <CurevantaLogo
          size={88}
          className="animate-[cv-pop_0.55s_var(--ease-standard)] md:!h-24 md:!w-24"
        />
        <h1 className="mt-6 font-[family-name:var(--font-clay)] text-[clamp(2rem,5vw,3rem)] font-black tracking-tight text-[var(--text-primary)]">
          {brand.name}
        </h1>
        <p className="mt-2 text-base font-semibold text-[var(--primary)] sm:text-lg md:text-xl">
          {brand.tagline}
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-md px-6 pb-10 pt-6 text-center md:max-w-lg md:pb-12">
        <p className="mb-6 text-sm font-medium text-[var(--text-secondary)] sm:text-base">
          {brand.subline}
        </p>
        <Link
          href="/onboarding"
          prefetch
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,155,154,0.28)] sm:h-14"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          prefetch
          className="mt-3 block text-sm font-semibold text-[var(--primary)]"
        >
          I already have an account
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,#b8e8e6_0%,transparent_70%)] opacity-70" />
      </div>
    </div>
  );
}
