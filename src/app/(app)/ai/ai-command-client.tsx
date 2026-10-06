"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea, Label, Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proposeTasksAction, generateBriefAction } from "@/app/actions/ai";

type Proposal = {
  title: string;
  description: string;
  suggestedOwnerTitle?: string;
  priority: "P0" | "P1" | "P2" | "P3";
  estimatedHours: number;
  dependencies: string[];
  acceptanceCriteria: string[];
  workstream?: string;
};

export function AICommandClient({ initialBrief }: { initialBrief: string }) {
  const [brief, setBrief] = useState(initialBrief);
  const [prompt, setPrompt] = useState(
    "Prepare the team for Doctor App realtime dispatch this week.",
  );
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Daily CTO Brief</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="whitespace-pre-wrap rounded-lg bg-[var(--graphite)] p-4 text-xs text-[#e8eeee]">
            {brief}
          </pre>
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const text = await generateBriefAction();
                setBrief(text);
              })
            }
          >
            Refresh brief
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Task Creation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-[var(--muted)]">
            AI proposes tasks. Founder approval is required before anything is created. AI cannot
            approve expenses, issue equity, deploy production, or change permissions.
          </p>
          <div className="space-y-1">
            <Label htmlFor="prompt">Founder instruction</Label>
            <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const result = await proposeTasksAction(prompt);
                setProposals(result.proposals);
                setMessage(result.note);
              })
            }
          >
            Generate proposals
          </Button>
          {message ? <p className="text-xs text-[var(--muted)]">{message}</p> : null}
          <div className="space-y-3">
            {proposals.map((p, i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] p-3 text-sm">
                <div className="font-semibold">
                  {p.title} · {p.priority} · {p.estimatedHours}h
                </div>
                <div className="text-[var(--muted)]">{p.description}</div>
                <div className="mt-1 text-xs">Owner hint: {p.suggestedOwnerTitle ?? "—"}</div>
                <div className="mt-1 text-xs">
                  AC: {p.acceptanceCriteria?.join("; ")}
                </div>
              </div>
            ))}
          </div>
          {proposals.length ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                start(async () => {
                  const fd = new FormData(e.currentTarget);
                  const { createProposedTasksAction } = await import("@/app/actions/ai");
                  const res = await createProposedTasksAction(fd.get("confirm") === "yes", proposals);
                  setMessage(res.message);
                  if (res.created) setProposals([]);
                });
              }}
              className="space-y-2 rounded-lg bg-[var(--surface-muted)] p-3"
            >
              <Label htmlFor="confirm">Type yes to create proposed tasks</Label>
              <Input id="confirm" name="confirm" placeholder="yes" />
              <Button type="submit" disabled={pending}>
                Create after approval
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
