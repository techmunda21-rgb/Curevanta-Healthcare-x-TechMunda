import Link from "next/link";
import { CvHeader } from "@/components/curevanta/ui";
import { bookingDemo, doctorDemo } from "@/lib/curevanta/demo";

export default function BookingsPage() {
  return (
    <div>
      <CvHeader title="Bookings" />
      <div className="space-y-3 px-4 pb-6">
        <Link
          href="/patient/booking/active"
          className="block rounded-2xl bg-white p-4 shadow-[var(--elevation-low)]"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Active
          </div>
          <div className="mt-1 font-bold text-[var(--text-primary)]">{doctorDemo.name}</div>
          <div className="text-xs text-[var(--text-secondary)]">
            {bookingDemo.dateLabel} · {bookingDemo.timeLabel}
          </div>
        </Link>
        <div className="rounded-2xl bg-white p-4 text-sm text-[var(--text-muted)] shadow-[var(--elevation-low)]">
          No past bookings yet.{" "}
          <Link href="/patient/services" className="font-bold text-[var(--primary)]">
            Book care
          </Link>
        </div>
      </div>
    </div>
  );
}
