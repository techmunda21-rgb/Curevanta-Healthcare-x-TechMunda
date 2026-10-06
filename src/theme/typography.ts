export const typography = {
  displayLarge: { fontSize: 40, lineHeight: 1.15, fontWeight: 700, letterSpacing: "-0.02em" },
  displayMedium: { fontSize: 32, lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" },
  heading1: { fontSize: 28, lineHeight: 1.25, fontWeight: 700, letterSpacing: "-0.01em" },
  heading2: { fontSize: 22, lineHeight: 1.3, fontWeight: 650, letterSpacing: "-0.01em" },
  heading3: { fontSize: 18, lineHeight: 1.35, fontWeight: 600, letterSpacing: "0" },
  titleLarge: { fontSize: 16, lineHeight: 1.4, fontWeight: 600, letterSpacing: "0" },
  titleMedium: { fontSize: 14, lineHeight: 1.4, fontWeight: 600, letterSpacing: "0" },
  titleSmall: { fontSize: 13, lineHeight: 1.4, fontWeight: 600, letterSpacing: "0.01em" },
  bodyLarge: { fontSize: 16, lineHeight: 1.55, fontWeight: 400, letterSpacing: "0" },
  bodyMedium: { fontSize: 14, lineHeight: 1.5, fontWeight: 400, letterSpacing: "0" },
  bodySmall: { fontSize: 13, lineHeight: 1.45, fontWeight: 400, letterSpacing: "0" },
  labelLarge: { fontSize: 12, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.06em" },
  labelMedium: { fontSize: 11, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.08em" },
  labelSmall: { fontSize: 10, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.1em" },
  caption: { fontSize: 12, lineHeight: 1.4, fontWeight: 500, letterSpacing: "0" },
} as const;

export type TypographyRole = keyof typeof typography;
