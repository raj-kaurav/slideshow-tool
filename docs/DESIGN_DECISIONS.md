# Design Decisions

> Preserves product intent: what we chose, why, tradeoffs, and alternatives.  
> Not a changelog — update when a decision changes.

**Principle:** The interface should disappear. The photographs should remain in memory.

---

## Why the gallery is the homepage (no landing gate)

| | |
|---|---|
| **Decision** | Title + collection meta above an immediately assembling wall; no Explore / Space gate |
| **Reason** | Landing gates feel like portfolio marketing sites. A photography app should open onto photographs |
| **Tradeoffs** | Less “cinematic threshold”; reveal must carry the welcome |
| **Alternatives** | Full-viewport gate with Explore CTA; splash video; WebGL hero |

---

## Why deferred toolbar

| | |
|---|---|
| **Decision** | Search/sort/favorites fade in after scroll, interaction, shortcut, or top hover |
| **Reason** | First paint should feel empty of chrome so photographs dominate |
| **Tradeoffs** | Discoverability of sort/favorites slightly lower |
| **Alternatives** | Always-visible dashboard toolbar; hamburger drawer |

---

## Why justified layout (not masonry)

| | |
|---|---|
| **Decision** | Flickr-style justified rows with shared row height |
| **Reason** | Editorial, calm, orientation-agnostic; predictable virtualization by row; no ragged masonry noise |
| **Tradeoffs** | Less “pinterest” organic stacking; panoramas need special row targeting |
| **Alternatives** | CSS masonry, uniform grid, asymmetric collage, 3D wall |

---

## Why reserved placeholders before reveal

| | |
|---|---|
| **Decision** | Compute geometry first; animate content into locked boxes |
| **Reason** | Zero CLS; “assembled itself” feeling; enables immediate hit-testing |
| **Tradeoffs** | Empty boxes briefly visible as skeletons |
| **Alternatives** | Animate layout positions; masonry reflow during load |

---

## Why interaction never waits for animation

| | |
|---|---|
| **Decision** | Visible cards are activatable during wave reveal |
| **Reason** | Premium apps feel responsive; motion must not gate usefulness |
| **Tradeoffs** | Shared-element may start mid-reveal |
| **Alternatives** | Disable pointer until timeline completes |

---

## Why subtle hover (≤1.02 scale)

| | |
|---|---|
| **Decision** | Slight scale, brightness, soft shadow, optional filename only |
| **Reason** | Elevation in depth stack without overlays stealing the photo |
| **Tradeoffs** | Weaker “clickability” affordance for some users (mitigate with focus rings + cursor) |
| **Alternatives** | Overlay buttons, large captions, colored borders |

---

## Why shared-element open/close

| | |
|---|---|
| **Decision** | FLIP / shared `layoutId` from cell ↔ viewer |
| **Reason** | Spatial continuity — Apple Photos / Lightroom-like mode change, not a modal popup |
| **Tradeoffs** | Implementation complexity; virtualization must keep source cell identity |
| **Alternatives** | Center fade modal; route transition; full-screen cut |

---

## Why dark charcoal (not pure black)

| | |
|---|---|
| **Decision** | Viewer/app base ~`#0e0e0e`–`#141414` |
| **Reason** | Pure black crushes shadow detail and feels harsh; charcoal reads as a dark room |
| **Tradeoffs** | Slightly less “OLED pure” aesthetic |
| **Alternatives** | `#000`, lightroom-gray only, always-light UI |

---

## Why dominant-color tint is core (3–5%)

| | |
|---|---|
| **Decision** | Sample image color and tint viewer background subtly on open/nav |
| **Reason** | Each photograph owns its environment without decorative gradients |
| **Tradeoffs** | Sampling cost; must not flash or oversaturate |
| **Alternatives** | Fixed charcoal only; strong color wash; blurred image fill as default |

---

## Why Framer Motion + GSAP (+ Lenis)

| | |
|---|---|
| **Decision** | Framer for React shared-element/UI; GSAP for wave/ambient timelines; Lenis for smooth scroll |
| **Reason** | Clear responsibility split; avoid forcing one tool to do everything poorly |
| **Tradeoffs** | Two animation libs in bundle — must tree-shake and scope usage |
| **Alternatives** | Framer-only; GSAP-only; CSS-only; WAAPI-only |

---

## Why Tailwind CSS v4 (no `tailwind.config.ts`)

| | |
|---|---|
| **Decision** | Tailwind v4 with `@tailwindcss/vite`; tokens live in `src/styles/tokens.css` + `@theme` in `globals.css` |
| **Reason** | Matches current Vite scaffold; keeps design tokens in CSS (Visual Language) without a parallel JS config |
| **Tradeoffs** | Contributors familiar with v3 config files need a short adjustment |
| **Alternatives** | Tailwind v3 + `tailwind.config.ts` |

---

## Why oxlint (not ESLint)

| | |
|---|---|
| **Decision** | Use **oxlint** from the Vite React-TS template; Prettier for formatting |
| **Reason** | Fast default from scaffold; sufficient for Phase 1 conventions |
| **Tradeoffs** | Different rule ecosystem than ESLint; may revisit if team needs ESLint plugins |
| **Alternatives** | ESLint + typescript-eslint flat config |

---

## Why `pages/HomePage.tsx` and `components/LenisRoot.tsx`

| | |
|---|---|
| **Decision** | Top-level screen in `src/pages/`; Lenis shell at `src/components/LenisRoot.tsx` (not under `cursor/`) |
| **Reason** | HomePage is a screen, not a brand/gallery widget; Lenis is app chrome, not cursor behaviour |
| **Tradeoffs** | Extra top-level folder (`pages/`) beyond the original nested-component-only sketch |
| **Alternatives** | `components/HomePage.tsx`; Lenis under `components/cursor/` |

---

## Why no Three.js / heavy WebGL in V1

| | |
|---|---|
| **Decision** | DOM-based application |
| **Reason** | Timeless photo app, not a trendy agency showcase; maintainability and a11y |
| **Tradeoffs** | No true 3D hero |
| **Alternatives** | Three.js image wall; WebGL transitions |

---

## Why no infinite decorative animation

| | |
|---|---|
| **Decision** | Forbid infinite showy loops; allow near-invisible breathing only |
| **Reason** | Motion must stay invisible; photography stays silent and calm |
| **Tradeoffs** | Less “alive” marketing energy |
| **Alternatives** | Continuous floating, particle fields, auto-rotating carousels |

---

## Why N±1 preload only

| | |
|---|---|
| **Decision** | Viewer preloads previous and next only |
| **Reason** | Memory-conscious for 100–1000+ large images |
| **Tradeoffs** | Fast skip-through may briefly wait |
| **Alternatives** | Preload ±5; preload entire album |

---

## Why local-only favorites / no accounts

| | |
|---|---|
| **Decision** | `localStorage` favorites; no login |
| **Reason** | Offline-first, zero backend, privacy-simple |
| **Tradeoffs** | No cross-device sync in V1 |
| **Alternatives** | Cloud accounts; file-sidecar favorites |

---

## Why silent product (no UI audio)

| | |
|---|---|
| **Decision** | No click, hover, or slideshow sounds |
| **Reason** | Photography experiences are contemplative; audio UI feels gadget-like |
| **Tradeoffs** | Misses some “delight” patterns from consumer apps |
| **Alternatives** | Optional sound pack; shutter clicks |

---

## Why virtualize by row

| | |
|---|---|
| **Decision** | `@tanstack/react-virtual` over justified rows |
| **Reason** | Matches layout unit; simpler than cell virtualization with variable widths |
| **Tradeoffs** | Entire row mounts together |
| **Alternatives** | Absolute cell windowing; no virtualization |

---

## Decision log hygiene

When reversing a decision: update this entry, note date/reason, and sync Experience / Motion / Architecture references — do not leave contradictory docs.
