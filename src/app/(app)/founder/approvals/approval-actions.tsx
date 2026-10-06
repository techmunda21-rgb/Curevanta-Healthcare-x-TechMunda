"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { decideApprovalAction } from "@/app/actions/approvals";

export function ApprovalActions({ approvalId }: { approvalId: string }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => start(() => decideApprovalAction(approvalId, "APPROVED"))}
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          start(() => decideApprovalAction(approvalId, "NEEDS_CHANGES", "Needs changes"))
        }
      >
        Needs changes
      </Button>
      <Button
        size="sm"
        variant="danger"
        disabled={pending}
        onClick={() => start(() => decideApprovalAction(approvalId, "REJECTED"))}
      >
        Reject
      </Button>
    </div>
  );
}
