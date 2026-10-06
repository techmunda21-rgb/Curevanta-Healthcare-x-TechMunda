import { cn } from "@/lib/utils";

type AppFrameProps = {
  children: React.ReactNode;
  className?: string;
  /** max content width on large screens */
  wide?: boolean;
};

/**
 * Responsive Curevanta frame:
 * - Mobile: full-bleed app
 * - Tablet: centered card up to ~720px
 * - Desktop: wide canvas up to 1120px
 */
export function AppFrame({ children, className, wide = false }: AppFrameProps) {
  return (
    <div className="cv-viewport min-h-dvh w-full">
      <div
        className={cn(
          "cv-frame relative mx-auto flex min-h-dvh w-full flex-col bg-[var(--surface)]",
          "sm:min-h-[min(100dvh,920px)] sm:my-0",
          "md:my-4 md:min-h-[calc(100dvh-2rem)] md:max-w-[720px] md:overflow-hidden md:rounded-[28px] md:border md:border-[var(--border)] md:shadow-[0_20px_60px_rgba(0,122,122,0.1)]",
          wide
            ? "lg:max-w-[1120px] xl:max-w-[1200px]"
            : "lg:max-w-[960px]",
          className,
        )}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

/** @deprecated use AppFrame — kept for existing imports */
export function PhoneShell(props: AppFrameProps) {
  return <AppFrame {...props} />;
}
