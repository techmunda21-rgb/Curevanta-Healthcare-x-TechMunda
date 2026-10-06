/**
 * AI service abstraction — never call Gemini directly from UI components.
 * All AI features go through this module.
 */

export type AIBriefContext = {
  projectName: string;
  healthScore: number;
  healthStatus: string;
  yesterdayCompleted: number;
  todayActive: number;
  criticalBlockers: number;
  budgetRemainingInr: number;
  daysToRelease: number | null;
  founderDecisionsPending: number;
  topRecommendation?: string;
  overdueCount?: number;
  teamUtilizationPct?: number;
  qaRisk?: string;
  releaseRisk?: string;
};

export type AITaskProposal = {
  title: string;
  description: string;
  suggestedOwnerTitle?: string;
  priority: "P0" | "P1" | "P2" | "P3";
  estimatedHours: number;
  dependencies: string[];
  acceptanceCriteria: string[];
  workstream?: string;
};

export type AIProvider = {
  generateDailyBrief(ctx: AIBriefContext): Promise<string>;
  proposeTasks(prompt: string, context?: string): Promise<AITaskProposal[]>;
  summarize(text: string, purpose: string): Promise<string>;
};

function formatINR(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

function deterministicBrief(ctx: AIBriefContext): string {
  const days = ctx.daysToRelease ?? "—";
  return [
    `GOOD MORNING FOUNDER`,
    ``,
    `${ctx.projectName} Health:`,
    `${ctx.healthScore}/100 — ${ctx.healthStatus}`,
    ``,
    `Yesterday:`,
    `${ctx.yesterdayCompleted} tasks completed`,
    ``,
    `Today:`,
    `${ctx.todayActive} active tasks`,
    ``,
    `Critical:`,
    `${ctx.criticalBlockers} P0 blockers`,
    ``,
    `Budget:`,
    `${formatINR(ctx.budgetRemainingInr)} remaining`,
    ``,
    `Release:`,
    `${days} days remaining`,
    ``,
    `Founder decisions:`,
    `${ctx.founderDecisionsPending}`,
    ``,
    `Top recommendation:`,
    ctx.topRecommendation ??
      "Focus founder review on open P0 blockers and any pending production approvals before deep-work windows.",
  ].join("\n");
}

class GeminiProvider implements AIProvider {
  constructor(
    private apiKey: string,
    private model: string,
  ) {}

  private async call(prompt: string): Promise<string | null> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch {
      return null;
    }
  }

  async generateDailyBrief(ctx: AIBriefContext): Promise<string> {
    const fallback = deterministicBrief(ctx);
    if (!this.apiKey) return fallback;

    const prompt = `You are the AI CTO for TechMunda × Curevanta Project Control Tower.
Write a concise founder morning brief using ONLY this data. Do not invent numbers.
Do not recommend firing people, changing salary, issuing equity, approving expenses, or deploying production.

DATA:
${JSON.stringify(ctx, null, 2)}

Format like:

GOOD MORNING FOUNDER

Curevanta Health:
XX/100 — STATUS

Yesterday:
N tasks completed

Today:
N active tasks

Critical:
N P0 blockers

Budget:
₹XL remaining

Release:
N days remaining

Founder decisions:
N

Top recommendation:
One concrete next action.`;

    const text = await this.call(prompt);
    return text?.trim() || fallback;
  }

  async proposeTasks(prompt: string, context?: string): Promise<AITaskProposal[]> {
    if (!this.apiKey) {
      return [
        {
          title: "Clarify realtime dispatch requirements",
          description: `Derived from founder request: ${prompt}`,
          suggestedOwnerTitle: "Backend Engineer",
          priority: "P1",
          estimatedHours: 8,
          dependencies: ["Socket.IO foundation"],
          acceptanceCriteria: [
            "Dispatch event schema documented",
            "Socket rooms defined for doctor sessions",
          ],
          workstream: "Realtime/Dispatch",
        },
        {
          title: "Implement doctor app realtime connection layer",
          description: "Wire Expo client to dispatch channel with reconnect + offline queue.",
          suggestedOwnerTitle: "Mobile Engineer — Doctor",
          priority: "P1",
          estimatedHours: 16,
          dependencies: ["Clarify realtime dispatch requirements"],
          acceptanceCriteria: [
            "Connects to staging socket gateway",
            "Handles token refresh",
            "Shows connection status in UI",
          ],
          workstream: "Mobile - Doctor",
        },
        {
          title: "QA checklist for realtime dispatch",
          description: "Security and reliability checks for dispatch week.",
          suggestedOwnerTitle: "QA / Security Engineer",
          priority: "P2",
          estimatedHours: 6,
          dependencies: ["Implement doctor app realtime connection layer"],
          acceptanceCriteria: ["Latency thresholds documented", "Auth bypass tests pass"],
          workstream: "QA/Security",
        },
      ];
    }

    const aiPrompt = `Propose engineering tasks as JSON array only. Each item:
{title, description, suggestedOwnerTitle, priority (P0|P1|P2|P3), estimatedHours, dependencies[], acceptanceCriteria[], workstream}
Founder request: ${prompt}
Context: ${context ?? "Curevanta December 2026 release"}
Do not include irreversible actions (equity, salary, deploy production).`;

    const text = await this.call(aiPrompt);
    if (!text) return this.proposeTasks(prompt); // fallback path without key-style proposals

    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) return [];
      return JSON.parse(match[0]) as AITaskProposal[];
    } catch {
      return [];
    }
  }

  async summarize(text: string, purpose: string): Promise<string> {
    if (!this.apiKey) {
      return `Summary (${purpose}):\n${text.slice(0, 500)}${text.length > 500 ? "…" : ""}`;
    }
    const result = await this.call(
      `Summarize for ${purpose}. Keep under 200 words. Content:\n${text}`,
    );
    return result ?? text.slice(0, 500);
  }
}

let cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cached) return cached;
  const key = process.env.GEMINI_API_KEY ?? "";
  const model = process.env.AI_MODEL ?? "gemini-2.0-flash";
  cached = new GeminiProvider(key, model);
  return cached;
}

export { deterministicBrief };
