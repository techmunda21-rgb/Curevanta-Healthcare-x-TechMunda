import { cn } from "@/lib/utils";

export function CurevantaLogo({
  className,
  size = 72,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_12px_28px_rgba(0,155,154,0.35)]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="h-[62%] w-[62%]" fill="none">
        <path
          d="M28 12h8v14h14v8H36v18h-8V34H12v-8h16V12z"
          fill="currentColor"
          rx="2"
        />
        <path
          d="M40 18c6 2 10 8 10 14 0 4-2 8-5 10 4-8 2-16-5-24z"
          fill="#A8F0E8"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}
