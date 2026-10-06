import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, LifeBuoy } from "lucide-react";
import { doctorDemo } from "@/lib/curevanta/demo";

export default function TrackingPage() {
  return (
    <div className="relative flex h-full flex-col bg-[#e8f0ef]">
      <div className="z-10 bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white">
        Doctor is on the way · Arriving in {doctorDemo.etaMin} minutes
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#dceceb_0%,#c5ddd9_100%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 500" preserveAspectRatio="none">
          <path
            d="M70 420 C120 300, 180 260, 230 200 S320 90, 310 60"
            fill="none"
            stroke="#009B9A"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="2 10"
          />
          <circle cx="70" cy="420" r="14" fill="#009B9A" />
          <circle cx="310" cy="60" r="12" fill="#30363A" />
        </svg>
        <div className="absolute left-[14%] top-[78%] rounded-full bg-white px-2 py-1 text-[10px] font-bold shadow">
          You
        </div>
        <div className="absolute right-[16%] top-[8%] rounded-full bg-[var(--primary)] px-2 py-1 text-[10px] font-bold text-white shadow">
          Doctor
        </div>
      </div>

      <div className="z-10 space-y-3 rounded-t-[28px] bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <Link href="/patient/booking/active" className="flex items-center gap-3">
          <Image
            src={doctorDemo.avatar}
            alt=""
            width={52}
            height={52}
            className="h-13 w-13 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="font-bold text-[var(--text-primary)]">{doctorDemo.name}</div>
            <div className="text-xs text-[var(--text-secondary)]">
              ★ {doctorDemo.rating} · {doctorDemo.specialty}
            </div>
            <div className="mt-1 text-xs font-bold text-emerald-600">On the way</div>
          </div>
        </Link>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Phone, label: "Call" },
            { icon: MessageCircle, label: "Message" },
            { icon: LifeBuoy, label: "Support" },
          ].map((a) => (
            <button
              key={a.label}
              type="button"
              className="flex flex-col items-center gap-1 rounded-2xl bg-[var(--surface-muted)] py-3 text-xs font-bold text-[var(--text-primary)]"
            >
              <a.icon className="h-5 w-5 text-[var(--primary)]" />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
