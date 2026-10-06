import { cn } from "@/lib/utils";

export function ClayCard({
  className,
  interactive = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] bg-[var(--clay-card-bg)] p-6 text-[var(--clay-foreground)] shadow-clay-card backdrop-blur-xl sm:rounded-[40px] sm:p-8",
        interactive &&
          "transition-all duration-500 hover:-translate-y-2 hover:shadow-clay-card-hover",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
