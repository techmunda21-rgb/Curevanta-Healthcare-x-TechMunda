import { AppFrame } from "@/components/curevanta/phone-shell";

export default function CurevantaPublicLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
