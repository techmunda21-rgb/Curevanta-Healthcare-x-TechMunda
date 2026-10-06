"use client";

import { usePathname } from "next/navigation";
import { AppFrame } from "@/components/curevanta/phone-shell";
import { PatientBottomNav, PatientSideNav } from "@/components/curevanta/bottom-nav";

const TAB_PATHS = [
  "/patient/home",
  "/patient/bookings",
  "/patient/care",
  "/patient/support",
  "/patient/profile",
];

export function PatientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTabs = TAB_PATHS.some((p) => pathname === p);

  return (
    <AppFrame wide>
      <div className="flex h-full min-h-0 flex-1 bg-[#F7FAFA]">
        {showTabs ? <PatientSideNav /> : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="cv-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="cv-page mx-auto w-full max-w-3xl lg:max-w-none lg:px-2">
              {children}
            </div>
          </div>
          {showTabs ? <PatientBottomNav /> : null}
        </div>
      </div>
    </AppFrame>
  );
}
