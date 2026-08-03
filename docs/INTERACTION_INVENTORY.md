# Interaction Inventory

> Master catalogue of user interactions.  
> Animation detail: [ANIMATION_SPEC.md](./ANIMATION_SPEC.md)  
> Motion tokens: [MOTION_SYSTEM.md](./MOTION_SYSTEM.md)  
> Experience intent: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md)

| Name | Trigger | Duration | Motion | Purpose | Accessibility | Implementation notes |
|---|---|---|---|---|---|---|
| **Gallery reveal** | Home ready + geometry | ~1.5s assemble | Priority wave into placeholders | Welcome via photographs | Reduced → opacity/instant; interactive early | GSAP; see Animation Spec |
| **Card hover** | Pointer / focus | `motion.hover` | Scale 1.02 + brightness + shadow | Depth affordance | Focus-visible same | Framer/CSS; no overlays |
| **Open image** | Click / Enter / Space on card | `motion.viewerExpand` | Desaturate wall + shared expand + tint | Enter dark room | Dialog focus trap | Framer shared element |
| **Close viewer** | Esc / Close | `motion.viewerClose` | Reverse FLIP + restore scroll | Return with continuity | Focus restore to card | Must not hard-cut |
| **Prev / Next** | Buttons, ←/→, wheel, swipe | `motion.normal` | ±8% slide-fade + tint ease | Navigate collection | Live region index | Preload N±1 |
| **Toolbar show** | Scroll / interact / shortcut / top hover | `motion.toolbar` | Fade + 8px rise | Reveal utilities late | Shortcut focuses search | `useDeferredToolbar` |
| **Search filter** | Input (debounced) | Debounce 150–200ms | Fast opacity reflow | Find by text | Results count live | Client-only filter |
| **Sort change** | Sort control | `motion.fast` | Reflow wall | Order collection | Announce sort | Recompute justified |
| **Favorites toggle** | Control / `F` | `motion.fast` | Icon state | Local bookmark | `aria-pressed` | `localStorage` |
| **Favorites filter** | Toolbar toggle | `motion.fast` | Filter wall | Show starred only | Empty state if none | Derived list |
| **Info sidebar** | Info / `I` | `motion.normal` | Slide panel | Show EXIF/file | Esc closes panel first | Lazy `exifr` |
| **Download** | Download control | — | None / instant feedback | Original file | Label “Download original” | Anchor/`blob` no recompress |
| **Slideshow play** | Play / Space | Chrome `motion.chromeFade` | Hide chrome+cursor; crossfade | Exhibition mode | Pause on control focus | `useSlideshow` |
| **Slideshow pause** | Pause / Space / move optional | Fast | Chrome may return | Regain control | Clear playing state | Clear interval |
| **Ken Burns** | Option while playing | = interval | Scale 1→1.04 | Gentle life | Off if reduced motion | GSAP/CSS on stage |
| **Chrome auto-hide** | Idle ~2s in viewer | `motion.chromeFade` | Opacity out | Invisible UI | Returns on move/focus | `useAutoHideUI` |
| **Chrome show** | Pointer move / focus | `motion.chromeFade` | Opacity in | Recover controls | Keyboard always reachable | Reset idle timer |
| **Zoom in/out** | Wheel / pinch / `+` `-` | Interactive | Focal scale | Inspect detail | Announce optional | `ZoomStage` |
| **Zoom fit** | Control / `0` | `motion.normal` | Animate to fit | See whole image | — | Reset pan |
| **Zoom 100%** | Control / `1` | `motion.normal` | Animate to actual | True pixels | — | May exceed viewport |
| **Double-click zoom** | Dblclick / dbltap | Fast | Toggle fit ↔ zoomed | Quick inspect | — | Focal point aware |
| **Pan** | Drag when zoomed | Interactive | Translate | Move while zoomed | — | Clamp to bounds |
| **Background mode** | Picker | `motion.normal` | Color/blur crossfade | Preference | — | Overrides tint if set |
| **Ambient parallax** | Pointer on wall | Continuous | ≤8px plane | Visual life | Off if reduced | GSAP/rAF |
| **Breathing** | Timer post-reveal | 8–12s period | ~1px + brightness | Anti-freeze | Off if reduced | GSAP |
| **Empty gallery** | Zero items | `motion.normal` | Soft copy in | Intentional empty | Textual | Empty component |
| **Empty search** | Zero hits | `motion.normal` | Soft copy in | Clarify filter | Live region | Offer clear |
| **Image error** | Decode/404 | `motion.fast` | Placeholder | Graceful degrade | Describe + retry | No infinite retry |
| **Manifest missing** | Load fail | — | Page empty/error | Recover path | Alert/status | Show regenerate hint |

---

## Coverage rule

New interactions must add a row here **and** a section in [ANIMATION_SPEC.md](./ANIMATION_SPEC.md) when motion is involved **and** a decision entry if product intent is non-obvious.
