import { PatientShell } from "@/components/curevanta/patient-shell";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PatientShell>{children}</PatientShell>;
}
