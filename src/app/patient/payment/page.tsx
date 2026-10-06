"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { CvButton, CvHeader } from "@/components/curevanta/ui";
import { doctorDemo } from "@/lib/curevanta/demo";

const methods = [
  { id: "upi", label: "UPI", hint: "GPay · PhonePe · Paytm" },
  { id: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay" },
  { id: "wallet", label: "Wallet", hint: "Amazon Pay, Mobikwik" },
  { id: "netbanking", label: "Net Banking", hint: "All major banks" },
];

export default function PaymentPage() {
  const [method, setMethod] = useState("upi");

  return (
    <div className="flex h-full flex-col bg-[#F7FAFA]">
      <CvHeader title="Payment" backHref="/patient/doctor" />
      <div className="flex-1 space-y-4 px-4 pb-6">
        <div className="rounded-2xl bg-white p-4 shadow-[var(--elevation-low)]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Consultation Fee</span>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              ₹{doctorDemo.feeInr}
            </span>
          </div>
          <input
            className="mt-3 h-11 w-full rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm outline-none"
            placeholder="Apply Coupon"
          />
        </div>

        <div className="rounded-2xl bg-white p-2 shadow-[var(--elevation-low)]">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[var(--surface-muted)]"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  method === m.id ? "border-[var(--primary)]" : "border-[var(--border)]"
                }`}
              >
                {method === m.id ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                ) : null}
              </span>
              <span>
                <span className="block text-sm font-bold text-[var(--text-primary)]">
                  {m.label}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{m.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--border)] bg-white p-4">
        <CvButton href="/patient/booking/confirmed">Pay ₹{doctorDemo.feeInr}</CvButton>
        <p className="flex items-center justify-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--primary)]" />
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}
