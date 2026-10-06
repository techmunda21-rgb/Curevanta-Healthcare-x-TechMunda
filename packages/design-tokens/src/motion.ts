export const motion = {
  instant: 100,
  fast: 150,
  normal: 220,
  slow: 320,
  emphasis: 450,
  easing: {
    standard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.2, 0.64, 1)",
  },
} as const;

export type MotionDuration = keyof Omit<typeof motion, "easing">;
