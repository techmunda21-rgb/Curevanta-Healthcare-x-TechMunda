export const elevation = {
  none: "none",
  low: "0 1px 2px rgba(48, 54, 58, 0.04)",
  medium: "0 4px 12px rgba(48, 54, 58, 0.06)",
  high: "0 8px 24px rgba(48, 54, 58, 0.08)",
} as const;

export type ElevationToken = keyof typeof elevation;
