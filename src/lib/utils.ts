import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs >= 10 ? 1 : 2)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function daysUntil(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function utilizationBand(pct: number): {
  label: string;
  tone: "available" | "healthy" | "high" | "overloaded";
} {
  if (pct <= 60) return { label: "AVAILABLE", tone: "available" };
  if (pct <= 85) return { label: "HEALTHY", tone: "healthy" };
  if (pct <= 100) return { label: "HIGH", tone: "high" };
  return { label: "OVERLOADED", tone: "overloaded" };
}

export function healthFromScore(score: number): "ON_TRACK" | "AT_RISK" | "CRITICAL" {
  if (score >= 75) return "ON_TRACK";
  if (score >= 50) return "AT_RISK";
  return "CRITICAL";
}

export function readinessFromScore(score: number): "READY" | "AT_RISK" | "NOT_READY" {
  if (score >= 80) return "READY";
  if (score >= 60) return "AT_RISK";
  return "NOT_READY";
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
