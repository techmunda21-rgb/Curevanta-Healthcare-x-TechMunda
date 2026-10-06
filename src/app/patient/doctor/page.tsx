import Image from "next/image";
import { Clock3, IndianRupee, Languages, Share2, Star } from "lucide-react";
import { CvButton, CvHeader } from "@/components/curevanta/ui";
import { doctorDemo } from "@/lib/curevanta/demo";

export default function DoctorProfilePage() {
  return (
    <div className="flex h-full flex-col bg-white">
      <CvHeader
        title="Doctor"
        backHref="/patient/services"
        right={
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)]"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-28">
        <div className="relative mx-auto h-44 w-full overflow-hidden rounded-[22px]">
          <Image src={doctorDemo.avatar} alt="" fill className="object-cover object-top" />
          <span className="absolute bottom-3 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
            ✓ Verified
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">{doctorDemo.name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {doctorDemo.rating}
          </span>
          <span>· {doctorDemo.specialty}</span>
          <span>· {doctorDemo.experience}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: Clock3, label: `${doctorDemo.etaMin} min`, sub: "ETA" },
            { icon: IndianRupee, label: `₹${doctorDemo.feeInr}`, sub: "Fee" },
            { icon: Star, label: `${doctorDemo.rating}`, sub: "Rating" },
          ].map((s) => (
            <div
              key={s.sub}
              className="rounded-2xl bg-[var(--primary-soft)] px-2 py-3 text-center"
            >
              <s.icon className="mx-auto h-4 w-4 text-[var(--primary)]" />
              <div className="mt-1 text-sm font-bold text-[var(--text-primary)]">{s.label}</div>
              <div className="text-[10px] text-[var(--text-muted)]">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Languages className="h-4 w-4 text-[var(--primary)]" />
          {doctorDemo.languages}
        </div>

        <h2 className="mt-5 text-sm font-bold text-[var(--text-primary)]">About</h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{doctorDemo.about}</p>

        <h2 className="mt-5 text-sm font-bold text-[var(--text-primary)]">Services</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {doctorDemo.services.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-[var(--border)] bg-white/95 p-4 backdrop-blur">
        <CvButton href="/patient/payment">Book Now</CvButton>
      </div>
    </div>
  );
}
