# Motion System

> Single source of truth for motion language and tokens.  
> Exact per-interaction sequences: [ANIMATION_SPEC.md](./ANIMATION_SPEC.md)  
> Experience intent: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md)  
> Visual tokens: [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md)

**Principle:** The interface should disappear. The photographs should remain in memory.

---

## Motion philosophy

| Principle | Meaning |
|---|---|
| **Motion with purpose** | Every animation explains origin, destination, or state — never spectacle |
| **Spatial continuity** | Open/close preserve where a photograph lived on the wall |
| **Invisible motion** | If the user notices motion more than the image, it failed |
| **Orientation support** | Motion answers “where did I come from?” and “where am I going?” |
| **Photography remains the hero** | Motion never competes with the photograph |

Do not animate because a library makes it easy. Prefer stillness when stillness is clearer.

---

## Motion tokens

Do **not** hardcode arbitrary durations in components. Import or reference these tokens (CSS variables / TS constants).

| Token | ID | Duration | Typical use |
|---|---|---|---|
| Instant | `motion.instant` | `100ms` | Micro feedback, focus gleam |
| Fast | `motion.fast` | `180ms` | Chrome show/hide, toolbar fade |
| Normal | `motion.normal` | `280ms` | Image nav slide-fade, panel settle |
| Slow | `motion.slow` | `450ms` | Shared-element settle |
| Gallery Reveal (cell) | `motion.revealCell` | `≤900ms` | Single placeholder populate |
| Gallery Assemble | `motion.assemble` | `~1500ms` | First-viewport wave complete |
| Viewer Expand | `motion.viewerExpand` | `450–600ms` | Shared-element open |
| Viewer Close | `motion.viewerClose` | `400–550ms` | Reverse shared-element |
| Toolbar Fade | `motion.toolbar` | `180–240ms` | Deferred toolbar in/out |
| Chrome Hide delay | `motion.chromeHideDelay` | `2000ms` | Idle before viewer chrome fades |
| Chrome Fade | `motion.chromeFade` | `180ms` | Chrome opacity |
| Slideshow Crossfade | `motion.slideshow` | `600–900ms` | Exhibition crossfade |
| Counter Digit | `motion.counter` | `180–220ms` | Per-digit change |
| Hover | `motion.hover` | `180–220ms` | Card elevation |
| Breathing period | `motion.breathePeriod` | `8–12s` | Ambient cycle |
| Stagger | `motion.stagger` | `15–25ms` | Wave reveal between cells |
| Parallax max | `motion.parallax` | `3–8px` | Ambient pointer shift |
| Ken Burns | `motion.kenBurns` | interval length | `1 → 1.04` over slide |

CSS example:

```css
:root {
  --motion-instant: 100ms;
  --motion-fast: 180ms;
  --motion-normal: 280ms;
  --motion-slow: 450ms;
  --motion-reveal-cell: 900ms;
  --motion-assemble: 1500ms;
  --motion-viewer-expand: 520ms;
  --motion-viewer-close: 480ms;
  --motion-toolbar: 200ms;
  --motion-chrome-hide-delay: 2000ms;
  --motion-chrome-fade: 180ms;
  --motion-slideshow: 700ms;
  --motion-counter: 200ms;
  --motion-hover: 200ms;
  --motion-stagger-min: 15ms;
  --motion-stagger-max: 25ms;
}
```

---

## Easing tokens

| Token | ID | Curve | When to use |
|---|---|---|---|
| **Standard** | `ease.standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | General UI, fades |
| **Entrance** | `ease.entrance` | `cubic-bezier(0.22, 1, 0.36, 1)` | Elements arriving into view |
| **Exit** | `ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving |
| **Shared Element** | `ease.shared` | Spring `stiffness: 260`, `damping: 32` | Viewer open/close FLIP |
| **Hover** | `ease.hover` | Spring `stiffness: 300`, `damping: 28` | Card / button hover (no bounce) |
| **Gallery Reveal** | `ease.reveal` | Soft spring, damping ≥ 28 | Cell populate into placeholders |
| **Slideshow** | `ease.slideshow` | `cubic-bezier(0.4, 0, 0.2, 1)` | Crossfade + Ken Burns |

Springs must be **critically / over-damped** — no visible bounce or elastic overshoot.

---

## Motion rules

### Maximums

| Property | Limit |
|---|---|
| Rotation | **5°** |
| Hover scale | **1.02** |
| Reveal movement | **40px** |
| Reveal scale from | **0.97** |
| Single reveal duration | **900ms** |
| Stagger | **25ms** |
| Ambient parallax | **8px** |
| Breathing amplitude | **~1px** |
| Ken Burns end scale | **1.04** |
| Nav slide offset | **~8%** |
| Dominant color tint | **3–5%** |
| Chrome auto-hide | **~2s** idle |

### Forbidden

- Bounce / elastic showmanship  
- Particles, explosions, glitter  
- Large camera swings / 3D flips  
- Cubes, page-turn wipes, rotating galleries  
- Infinite decorative loops  
- Layout-shifting reveals (geometry must be reserved first)  
- Motion that blocks interaction  
- UI / click / hover / slideshow **sounds** (see Experience — Audio)

---

## Reduced motion

When `prefers-reduced-motion: reduce` (or equivalent user setting):

| Feature | Behaviour |
|---|---|
| Gallery wave | Instant or short opacity only; no translate/rotate/scale dance |
| Hover elevation | Opacity/brightness only; no scale/shadow animation (or minimal) |
| Ambient parallax | **Off** |
| Breathing | **Off** |
| Ken Burns | **Off** (static crossfade or cut) |
| Shared-element open/close | Short opacity crossfade; optional abbreviated FLIP |
| Nav slide-fade | Opacity crossfade only |
| Counter digits | Instant swap or very short fade |
| Toolbar / chrome | Short opacity |
| Dominant tint | Still apply (not motion) |

State must never depend on motion alone — counters, labels, focus, and `aria-live` always communicate.

---

## Ownership

| Concern | Document |
|---|---|
| Tokens & rules | **This file** |
| Per-interaction sequences | [ANIMATION_SPEC.md](./ANIMATION_SPEC.md) |
| Catalogue of triggers | [INTERACTION_INVENTORY.md](./INTERACTION_INVENTORY.md) |
| Why these choices | [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) |
