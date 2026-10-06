# Curevanta Control Tower — Motion System

Motion communicates hierarchy, continuity, state, and feedback. Never animate for decoration inside ops views.

---

## Durations

| Token | ms | Use |
|-------|-----|-----|
| `instant` | 100 | toggles, checkbox |
| `fast` | 150 | button press, chip |
| `normal` | 220 | hover lift, tab, focus ring |
| `slow` | 320 | panel expand, sheet |
| `emphasis` | 450 | success entrance, hero fade |

---

## Easing

- **Standard:** `cubic-bezier(0.2, 0.8, 0.2, 1)` — UI transitions  
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)`  
- **Spring-ish (CSS):** `cubic-bezier(0.34, 1.2, 0.64, 1)` — sheets only, subtle  

---

## Interaction recipes

| Element | Hover | Active | Focus |
|---------|-------|--------|-------|
| Button | slight brightness / -translate-y-px | `scale(0.98)` | ring 3px primary/30 |
| Interactive card | `-translate-y-0.5` + elevation medium | none / subtle | ring |
| Nav item | bg white/10 | — | ring |
| Row | bg surfaceMuted | — | — |

Critical actions must never wait on decorative animation.

---

## Page / region

- Main content: opacity 0→1 + translateY 4→0 over `normal` on route change (client shells only)  
- Modal: fade + scale 0.98→1 over `slow`  
- Progress bars: width transition `slow`  

---

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Disable: continuous blob/float, parallax, shimmer loops. Keep: opacity fades, instant state swaps.

---

## Do / Don't

**Do:** short press feedback, status chip changes, progress interpolation.  
**Don't:** infinite pulse on healthcare critical alerts, confetti, bouncing nav, multi-layer glass blur animations, Lottie spam.

---

## Implementation

Tokens live in `src/theme/motion.ts` and CSS custom properties `--motion-*`. Components apply Tailwind `duration-*` / `transition-*` mapped to these tokens.
