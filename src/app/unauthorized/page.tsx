import Link from "next/link";
import { ClayBlobs } from "@/components/clay/clay-blobs";
import { ClayButton } from "@/components/clay/clay-button";
import { ClayCard } from "@/components/clay/clay-card";

export default function UnauthorizedPage() {
  return (
    <div className="clay-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <ClayBlobs />
      <ClayCard className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xl font-black text-white shadow-clay-button">
          !
        </div>
        <h1
          className="mt-5 text-3xl font-black tracking-tight text-[var(--clay-foreground)]"
          style={{ fontFamily: "var(--font-clay), Nunito, sans-serif" }}
        >
          Access restricted
        </h1>
        <p className="mt-3 text-base font-medium leading-relaxed text-[var(--clay-muted)]">
          Your role does not include permission for this module. Return to the Control Tower or ask a
          founder/admin.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <ClayButton className="w-full sm:w-auto">Back to dashboard</ClayButton>
          </Link>
          <Link href="/login">
            <ClayButton variant="secondary" className="w-full sm:w-auto">
              Switch account
            </ClayButton>
          </Link>
        </div>
      </ClayCard>
    </div>
  );
}
