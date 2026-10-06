import Link from "next/link";
import { CvHeader } from "@/components/curevanta/ui";
import { services } from "@/lib/curevanta/demo";

export default function CarePage() {
  return (
    <div>
      <CvHeader title="Care" />
      <div className="space-y-3 px-4 pb-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Ongoing care plans and follow-ups for your family.
        </p>
        {services.slice(0, 3).map((s) => (
          <Link
            key={s.id}
            href="/patient/services"
            className="block rounded-2xl bg-white p-4 shadow-[var(--elevation-low)]"
          >
            <div className="font-bold text-[var(--text-primary)]">{s.title}</div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
