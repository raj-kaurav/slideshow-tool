# Experience Design

> **The interface should disappear. The photographs should remain in memory.**

This document defines the emotional and interaction experience for Gallery Experience. It is not engineering documentation. Every future interaction should be measured against the principle above.

Companion document: [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md)

---

## Design philosophy

Gallery Experience is a **photography application** — closer to Apple Photos, Lightroom, Arc, Linear, and Raycast than to a portfolio site or agency showcase.

| We are | We are not |
|---|---|
| A calm place to view photographs | A creative agency website |
| A dark-room for images | A portfolio landing page |
| An invisible interface | A dashboard or CMS |
| Editorial and timeless | A file explorer |
| Motion in service of orientation | A marketing website or WebGL demo |

### Principles

- **Calm** — Quiet surfaces; no visual noise; generous whitespace
- **Cinematic** — Dark-room viewing; spatial continuity; restrained motion
- **Minimal** — Less UI; chrome only when needed
- **Premium** — Craft in typography, spacing, easing — never decoration
- **Photography-first** — Photographs are the product
- **Invisible Interface** — Controls appear only when useful
- **Spatial Continuity** — Open/close preserves where the image lived
- **Motion with Purpose** — Animation explains origin, destination, or emotion — never spectacle
- **Immediately Interactive** — Animation never blocks interaction

---

## Design references

**Embrace**

- Apple Photos
- Adobe Lightroom
- Arc Browser
- Linear
- Raycast
- Notion Calendar
- Premium editorial photography books
- Scandinavian editorial design

**Avoid**

- Creative agency portfolios
- Gaming websites
- Heavy WebGL showcases
- Dashboard / CMS / file-manager patterns
- Trendy effects that date quickly

The product should feel **timeless rather than trendy**.

---

## Emotional journey

```text
Arrive          →  “I’m here to explore photographs.”
Wall assembles  →  Quiet wonder; collection reveals itself
Browse          →  Calm focus; interface stays out of the way
Hover           →  Gentle elevation; photograph asks for attention
Enter viewer    →  Enter a dark room owned by this image
Navigate        →  Orientation without distraction
Slideshow       →  Digital exhibition; only light and photographs
Return          →  Back to the wall, exactly where you left
```

Users should leave remembering **images**, not chrome or motion.

---

## Home experience (no landing gate)

The gallery **is** the homepage.

```text
Gallery Experience
Landscapes of India
248 Photographs · Captured 2021–2026

□□□□□□□□□□□□□□□□□□□□□□
□□□□□□□□□□□□□□□□□□□□□□
□□□□□□□□□□□□□□□□□□□□□□
```

- Large title and editorial collection metadata sit **above** the wall
- The gallery begins assembling **immediately**
- No Explore button, no Space-to-start, no explicit gate
- The reveal itself is the welcome

Feeling: opening a photography app — not arriving at a marketing page.

### Collection personality

Metadata should feel editorial and optional:

- Collection title (e.g. Landscapes of India)
- Location
- Date range (e.g. Captured 2021–2026)
- Photographer

Keep it subtle. If a field is absent, omit it — never show empty labels.

---

## Gallery reveal

1. Calculate justified geometry first
2. Render reserved placeholders (final positions locked — zero layout shift)
3. Images populate placeholders in a progressive wave
4. Feeling: **“The gallery assembled itself.”**

### Wave algorithm (intentional, not random)

Reveal priority:

- Larger photographs slightly earlier
- Hero / visually dominant images first
- Smaller images fill remaining gaps naturally

Avoid left-to-right, top-to-bottom, and pure randomness. The spread should feel balanced and organic.

Per image: fade, translate 20–40px, scale from ~0.97, rotation ≤5°, spring into rest. Full assemble ~1.5s. Stagger 15–25ms.

### Immediately interactive

**Animation never blocks interaction.**

1. Geometry calculated  
2. Placeholders rendered  
3. User can already interact  
4. Wave reveal continues independently  

Any image that has appeared is immediately clickable. Interaction must never wait for the timeline to finish.

---

## Browsing behaviour

After settle:

- **Ambient parallax** — Pointer shifts the plane ~3–8px; nearer images respond more (floating paper, not chase). Stops when pointer leaves.
- **Breathing** — Every 8–12s, ~1px movement and a barely perceptible brightness shift. The user should not consciously notice it; it only prevents a frozen feel. Not floating animation — visual life.
- **Toolbar** — Initial UI is almost empty (title + collection meta only). Toolbar (search, sort, favorites) fades in after scroll, interaction, search shortcut, or hovering the top area.

Attention stays on photography.

---

## Hover behaviour

Depth hierarchy:

```text
Background
  → Gallery Plane
    → Hovered Photograph
      → Fullscreen Viewer
```

Hovered images elevate slightly above neighbors:

- Scale ≈ 1.02
- Slight brightness increase
- Soft shadow (enough to read elevation, never dramatic)
- Optional filename only

No overlays, floating buttons, or large labels. The photograph remains the focus.

---

## Opening transition (hero interaction)

Not a modal — a change of viewing mode:

1. Background gently darkens  
2. Gallery slightly desaturates  
3. Selected image retains full color  
4. Image expands from its exact cell (shared element)  
5. Dark-room viewer settles in  

Guides attention without drama. Spatial continuity preserved.

---

## Viewer behaviour (dark room)

- Dark charcoal base, not absolute black
- **Dominant-color tint (~3–5%)** sampled from the photograph — core principle, not optional polish  
  - Snow → cool charcoal  
  - Forest → muted green  
  - Ocean → deep navy  
  - Sunset → warm graphite  
- Optional vignette / fine grain at very low opacity
- Each photograph owns its environment

### Chrome

Extremely minimal; auto-hides ~2s; returns on movement:

- **Bottom center:** Previous · Counter · Next  
- **Top right:** Download · Info · Close  

### Counter

Digits animate individually (`020` → `021`) — subtle premium polish, never a flip-clock spectacle.

### Navigation philosophy

- Keyboard, wheel, swipe, touch — all first-class
- Manual transitions: current slides ~8% while fading; next arrives from the opposite side (Netflix-subtle)
- Preload only N±1
- Zoom/pan feel tactile and precise, like Lightroom

### Closing

Reverse of opening: image returns to its cell; scroll restored; never a hard cut.

---

## Slideshow philosophy

A premium digital exhibition:

- Cursor fades away
- Chrome fades away
- Only photographs remain
- Subtle Ken Burns (100% → ~104%) continues
- Controls return immediately on movement

Crossfade only. No cubes, page flips, or rotating galleries. Photography carries the emotion.

---

## Motion principles

Motion exists for **navigation, orientation, and emotion**.

| Allowed | Forbidden |
|---|---|
| Spatial continuity | Bounce / elastic showmanship |
| Invisible guidance | Particles, explosions |
| Short, purposeful springs | Large camera swings |
| Micro slide-fades | Infinite looping decoration |
| Almost-imperceptible breathing | Layout-shifting reveals |

If the user notices the motion more than the photograph, it failed.

See [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md) for numeric motion tokens.

---

## Accessibility motion rules

When `prefers-reduced-motion: reduce`:

- Skip wave rotation, ambient parallax, breathing, and Ken Burns
- Use short opacity fades or instant state changes
- Keep shared-element open/close as a short fade if full FLIP is too much
- Never rely on motion alone to convey state — counters, labels, and focus still communicate

Keyboard and screen-reader paths remain complete regardless of motion preference.

---

## Future premium enhancements

Optional later — do not block the core experience:

- Scroll position memory (beyond V1 baseline)
- Deeper “Preparing Collection” calm loading narrative
- Stronger progressive decoding / multi-resolution pyramids
- Skip-landing preferences (not needed — there is no gate)
- Sound toggle (explicitly out of V1 unless requested)
- True 3D hero (Three.js) — only if a future product need requires it; app stays DOM-based

Every enhancement must still reinforce:

> The interface should disappear. The photographs should remain in memory.
