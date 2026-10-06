import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusKind = "task" | "health" | "priority" | "blocker" | "bug";

type StatusBadgeProps = {
  status: string;
  kind?: StatusKind;
  className?: string;
  label?: string;
};

function humanize(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function variantFor(
  status: string,
  kind: StatusKind,
): React.ComponentProps<typeof Badge>["variant"] {
  const key = status.toUpperCase();

  if (kind === "priority" || /^P[0-3]$/.test(key)) {
    if (key === "P0") return "p0";
    if (key === "P1") return "p1";
    if (key === "P2") return "p2";
    if (key === "P3") return "p3";
  }

  if (kind === "health") {
    if (key === "ON_TRACK" || key === "READY" || key === "HEALTHY" || key === "ACTIVE" || key === "AVAILABLE" || key === "GREEN")
      return "success";
    if (key === "AT_RISK" || key === "HIGH" || key === "AMBER" || key === "ON_LEAVE") return "warning";
    if (key === "CRITICAL" || key === "NOT_READY" || key === "OVERLOADED" || key === "RED" || key === "OFFLINE")
      return "danger";
    return "secondary";
  }

  if (kind === "blocker") {
    if (key === "RESOLVED" || key === "APPROVED") return "success";
    if (key === "ESCALATED" || key === "REJECTED") return "danger";
    if (key === "IN_PROGRESS" || key === "PENDING" || key === "NEEDS_CHANGES") return "warning";
    return "secondary";
  }

  if (kind === "bug") {
    if (key === "CRITICAL") return "danger";
    if (key === "HIGH") return "p1";
    if (key === "MEDIUM") return "warning";
    if (key === "LOW") return "secondary";
    if (key === "RESOLVED" || key === "CLOSED") return "success";
    if (key === "WONT_FIX") return "outline";
    return "secondary";
  }

  switch (key) {
    case "DONE":
    case "APPROVED":
      return "success";
    case "BLOCKED":
    case "REWORK":
      return "danger";
    case "IN_PROGRESS":
    case "IN_REVIEW":
    case "QA":
    case "CLIENT_REVIEW":
      return "warning";
    case "READY":
      return "default";
    case "BACKLOG":
    default:
      return "secondary";
  }
}

/** Unified status badge used across Control Tower pages */
export function StatusBadge({ status, kind = "task", className, label }: StatusBadgeProps) {
  return (
    <Badge variant={variantFor(status, kind)} className={cn(className)}>
      {label ?? humanize(status)}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <StatusBadge status={priority} kind="priority" label={priority} />;
}

export function TaskStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} kind="task" />;
}

export function HealthBadge({ status }: { status: string }) {
  return <StatusBadge status={status} kind="health" />;
}
