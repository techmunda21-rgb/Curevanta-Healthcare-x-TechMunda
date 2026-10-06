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
    <div className="pb-6 pt-4 sm:pt-6 lg:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
          <MapPin className="h-4 w-4 shrink-0 text-[var(--primary)]" />
          <span className="truncate">{patientDemo.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[var(--elevation-low)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <Image
            src={patientDemo.avatar}
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
            priority
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <h1 className="text-[clamp(1.4rem,3.5vw,2rem)] font-bold tracking-tight text-[var(--text-primary)]">
            Good Morning, {patientDemo.name} 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)] sm:text-base">
            How can we help you today?
          </p>

          <label className="mt-4 flex h-12 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 shadow-[var(--elevation-low)] sm:h-14">
            <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Search doctors, services…"
            />
          </label>
        </div>

        <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(125deg,#009B9A_0%,#007A7A_55%,#0a6e6e_100%)] p-4 text-white shadow-[0_14px_30px_rgba(0,122,122,0.22)] sm:p-5">
          <div className="flex gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-snug sm:text-xl">
                Care, when and where you need it
              </p>
              <p className="mt-1 text-xs text-white/85 sm:text-sm">
                Verified providers · Live tracking
              </p>
              <Link
                href="/patient/services"
                prefetch
                className="mt-4 inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-bold text-[var(--primary)] sm:h-10 sm:text-sm"
              >
                Find Care
              </Link>
            </div>
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/15 sm:h-28 sm:w-28">
              <Image
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=240&h=240&fit=crop"
                alt=""
                fill
                sizes="(max-width:640px) 80px, 112px"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-end justify-between sm:mt-8">
        <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">Our Services</h2>
        <Link
          href="/patient/services"
          prefetch
          className="text-xs font-bold text-[var(--primary)] sm:text-sm"
        >
          See All
        </Link>
      </div>

      <div className="cv-grid-services mt-3">
        {services.map((s) => {
          const Icon = iconMap[s.icon as keyof typeof iconMap] ?? Stethoscope;
          return (
            <Link
              key={s.id}
              href="/patient/services"
              prefetch
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-[var(--elevation-low)] transition will-change-transform hover:-translate-y-0.5 sm:p-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold leading-tight text-[var(--text-primary)] sm:text-xs">
                {s.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
