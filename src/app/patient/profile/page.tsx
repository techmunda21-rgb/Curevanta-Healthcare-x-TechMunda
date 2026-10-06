import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileHeart,
  HelpCircle,
  MapPinned,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { patientDemo } from "@/lib/curevanta/demo";

const rows = [
  { icon: UserRound, label: "Personal Information" },
  { icon: MapPinned, label: "Manage Addresses" },
  { icon: Users, label: "Saved Family Members" },
  { icon: FileHeart, label: "Health Records" },
  { icon: CreditCard, label: "Payment Methods" },
  { icon: Bell, label: "Notifications" },
  { icon: HelpCircle, label: "Help & Support", href: "/patient/support" },
  { icon: Settings, label: "Settings" },
];

export default function PatientProfilePage() {
  return (
    <div className="px-4 pb-8 pt-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Image
            src={patientDemo.avatar}
            alt=""
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-[var(--primary-soft)]"
          />
          <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
            ✎
          </span>
        </div>
        <h1 className="mt-3 text-xl font-bold text-[var(--text-primary)]">{patientDemo.fullName}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{patientDemo.phone}</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[var(--elevation-low)]">
        {rows.map((row) => {
          const Icon = row.icon;
          const inner = (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 text-sm font-semibold text-[var(--text-primary)]">
                {row.label}
              </span>
              <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
            </>
          );
          return row.href ? (
            <Link
              key={row.label}
              href={row.href}
              className="flex items-center gap-3 border-b border-[var(--border)] px-3 py-3 last:border-0"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={row.label}
              className="flex items-center gap-3 border-b border-[var(--border)] px-3 py-3 last:border-0"
            >
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 text-center text-xs">
        <Link href="/doctor" className="block font-bold text-[var(--primary)]">
          Open Doctor App →
        </Link>
        <Link href="/dashboard" className="block font-semibold text-[var(--text-muted)]">
          Control Tower (Ops)
        </Link>
      </div>
    </div>
  );
}
