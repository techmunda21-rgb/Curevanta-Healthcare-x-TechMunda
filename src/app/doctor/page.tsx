"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppFrame } from "@/components/curevanta/phone-shell";
import { CvButton } from "@/components/curevanta/ui";
import { doctorAppDemo, doctorDemo } from "@/lib/curevanta/demo";

export default function DoctorHomePage() {
  const [online, setOnline] = useState(true);
  const [showRequest, setShowRequest] = useState(true);
  const [countdown, setCountdown] = useState(doctorAppDemo.incoming.countdownSec);

  return (
    <AppFrame wide>
      <div className="cv-scroll h-full overflow-y-auto bg-[#F7FAFA] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={doctorDemo.avatar}
                alt=""
                width={48}
                height={48}
                sizes="48px"
                className="h-12 w-12 rounded-full object-cover"
                priority
              />
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                  {doctorAppDemo.name}
                </div>
                <div className="text-xs text-[var(--text-muted)]">Doctor App</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOnline((v) => !v)}
              className={`relative h-8 w-14 rounded-full transition ${
                online ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
              aria-label="Toggle online"
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  online ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
          <div className="mt-1 text-xs font-bold text-[var(--primary)]">
            {online ? "Online" : "Offline"}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-[22px] bg-[linear-gradient(135deg,#009B9A,#007A7A)] p-4 text-white shadow-[0_12px_28px_rgba(0,122,122,0.25)] sm:p-5">
              <div className="text-xs font-semibold text-white/80">Today&apos;s Earnings</div>
              <div className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                ₹{doctorAppDemo.earningsToday.toLocaleString("en-IN")}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-white/15 py-2">
                  <div className="text-lg font-bold">{doctorAppDemo.completed}</div>
                  Completed
                </div>
                <div className="rounded-xl bg-white/15 py-2">
                  <div className="text-lg font-bold">{doctorAppDemo.upcoming}</div>
                  Upcoming
                </div>
              </div>
            </section>

            {showRequest && online ? (
              <section className="rounded-2xl border border-[var(--primary)]/30 bg-white p-4 shadow-[var(--elevation-medium)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                      Incoming request
                    </div>
                    <div className="mt-1 font-bold text-[var(--text-primary)]">
                      {doctorAppDemo.incoming.service}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] sm:text-sm">
                      {doctorAppDemo.incoming.patient} · {doctorAppDemo.incoming.location}
                    </div>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-black text-amber-700">
                    {countdown}s
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <CvButton variant="danger" onClick={() => setShowRequest(false)}>
                    Decline
                  </CvButton>
                  <CvButton
                    onClick={() => {
                      setShowRequest(false);
                      setCountdown(0);
                    }}
                  >
                    Accept
                  </CvButton>
                </div>
              </section>
            ) : (
              <section className="hidden rounded-2xl bg-white p-5 text-sm text-[var(--text-muted)] shadow-[var(--elevation-low)] lg:block">
                Waiting for nearby patient requests…
              </section>
            )}
          </div>

          <h2 className="mt-6 text-sm font-bold text-[var(--text-primary)] sm:text-base">
            Today&apos;s Bookings
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {doctorAppDemo.todayBookings.map((b) => (
              <div
                key={b.patient}
                className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 shadow-[var(--elevation-low)]"
              >
                <div>
                  <div className="text-sm font-bold">{b.patient}</div>
                  <div className="text-xs text-[var(--text-muted)]">{b.time}</div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    b.status === "On the way"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/patient/home"
            prefetch
            className="mt-6 block text-center text-xs font-bold text-[var(--primary)] sm:text-sm"
          >
            ← Patient App
          </Link>
        </div>
      </div>
    </AppFrame>
  );
}
