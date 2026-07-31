# Animation Spec

> Exact animation specifications per interaction.  
> Tokens & rules: [MOTION_SYSTEM.md](./MOTION_SYSTEM.md)  
> Triggers catalogue: [INTERACTION_INVENTORY.md](./INTERACTION_INVENTORY.md)  
> Experience intent: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md)

Durations and easings reference **motion / ease tokens** — never invent one-off timings in components.

---

## Gallery Reveal

| Field | Spec |
|---|---|
| **Purpose** | Assemble the wall so the collection feels present, not “animated in” |
| **Trigger** | Home mount after justified geometry is computed |
| **Sequence** | (1) Lock placeholders (2) Priority wave order (larger/hero first) (3) Per cell: opacity 0→1, y +20–40px→0, scale 0.97→1, rotate ≤5°→0 (4) Settle |
| **Duration** | Cell `motion.revealCell` (≤900ms); assemble `motion.assemble` (~1.5s); stagger `motion.stagger` |
| **Easing** | `ease.reveal` |
| **Affected** | `ImageCard` contents inside reserved boxes; layout boxes do not move |
| **A11y** | Reduced motion → opacity only / instant; cards interactive as soon as visible |

**Implementation:** GSAP timeline over precomputed cells. Do not await completion before enabling pointer events.

---

## Hover (ImageCard)

| Field | Spec |
|---|---|
| **Purpose** | Whisper elevation in the depth stack |
| **Trigger** | Pointer enter / focus-visible |
| **Sequence** | Scale → 1.02; slight brightness ↑; soft shadow; optional filename fade-in |
| **Duration** | `motion.hover` |
| **Easing** | `ease.hover` |
| **Affected** | Single card transform + filter; siblings unchanged |
| **A11y** | Keyboard focus same elevation; reduced motion → brightness/filename only |

No overlays, badges, or action buttons on hover.

---

## Toolbar Reveal

| Field | Spec |
|---|---|
| **Purpose** | Offer search/sort/favorites only after attention is on the wall |
| **Trigger** | Scroll past threshold, any gallery interaction, search shortcut, or top-region hover |
| **Sequence** | Opacity 0→1 + translateY −8px→0; reverse on long idle optional (V1: stay once shown in session) |
| **Duration** | `motion.toolbar` |
| **Easing** | `ease.entrance` / `ease.exit` |
| **Affected** | `GalleryToolbar` |
| **A11y** | Shortcut always focuses search even if toolbar was hidden (reveal + focus) |

---

## Open Viewer

| Field | Spec |
|---|---|
| **Purpose** | Enter dark-room mode with spatial continuity |
| **Trigger** | Activate image (click / Enter / Space on focused card) |
| **Sequence** | (1) Scrim darkens (2) Wall desaturates ~30–50% (3) Selected keeps full color (4) Shared-element expand to viewer (5) Dominant tint mixes 3–5% into charcoal (6) Chrome visible then auto-hide clock starts |
| **Duration** | `motion.viewerExpand` |
| **Easing** | `ease.shared` |
| **Affected** | Selected `ImageCard` ↔ `ExpandingImage`, wall layer, `BackgroundLayer`, chrome |
| **A11y** | Focus moves into dialog; `aria-modal`; reduced motion → short fade |

---

## Close Viewer

| Field | Spec |
|---|---|
| **Purpose** | Return to the exact cell and scroll context |
| **Trigger** | Escape, Close control, or equivalent |
| **Sequence** | Reverse of open: image FLIP to cell; wall re-saturates; scrim clears; restore scroll; focus returns to card |
| **Duration** | `motion.viewerClose` |
| **Easing** | `ease.shared` |
| **Affected** | Same as open |
| **A11y** | Focus restore mandatory; reduced motion → short fade |

Never hard-cut to the wall.

---

## Image Navigation

| Field | Spec |
|---|---|
| **Purpose** | Move between photographs without losing orientation |
| **Trigger** | Prev/Next, ←/→, wheel (viewer), swipe |
| **Sequence** | Outgoing: translateX ~±8% + fade out; Incoming: from opposite ±8% + fade in; tint eases toward new dominant color; counter digits animate |
| **Duration** | `motion.normal` (tint may use `motion.slow`) |
| **Easing** | `ease.standard` |
| **Affected** | Stage images, tint layer, counter |
| **A11y** | `aria-live` announces index; reduced motion → crossfade only |

Preload N±1 only (see Architecture — Image loading).

---

## Slideshow

| Field | Spec |
|---|---|
| **Purpose** | Digital exhibition — photographs alone |
| **Trigger** | Play control or Space in viewer |
| **Sequence** | Cursor + chrome fade out; crossfade to next; optional Ken Burns 1→1.04 over interval; on pointer/key — chrome + cursor return immediately |
| **Duration** | Crossfade `motion.slideshow`; interval user-selected (2/3/5/10s) |
| **Easing** | `ease.slideshow` |
| **Affected** | Stage, chrome, cursor, progress |
| **A11y** | Pause on focus into controls; reduced motion → static crossfade, no Ken Burns |

---

## Counter Animation

| Field | Spec |
|---|---|
| **Purpose** | Premium index change without spectacle |
| **Trigger** | Current index change |
| **Sequence** | Each differing digit fades/slides ~4–8px; unchanged digits stay |
| **Duration** | `motion.counter` |
| **Easing** | `ease.standard` |
| **Affected** | `AnimatedCounter` digit slots |
| **A11y** | Live region speaks full “Image N of M”; reduced motion → instant replace |

---

## Zoom

| Field | Spec |
|---|---|
| **Purpose** | Inspect detail; stay tactile and precise |
| **Trigger** | Wheel, trackpad pinch, touch pinch, double-click/tap, Fit / 100% / Reset controls |
| **Sequence** | Scale around focal point; pan when scale > fit; settle with light damping; Fit/100%/Reset animate to target transform |
| **Duration** | Interactive: follow pointer; programmatic Fit/Reset `motion.normal`–`motion.slow` |
| **Easing** | `ease.hover` / `ease.standard` |
| **Affected** | `ZoomStage` transform |
| **A11y** | Keyboard `+` `-` `0` `1`; announce mode when changed; respect reduced motion with shorter settles |

Limits and philosophy: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md#zoom-philosophy).

---

## Metadata Sidebar

| Field | Spec |
|---|---|
| **Purpose** | Reveal EXIF/file info without stealing the image |
| **Trigger** | Info control or `I` |
| **Sequence** | Panel slides from edge; optional dim on opposite side; hide entirely if no metadata |
| **Duration** | `motion.normal` |
| **Easing** | `ease.entrance` / `ease.exit` |
| **Affected** | `MetaSidebar`, optional scrim |
| **A11y** | Focus trap optional within panel; Escape closes panel first if open |

---

## Favorites

| Field | Spec |
|---|---|
| **Purpose** | Quiet local bookmark |
| **Trigger** | Favorite control or `F` |
| **Sequence** | Icon state morph / opacity; no confetti; list filter updates without layout explosion |
| **Duration** | `motion.fast` |
| **Easing** | `ease.standard` |
| **Affected** | Icon, favorites set, optional wall filter |
| **A11y** | Pressed state `aria-pressed`; announce added/removed |

---

## Search

| Field | Spec |
|---|---|
| **Purpose** | Instant local filter without breaking calm |
| **Trigger** | Type in search; shortcut reveals toolbar + focuses field |
| **Sequence** | Debounced filter; wall reflows via reserved justified recompute; exiting cards opacity out (`motion.fast`); entering use short opacity (no full wave unless empty→full) |
| **Duration** | Debounce ~150–200ms; item fade `motion.fast` |
| **Easing** | `ease.standard` |
| **Affected** | Query state, justified layout, cards |
| **A11y** | Results count in live region; empty state copy |

Philosophy: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md#search-philosophy).

---

## Loading

| Field | Spec |
|---|---|
| **Purpose** | Calm waiting without spinners as the hero |
| **Trigger** | Manifest load, image decode, preparing collection |
| **Sequence** | Skeleton / blur-up in reserved boxes; progressive decode; optional quiet “Preparing collection” line |
| **Duration** | Tied to network/decode — motion only for fade-in `motion.fast`–`motion.normal` |
| **Easing** | `ease.entrance` |
| **Affected** | Skeletons, `ImageCard` img |
| **A11y** | `aria-busy` on regions; no infinite decorative motion |

---

## Empty State

| Field | Spec |
|---|---|
| **Purpose** | Intentional quiet, not an error scream |
| **Trigger** | Zero images, zero search hits, zero favorites |
| **Sequence** | Soft fade of editorial empty copy; no bouncing illustrations |
| **Duration** | `motion.normal` |
| **Easing** | `ease.entrance` |
| **Affected** | Empty state view |
| **A11y** | Textual explanation always present |

Copy guidance: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md#empty-states).

---

## Error State

| Field | Spec |
|---|---|
| **Purpose** | Graceful degradation; keep the room calm |
| **Trigger** | Broken image, decode fail, missing manifest, corrupt file |
| **Sequence** | Replace cell with quiet placeholder; optional retry; no red alarm chrome |
| **Duration** | `motion.fast` |
| **Easing** | `ease.standard` |
| **Affected** | Failed card / global banner if manifest missing |
| **A11y** | Describe failure in text; retry focusable |

Details: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md#error-states).

---

## Ambient Parallax

| Field | Spec |
|---|---|
| **Purpose** | Floating-paper life while browsing |
| **Trigger** | Pointer move over wall (desktop) |
| **Sequence** | Plane shifts ≤8px; nearer cards slightly more; stop on pointer leave |
| **Duration** | Continuous, heavily damped follow |
| **Easing** | Soft damp / `ease.hover` |
| **Affected** | Ambient layer under/around cards |
| **A11y** | Off under reduced motion and typically on touch-first |

---

## Breathing

| Field | Spec |
|---|---|
| **Purpose** | Prevent a frozen feel after settle |
| **Trigger** | After reveal complete; loops every 8–12s |
| **Sequence** | ~1px drift + tiny brightness pulse; user should not consciously notice |
| **Duration** | Period `motion.breathePeriod` |
| **Easing** | Sinusoidal / very soft |
| **Affected** | Gallery plane micro-transform / filter |
| **A11y** | Off under reduced motion |

---

## Wall Desaturate (open accompaniment)

Documented as part of **Open Viewer**; not a standalone user-facing interaction.
