import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Bell,
  ClipboardPlus,
  FlaskConical,
  HeartPulse,
  MapPin,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";
import { patientDemo, services } from "@/lib/curevanta/demo";

/** Icons + layout match Curevanta Healthcare App Showcase */
const iconMap = {
  Stethoscope,
  HeartPulse,
  FlaskConical,
  Activity,
  Users,
  ClipboardPlus,
} as const;

export default function PatientHomePage() {
  return (
    <div className="pb-8 pt-3 sm:pt-5">
      {/* Location + actions — showcase header */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="flex min-w-0 items-center gap-1.5 text-left text-sm font-semibold text-[var(--text-primary)]"
        >
          <MapPin className="h-4 w-4 shrink-0 text-[var(--primary)]" />
          <span className="truncate">{patientDemo.location}</span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(48,54,58,0.08)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-[var(--text-primary)]" />
          </button>
          <Link href="/patient/profile" prefetch aria-label="Profile">
            <Image
              src={patientDemo.avatar}
              alt=""
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              priority
            />
          </Link>
        </div>
      </div>

      <h1 className="mt-5 text-[1.5rem] font-bold tracking-tight text-[var(--text-primary)] sm:text-[1.75rem]">
        Good Morning, {patientDemo.name} 👋
      </h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">How can we help you today?</p>

      <label className="mt-4 flex h-12 items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 shadow-[0_1px_3px_rgba(48,54,58,0.06)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
          placeholder="Search for services, doctors..."
          aria-label="Search for services, doctors"
        />
      </label>

      {/* Hero promo — teal card + Find Care */}
      <section className="mt-5 overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,#009B9A_0%,#007A7A_100%)] p-4 text-white shadow-[0_12px_28px_rgba(0,122,122,0.22)] sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-snug sm:text-xl">
              Care when you need it, at home
            </p>
            <p className="mt-1 text-xs text-white/85 sm:text-sm">
              Verified doctors · Live tracking
            </p>
            <Link
              href="/patient/services"
              prefetch
              className="mt-4 inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-bold text-[var(--primary)] sm:h-10 sm:text-sm"
            >
              Find Care
            </Link>
          </div>
          <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-white/15 sm:h-28 sm:w-28">
            <Image
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=240&h=240&fit=crop"
              alt=""
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-end justify-between">
        <h2 className="text-base font-bold text-[var(--text-primary)]">Our Services</h2>
        <Link
          href="/patient/services"
          prefetch
          className="text-xs font-bold text-[var(--primary)] sm:text-sm"
        >
          See All
        </Link>
      </div>

      {/* 2×3 circular service grid — showcase */}
      <div className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
        {services.map((s) => {
          const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Stethoscope;
          return (
            <Link
              key={s.id}
              href="/patient/services"
              prefetch
              className="flex flex-col items-center gap-2 rounded-2xl bg-white px-2 py-3 text-center shadow-[0_1px_3px_rgba(48,54,58,0.06)] transition active:scale-[0.98] sm:py-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F5F5] text-[var(--primary)] sm:h-14 sm:w-14">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
              </span>
              <span className="text-[10px] font-semibold leading-tight text-[var(--text-primary)] sm:text-xs">
                {s.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
