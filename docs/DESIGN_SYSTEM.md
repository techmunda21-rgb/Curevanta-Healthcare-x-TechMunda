# Curevanta Control Tower — Design System

Premium healthcare ops / fintech-level polish for the **web** Control Tower.  
Brand: TechMunda × Curevanta. Calm, trustworthy, spacious, high-end — not playful clay inside the CRM.

---

## Principles

- Semantic tokens over hardcoded values  
- 8-point spacing rhythm  
- Subtle elevation (border + soft shadow), not heavy drop shadows  
- Progressive disclosure over dense KPI walls  
- Glass only selectively (never default for data tables)  
- Dark-mode token structure ready; light mode only until critical screens verified  

---

## Color (semantic)

| Token | Light | Usage |
|-------|-------|--------|
| `primary` | `#009B9A` | CTAs, active nav, links |
| `primaryPressed` | `#007A7A` | Pressed / hover deep |
| `primarySoft` | `#E6F5F5` | Soft fills, chips |
| `accent` | `#48D7D2` | Highlights, focus accents |
| `background` | `#F7FAFA` | App canvas |
| `surface` | `#FFFFFF` | Cards |
| `surfaceElevated` | `#FFFFFF` | Elevated cards |
| `surfaceMuted` | `#F2F5F5` | Recessed panels |
| `textPrimary` | `#30363A` | Headings, body |
| `textSecondary` | `#5C6569` | Supporting |
| `textMuted` | `#6B7578` | Labels, meta |
| `border` | `#D7E0E0` | Dividers |
| `success` | `#1B7F5A` | Positive |
| `warning` | `#B7791F` | Caution |
| `error` | `#C62828` | Critical |
| `info` | `#0B6E99` | Informational |
| `sidebar` | `#30363A` | Shell |
| `sidebarText` | `#D7E0E0` | Inactive nav |

Implementation: `src/theme/colors.ts` → CSS vars in `globals.css`.

---

## Typography

**Ops UI:** Inter (primary)  
**Marketing login:** Nunito optional for display accents  

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|----------|
| displayLarge | 40/48 | 700 | 1.15 | -0.02em |
| displayMedium | 32/40 | 700 | 1.2 | -0.02em |
| heading1 | 28 | 700 | 1.25 | -0.01em |
| heading2 | 22 | 650 | 1.3 | -0.01em |
| heading3 | 18 | 600 | 1.35 | 0 |
| titleLarge | 16 | 600 | 1.4 | 0 |
| titleMedium | 14 | 600 | 1.4 | 0 |
| titleSmall | 13 | 600 | 1.4 | 0.01em |
| bodyLarge | 16 | 400 | 1.55 | 0 |
| bodyMedium | 14 | 400 | 1.5 | 0 |
| bodySmall | 13 | 400 | 1.45 | 0 |
| labelLarge | 12 | 600 | 1.3 | 0.06em |
| labelMedium | 11 | 600 | 1.3 | 0.08em |
| labelSmall | 10 | 600 | 1.3 | 0.1em |
| caption | 12 | 500 | 1.4 | 0 |

---

## Spacing

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`  
Page horizontal padding: `16–24px` (mobile/desktop). Section gaps: `24–32px`.

---

## Radius

| Token | Value |
|-------|-------|
| xs | 8 |
| sm | 12 |
| md | 16 |
| lg | 20 |
| xl | 24 |
| pill | 999 |

Cards: `md–lg`. Buttons: `sm–md`. Badges: `pill` or `xs`.

---

## Elevation

| Level | Treatment |
|-------|-----------|
| none | flat + border |
| low | `0 1px 2px rgba(48,54,58,0.04)` + border |
| medium | `0 4px 12px rgba(48,54,58,0.06)` + border |
| high | `0 8px 24px rgba(48,54,58,0.08)` + border |

---

## Surfaces

- **StandardCard** — white, border, radius md, elevation low  
- **ElevatedCard** — elevation medium  
- **InteractiveCard** — hover lift 2px + elevation medium  
- **StatusCard** — soft tint by status  
- **MetricCard** — KPI: label + large value + optional hint  

---

## Components (recipes)

**Button:** primary (teal), secondary (graphite), outline, ghost, danger. Height 40 default / 44 lg. Press scale ~0.98. Loading spinner replaces label width-stable.

**Input:** height 40–44, radius sm, border focus → primary + ring accent/30.

**Badge / StatusChip:** semantic colors; never rely on color alone (include text).

**Empty / Error:** calm copy + single primary CTA.

**PageHeader:** title (heading2) + description (bodyMedium) + actions.

---

## Iconography

Lucide only. Stroke weight consistent. Prefer outline style in nav; filled for active emphasis sparingly.

---

## Login vs CRM

Login may use soft clay *physics* (depth) with **teal** accents. CRM shell and data screens use this design system only — no violet candy palette.
