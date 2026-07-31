# Visual Language

> Complete visual design system — single source of truth for look & feel.  
> Experience: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md)  
> Motion tokens: [MOTION_SYSTEM.md](./MOTION_SYSTEM.md)  
> Components: [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md)

**Principle:** The interface should disappear. The photographs should remain in memory.

Inspired by Apple Photos, Lightroom, Arc, Linear, Raycast, Notion Calendar, editorial photography books, and Scandinavian editorial design — not agency portfolios or gaming UIs.

---

## Design tokens (overview)

Prefer CSS variables / TS theme objects. Do not scatter raw hex or px in components.

```css
:root {
  /* Defined in src/styles/tokens.css — mirrored into Tailwind @theme in globals.css */
}
```

Motion durations live in [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) and `src/lib/motion.ts` — reference them; do not duplicate conflicting values in components.

---

## Typography

| Role | Family | Notes |
|---|---|---|
| **Display** | Instrument Serif | Product + collection titles |
| **UI** | Outfit | Chrome, body, captions — not Inter |

### Scale

| Token | Size | Use |
|---|---|---|
| `display` | `clamp(2.75rem, 6vw, 4.5rem)` | “Gallery Experience” |
| `heading` | `clamp(1.25rem, 2vw, 1.75rem)` | Collection title |
| `body` | `0.9375rem` | General UI copy |
| `body-lg` | `1.0625rem` | Collection meta line |
| `caption` | `0.8125rem` | Counters, quiet labels |
| `metadata` | `0.75rem` | EXIF key/value |

### Weight, line height, tracking

- Display: weight 400; line-height 1.05–1.15; tracking `-0.02em`  
- Heading: 400–500; line-height ~1.2  
- Body: 400–500; line-height 1.45–1.55  
- Caption/metadata: 500; tabular nums for counters  
- UI tracking ~0  

---

## Spacing

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

### Grid, margins, gutters, rhythm

- Horizontal inset: `clamp(16px, 3vw, 48px)`  
- Justified row gap: `8–12px` (tighter on mobile)  
- Title block → wall: `--space-7`  
- Ultra-wide: optional content cap `1800–2200px` or denser full-bleed  
- Prefer generous quiet over dashboard density  

---

## Color

Atmosphere is a **dark room**, not OLED pure black and not neon.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0e0e0e` | App background |
| `--bg-elevated` | `#141414` | Raised quiet surface |
| `--viewer` | `#121212` | Viewer base before tint |
| `--toolbar` | `rgba(255,255,255,0.04)` | Toolbar wash |
| `--hover-surface` | `rgba(255,255,255,0.08)` | Control hover |
| `--text` | `#f2f0eb` | Primary (warm off-white) |
| `--text-muted` | `rgba(242,240,235,0.55)` | Meta |
| `--text-faint` | `rgba(242,240,235,0.32)` | Placeholders |
| `--accent` | `#c8c2b6` | Platinum focus / active |
| `--border` | `rgba(255,255,255,0.08)` | Hairlines |
| `--border-strong` | `rgba(255,255,255,0.14)` | Stronger edges |
| `--disabled` | `rgba(242,240,235,0.28)` | Disabled |
| `--focus` | `#c8c2b6` | Focus ring |
| `--danger-quiet` | `rgba(232,180,180,0.85)` | Rare error text — still calm |

### Viewer tint

Mix dominant image color into `--viewer` at **3–5%**. Manual modes (charcoal / gray / white / blurred) override when chosen.

### Forbidden

Purple–indigo marketing gradients; cream+terracotta defaults; gaming neon; heavy glow.

---

## Accessibility colours

- Text/icon on charcoal and tinted viewers: maintain **WCAG AA** for essential chrome  
- Focus ring contrast against `--bg` and `--viewer`  
- Do not convey state by color alone (favorites, errors)  
- White viewer mode: switch chrome to dark ink equivalents  

---

## Shadows & elevation

```text
Background → Gallery plane → Hovered photograph → Panels/toolbar → Viewer
```

| Level | Treatment |
|---|---|
| Plane | Flat; ambient parallax only |
| Hover photo | Scale 1.02; soft shadow `0 8px 24px rgba(0,0,0,0.35)` max; slight brightness |
| Panels / toolbar | Soft surface wash; avoid heavy cards |
| Viewer | Full-viewport; vignette optional; grain ≤ ~3% opacity |

No multi-layer neon shadows.

---

## Iconography

- One consistent outline set (e.g. Lucide-style via React Icons)  
- Sizes: **16** inline · **20** toolbar · **24** viewer primary  
- Stroke: light; avoid loud fills  
- Padding: hit area ≥ **44×44** on touch  
- Alignment: optical center in square hit targets  
- Color: muted → text on hover → accent when on  

---

## Buttons

| Context | Style |
|---|---|
| Toolbar | Icon-first, transparent, hairline optional |
| Viewer | Same; clusters top-right / bottom-center |
| Metadata | Text buttons rare; prefer quiet icons |
| Counter | Not a button — display only |

No pill clusters. No primary “marketing CTA” styling on the wall.

---

## Toolbar

- Surface `--toolbar`; blur optional and subtle  
- Initially hidden; fades per motion tokens  
- Compact control group; generous outer margin from edges  

---

## Viewer chrome

- Bottom center: Prev · Counter · Next  
- Top right: Download · Info · Close  
- Auto-hidden; no permanent side rails on mobile  

---

## Metadata

- Key in `--text-muted`, value in `--text`  
- Vertical rhythm `--space-3`–`--space-4`  
- No table chrome; editorial stack  

---

## Counter

- Format zero-padded `021 / 248`  
- Tabular figures; caption size  
- Digit animation per Motion / Animation Spec  

---

## Cursor

| State | Behaviour |
|---|---|
| Default | Quiet custom or system |
| Hover UI | Subtle scale / light magnetic on icon buttons |
| Hover photo | Slight scale; photo elevates |
| Viewer idle / slideshow | Fades with chrome |
| Loading | Prefer skeletons; avoid busy cursors |

No trails, spotlights, or gaming crosshairs.

---

## Loading visuals

- Skeletons match aspect boxes  
- Blur-up → sharp fade  
- No branded spinner as the hero  

---

## Empty & error visuals

- Typography-led messages using display/body scale  
- Error placeholders: muted frame, not alarm panels  
- See Experience Design for copy tone  

---

## Responsive notes

- Mobile: tighter gutters, smaller display clamp, icon-sheet toolbar when shown  
- Desktop: full elevation + cursor language  
- Always honor `prefers-reduced-motion` (motion doc) and contrast needs  

---

## Checklist

1. Would this UI still make sense if chrome were invisible?  
2. Are raw values replaced by tokens?  
3. Is elevation whispered?  
4. Does viewer tint stay in the 3–5% range?  
5. Would a photographer trust this beside their work?
