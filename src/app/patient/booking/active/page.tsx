import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { CvHeader } from "@/components/curevanta/ui";
import { bookingDemo, doctorDemo } from "@/lib/curevanta/demo";

export default function ActiveBookingPage() {
  return (
    <div className="flex h-full flex-col bg-[#F7FAFA]">
      <CvHeader title="Active Booking" backHref="/patient/booking/tracking" />
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <ol className="relative ms-3 border-s-2 border-[var(--primary-soft)] ps-6">
          {bookingDemo.timeline.map((step) => (
            <li key={step.label} className="relative mb-6 last:mb-0">
              <span
                className={`absolute -start-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  step.done
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] bg-white"
                }`}
              >
                {step.done ? <span className="text-[10px]">✓</span> : null}
              </span>
              <div
                className={`text-sm font-bold ${
                  step.current ? "text-[var(--primary)]" : "text-[var(--text-primary)]"
                }`}
              >
                {step.label}
              </div>
              {step.time ? (
                <div className="text-xs text-[var(--text-muted)]">{step.time}</div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-[var(--border)] bg-white p-4">
        <Image
          src={doctorDemo.avatar}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-sm font-bold">{doctorDemo.name}</div>
          <div className="text-xs text-[var(--text-muted)]">{doctorDemo.specialty}</div>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]"
          aria-label="Call"
        >
          <Phone className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]"
          aria-label="Message"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
