import { CvHeader } from "@/components/curevanta/ui";

export default function SupportPage() {
  return (
    <div>
      <CvHeader title="Support" />
      <div className="space-y-3 px-4 pb-6">
        <div className="rounded-2xl bg-white p-4 shadow-[var(--elevation-low)]">
          <div className="font-bold text-[var(--text-primary)]">24×7 Care Desk</div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Call +91 1800-CUR-HELP or chat with our support team for booking help.
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--primary-soft)] p-4 text-sm text-[var(--primary-pressed)]">
          Emergency? Dial local emergency services first, then notify Curevanta support.
        </div>
      </div>
    </div>
  );
}
