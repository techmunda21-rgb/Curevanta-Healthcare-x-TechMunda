import { CalendarPlus, Check, Clock3, MapPin } from "lucide-react";
import { CvButton } from "@/components/curevanta/ui";
import { bookingDemo, doctorDemo } from "@/lib/curevanta/demo";

export default function BookingConfirmedPage() {
  return (
    <div className="flex h-full flex-col bg-white px-5 pb-8 pt-10 text-center">
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <span className="absolute h-3 w-3 rounded-full bg-[var(--accent)] left-0 top-4" />
        <span className="absolute h-2 w-2 rounded-full bg-[var(--primary)] right-2 top-8" />
        <span className="absolute h-2.5 w-2.5 rounded-full bg-[var(--primary-soft)] bottom-2 left-4" />
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_14px_32px_rgba(0,155,154,0.35)]">
          <Check className="h-12 w-12" strokeWidth={2.5} />
        </span>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">Booking Confirmed!</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {doctorDemo.name} will be at your location shortly.
      </p>

      <div className="mt-8 space-y-3 rounded-2xl bg-[var(--surface-muted)] p-4 text-left text-sm">
        <div className="flex gap-3">
          <Clock3 className="mt-0.5 h-4 w-4 text-[var(--primary)]" />
          <div>
            <div className="font-bold text-[var(--text-primary)]">{bookingDemo.dateLabel}</div>
            <div className="text-[var(--text-secondary)]">{bookingDemo.timeLabel}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-[var(--primary)]" />
          <div className="text-[var(--text-secondary)]">{bookingDemo.address}</div>
        </div>
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <CvButton href="/patient/booking/tracking">View Booking</CvButton>
        <CvButton href="/patient/booking/active" variant="outline">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to Calendar
        </CvButton>
      </div>
    </div>
  );
}
