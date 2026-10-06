"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldPlus, Stethoscope, Heart } from "lucide-react";
import { CvButton } from "@/components/curevanta/ui";
import { onboardingSlides } from "@/lib/curevanta/demo";

export default function OnboardingPage() {
  const [i, setI] = useState(0);
  const router = useRouter();
  const slide = onboardingSlides[i];
  const last = i === onboardingSlides.length - 1;

  return (
    <div className="flex h-full flex-col bg-white px-5 pb-6 pt-4">
      <div className="flex justify-end">
        <Link href="/login" className="text-sm font-semibold text-[var(--text-muted)]">
          Skip
        </Link>
      </div>

      <div className="relative mx-auto mt-4 flex h-56 w-full max-w-[280px] items-center justify-center">
        <div className="absolute inset-6 rounded-full bg-[var(--primary-soft)]" />
        <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(145deg,#009B9A,#48D7D2)] shadow-[0_16px_40px_rgba(0,155,154,0.3)]">
          <Stethoscope className="h-16 w-16 text-white" strokeWidth={1.5} />
        </div>
        <span className="absolute left-2 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-[var(--primary)]">
          <Heart className="h-5 w-5" />
        </span>
        <span className="absolute right-4 top-16 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-[var(--primary)]">
          <ShieldPlus className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 flex-1 text-center">
        <h2 className="text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)]">
          {slide.title}
        </h2>
        <p className="mx-auto mt-3 max-w-[300px] text-sm leading-relaxed text-[var(--text-secondary)]">
          {slide.body}
        </p>
      </div>

      <div className="mb-5 flex justify-center gap-2">
        {onboardingSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-6 bg-[var(--primary)]" : "w-2 bg-[var(--border)]"
            }`}
          />
        ))}
      </div>

      <CvButton
        onClick={() => {
          if (last) router.push("/login");
          else setI((v) => v + 1);
        }}
      >
        {last ? "Continue" : "Next"}
      </CvButton>
    </div>
  );
}
