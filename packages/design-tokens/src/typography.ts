export const typography = {
  displayLarge: { fontSize: 40, lineHeight: 46, fontWeight: "700" as const },
  displayMedium: { fontSize: 32, lineHeight: 38, fontWeight: "700" as const },
  heading1: { fontSize: 28, lineHeight: 34, fontWeight: "700" as const },
  heading2: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const },
  heading3: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  titleLarge: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
  titleMedium: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },
  titleSmall: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodyMedium: { fontSize: 14, lineHeight: 21, fontWeight: "400" as const },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  labelLarge: { fontSize: 12, lineHeight: 16, fontWeight: "600" as const },
  labelMedium: { fontSize: 11, lineHeight: 14, fontWeight: "600" as const },
  labelSmall: { fontSize: 10, lineHeight: 13, fontWeight: "600" as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
} as const;

export type TypographyRole = keyof typeof typography;
