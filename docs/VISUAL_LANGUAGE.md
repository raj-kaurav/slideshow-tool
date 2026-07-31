# Visual Language

> Visual source of truth for Gallery Experience.  
> Companion: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md)

**Core principle:** The interface should disappear. The photographs should remain in memory.

This system is inspired by Apple Photos, Lightroom, Arc, Linear, Raycast, Notion Calendar, editorial photography books, and Scandinavian editorial design — not agency portfolios or gaming UIs.

---

## Typography

| Role | Family | Notes |
|---|---|---|
| **Display** | Instrument Serif | Brand title, collection title — photographic, editorial |
| **UI** | Outfit | Chrome, labels, counters, metadata — refined grotesque, not Inter |

### Font scale

| Token | Size | Use |
|---|---|---|
| `display-xl` | clamp(2.75rem, 6vw, 4.5rem) | “Gallery Experience” |
| `display-md` | clamp(1.25rem, 2vw, 1.75rem) | Collection title |
| `body-lg` | 1.0625rem | Collection meta line |
| `body` | 0.9375rem | Filename, sidebar body |
| `caption` | 0.8125rem | Counter, quiet labels |
| `micro` | 0.6875rem | Rare tertiary hints |

### Line heights & weight

- Display: line-height `1.05–1.15`, weight `400`
- UI body: line-height `1.45–1.55`, weight `400–500`
- Counters / labels: tabular nums where possible; weight `500`
- Letter-spacing: display slightly tight (`-0.02em`); UI near `0`

---

## Color system

Atmosphere is a **dark room**, not absolute black and not neon.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0e0e0e` | App background |
| `--bg-elevated` | `#141414` | Subtle raised surface |
| `--viewer-base` | `#121212` | Viewer charcoal before tint |
| `--surface` | `rgba(255,255,255,0.04)` | Panels, toolbar wash |
| `--surface-strong` | `rgba(255,255,255,0.08)` | Hovered controls |
| `--text` | `#f2f0eb` | Primary text (warm off-white) |
| `--text-muted` | `rgba(242,240,235,0.55)` | Meta, secondary |
| `--text-faint` | `rgba(242,240,235,0.32)` | Disabled / placeholders |
| `--accent` | `#c8c2b6` | Platinum focus / active |
| `--border` | `rgba(255,255,255,0.08)` | Hairlines only when needed |
| `--border-strong` | `rgba(255,255,255,0.14)` | Focus-adjacent |
| `--disabled` | `rgba(242,240,235,0.28)` | Disabled icons/text |
| `--focus-ring` | `#c8c2b6` | Visible focus |

### Viewer color sampling (core)

When entering fullscreen, sample the image’s dominant color and tint `--viewer-base` by **~3–5%**.

| Subject | Tint direction |
|---|---|
| Snow | Cool charcoal |
| Forest | Muted green |
| Ocean | Deep navy |
| Sunset | Warm graphite |

Tint must be almost imperceptible — each photograph owns its environment without announcing the effect.

Manual background modes (charcoal / gray / white / blurred) still override when the user chooses them.

### Forbidden palettes

- Purple-on-white / purple–indigo gradients
- Warm cream + terracotta “AI default”
- Gaming neon, heavy glow, absolute pure black as the only mode

---

## Spacing

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Micro gaps |
| `--space-2` | 8px | Icon padding internals |
| `--space-3` | 12px | Compact control clusters |
| `--space-4` | 16px | Default control padding |
| `--space-5` | 24px | Section padding |
| `--space-6` | 32px | Title block gaps |
| `--space-7` | 48px | Hero → gallery rhythm |
| `--space-8` | 64px | Large vertical breathing |

### Grid & gutters

- Gallery horizontal inset: `clamp(16px, 3vw, 48px)`
- Justified row gap: `8–12px` (tighter on mobile)
- Vertical rhythm: title block → `var(--space-7)` → wall
- Ultra-wide: optional content cap `1800–2200px` or full-bleed denser rows

Margins prefer generous quiet — never dashboard density.

---

## Elevation & depth

```text
Background
  → Gallery Plane
    → Hovered Photograph
      → Panels / Toolbar
        → Fullscreen Viewer
```

| Level | Treatment |
|---|---|
| Gallery plane | Flat in space; ambient parallax 3–8px |
| Hovered photo | Scale `1.02`, soft shadow, slight brightness — elevate, don’t leap |
| Toolbar / panels | Soft surface wash; no heavy cards |
| Viewer | Full viewport plane; vignette optional, grain ≤ ~3% opacity |
| Shadows | `0 8px 24px rgba(0,0,0,0.35)` max on hover; quieter elsewhere |

No dramatic scaling. No exaggerated multi-layer shadows.

---

## Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Most UI |
| `--ease-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | Fades |
| `--dur-instant` | `100ms` | Micro feedback |
| `--dur-fast` | `180ms` | Chrome show/hide |
| `--dur-base` | `280ms` | Nav slide-fade |
| `--dur-slow` | `450ms` | Shared-element settle |
| `--dur-reveal` | `≤900ms` | Single cell reveal |
| `--stagger` | `15–25ms` | Wave reveal |
| `--assemble` | `~1.5s` | Full first-viewport assemble |
| `--hover-scale` | `1.02` | Card hover |
| `--reveal-move` | `20–40px` | Cell entrance travel |
| `--reveal-rotate` | `≤5deg` | Cell entrance |
| `--reveal-scale-from` | `0.97` | Cell entrance |
| `--parallax` | `3–8px` | Ambient pointer |
| `--breathe-period` | `8–12s` | Ambient breathing |
| `--breathe-move` | `~1px` | Breathing amplitude |
| `--kenburns` | `1 → 1.04` | Slideshow |
| `--nav-slide` | `~8%` | Manual image transition |
| `--chrome-hide` | `~2s` | Auto-hide delay |
| `--tint-strength` | `3–5%` | Dominant color mix |

### Springs (Framer)

- Hover / chrome: `stiffness: 300`, `damping: 28` (no bounce)
- Shared element: `stiffness: 260`, `damping: 32`

### Forbidden motion

Bounce, elastic showmanship, particles, explosions, large camera swings, infinite decorative loops, layout-shifting reveals.

---

## Iconography

- Library: React Icons (prefer a single consistent set, e.g. Lucide-style or Phosphor outline)
- Sizes: `16` (inline), `20` (toolbar), `24` (viewer primary)
- Stroke: visually light; avoid filled loud glyphs
- Hit area: ≥ `44×44` on touch; visual icon may be smaller with padding
- Color: `--text-muted` default → `--text` on hover → `--accent` when active

---

## Cursor behaviour (desktop)

| State | Behaviour |
|---|---|
| Default | Quiet custom or system; never gaming crosshair |
| Hover interactive | Subtle scale / magnetic pull on icon buttons only |
| Hover photograph | Slight cursor scale; image elevates (see hover) |
| Loading | Minimal; prefer skeletons over spinners |
| Viewer idle / slideshow | Cursor fades with chrome |
| Viewer active | Cursor returns immediately on move |

No trail effects, no spotlight overlays.

---

## Component styling

### Title / collection header

- Display title primary; collection title secondary; meta line muted
- No cards, no borders, no badges
- Almost empty chrome on first paint

### Toolbar

- Initially hidden / opacity 0
- Fades in after scroll, interaction, search shortcut, or top-area hover
- Floating, hairline or soft surface — not a dashboard bar
- Controls as quiet icon buttons + minimal text where needed

### Image card

- Reserved aspect box from manifest (no CLS)
- Skeleton → blur-up → full
- Hover per elevation rules; optional filename caption only

### Viewer

- Charcoal + dominant tint
- Bottom-center nav cluster; top-right utility cluster
- Counter: tabular figures; **digit-level** animation on change
- Chrome opacity transition `--dur-fast`

### Buttons

- Icon-first; label via `aria-label`
- No pill clusters; no heavy fills
- Focus ring always visible for keyboard users

### Metadata / sidebar

- Slide-out; typography quiet; key/value editorial spacing
- Hide entirely when no EXIF / file meta exists

### Counters

- Format `021 / 248` (zero-padded current)
- Animate digits individually on change
- `aria-live` polite for screen readers (numeric, not animation-dependent)

---

## Responsive notes

- Mobile: tighter gutters, smaller display clamp, toolbar as icon sheet when shown, ambient parallax reduced/off
- Desktop: full motion language, magnetic icon buttons
- Always honor `prefers-reduced-motion`

---

## Checklist for new UI

Before shipping any surface, confirm:

1. Would this still make sense if chrome were invisible?  
2. Does motion guide orientation — or compete with the photo?  
3. Is elevation whispered, not shouted?  
4. Does the viewer tint feel owned by the image at 3–5%?  
5. Would a photographer trust this with their work?
