export const colors = {
  primary: "#009B9A",
  primaryPressed: "#007A7A",
  primarySoft: "#E6F5F5",
  deepTeal: "#007A7A",
  aqua: "#48D7D2",
  graphite: "#30363A",
  background: "#F7FAFA",
  surface: "#FFFFFF",
  surfaceAlt: "#F2F5F5",
  surfaceElevated: "#FFFFFF",
  textPrimary: "#30363A",
  textSecondary: "#5C6569",
  textMuted: "#6B7578",
  border: "#D7E0E0",
  success: "#1B7F5A",
  warning: "#B7791F",
  error: "#C62828",
  info: "#0B6E99",
} as const;

export type ColorToken = keyof typeof colors;
