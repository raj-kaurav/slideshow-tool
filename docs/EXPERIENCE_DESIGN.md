# Experience Design

> Emotional and interaction source of truth — **not** engineering.  
> Visual system: [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md)  
> Motion language: [MOTION_SYSTEM.md](./MOTION_SYSTEM.md)  
> Why we chose this: [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)  
> How it is built: [ARCHITECTURE.md](./ARCHITECTURE.md)

**The interface should disappear. The photographs should remain in memory.**

---

## Design philosophy

Gallery Experience is a **photography application** — closer to Apple Photos, Lightroom, Arc, Linear, and Raycast than to a portfolio or agency site.

| We are | We are not |
|---|---|
| A calm place to view photographs | A creative agency website |
| A dark room for images | A portfolio landing page |
| An invisible interface | A dashboard or CMS |
| Editorial and timeless | A file explorer |
| Motion in service of orientation | A marketing or WebGL demo |

Principles: calm, cinematic, minimal, premium, photography-first, invisible interface, spatial continuity, motion with purpose, immediately interactive, owned environment (subtle color tint).

### References

**Embrace:** Apple Photos, Adobe Lightroom, Arc Browser, Linear, Raycast, Notion Calendar, premium editorial photography books, Scandinavian editorial design.

**Avoid:** Creative agency portfolios, gaming sites, heavy WebGL showcases, dashboard/CMS patterns, trendy effects that date quickly.

---

## Emotional journey

| Stage | Feeling | What the product does |
|---|---|---|
| **Arrival** | “I’m here to explore photographs.” | Open onto title + wall — no marketing gate |
| **Curiosity** | Soft wonder as the collection appears | Wave assemble; reserved, calm |
| **Discovery** | Browsing without friction | Scroll, hover elevation, deferred chrome |
| **Immersion** | Entering a room owned by one image | Shared-element open; tinted dark room |
| **Focus** | Looking, not managing | Hidden chrome; precise zoom; quiet nav |
| **Reflection** | Optional context | Metadata only when asked; editorial empty states |
| **Completion** | Leaving with images, not UI | Reverse close; position remembered |

Users should leave remembering **photographs**, not controls or motion.

---

## Interaction philosophy

How interactions should *feel* (never how they are coded):

- **Responsive** — The wall never feels locked behind animation  
- **Quiet** — Feedback is whispered (hover, counters, tints)  
- **Oriented** — You always know where you came from  
- **Tactile** — Zoom and pan feel physical, not floaty  
- **Respectful** — Chrome appears when useful, vanishes when not  
- **Silent** — No UI sounds compete with looking  

If an interaction makes someone remember the *effect*, simplify it.

---

## Home experience

The gallery **is** the homepage.

```text
Gallery Experience
Landscapes of India
248 Photographs · Captured 2021–2026

□□□□□□□□□□□□□□□□□□□□□□
□□□□□□□□□□□□□□□□□□□□□□
```

- Product title and editorial collection meta sit above the wall  
- The gallery begins assembling immediately  
- No Explore button, no Space-to-start gate  
- The reveal *is* the welcome  

### Collection personality

Optional editorial fields: collection title, location, date range, photographer. Omit missing fields — never show empty labels.

---

## Gallery reveal & browsing behaviour

### Reveal

Geometry first → reserved placeholders → priority organic wave (larger/hero earlier). Feeling: **the gallery assembled itself.**

### Immediately interactive

Visible images are clickable during the wave. Interaction never waits for animation to finish.

### Scrolling

Smooth, calm, Lenis-assisted. Scrolling may reveal the deferred toolbar. Position should feel restorable when returning from the viewer.

### Hover

Slight elevation in the depth stack (background → plane → hovered photo → viewer). Filename optional. No overlays or floating buttons.

### Discovery

Search and sort exist but stay out of the first glance. Favorites are personal and local.

### Returning to a previous image

Closing the viewer returns to the same cell. Last viewed and scroll memory support re-entry without disorientation.

### Ambient life

After settle: pointer parallax (floating paper, 3–8px) and nearly invisible breathing (~1px / 8–12s). Not decoration — anti-freeze.

### Deferred toolbar

Initially almost empty chrome. Toolbar fades in after scroll, interaction, search shortcut, or top-area hover.

---

## Viewer behaviour

### Dark room

Charcoal base — not pure black. Optional vignette/grain at very low opacity. **Dominant-color tint (~3–5%)** so each photograph owns its environment (snow→cool, forest→muted green, ocean→navy, sunset→warm graphite).

### Attention

Opening: background darkens, wall desaturates, selected stays full color, image expands. Not a popup — a mode change.

### Navigation

Minimal chrome: bottom Prev · Counter · Next; top Download · Info · Close. Auto-hide ~2s; return on movement. Digits animate subtly. Manual transitions are Netflix-subtle (±8% slide-fade).

### Closing & returning

Reverse expand to the original cell; restore scroll; preserve orientation. Never hard-cut.

---

## Slideshow behaviour

Emotionally: a **premium digital exhibition**.

- Cursor and chrome fade away  
- Only photographs remain  
- Crossfade + optional Ken Burns (100%→~104%)  
- Movement immediately restores controls  
- No cubes, flips, or showy wipes  

Photography carries the emotion.

---

## Zoom philosophy

| Input | Behaviour |
|---|---|
| Mouse wheel / trackpad | Zoom toward cursor (viewer) |
| Pinch | Zoom toward gesture center |
| Double click / double tap | Toggle fit ↔ magnified |
| Fit (`0`) | Entire image visible |
| 100% / actual (`1`) | Native pixels |
| Reset | Return to default fit |
| Pan | Drag only when magnified beyond fit |
| Limits | Min = fit (or slightly under); max = sensible cap (e.g. 4–8×) to protect memory/feel |
| Animation | Interactive follow; programmatic Fit/100% ease briefly |

Zoom should feel like Lightroom precision — not elastic rubber-banding.

---

## Search philosophy

V1: instant filename filter, debounced, client-only.

**Long-term fields (conceptual):** filename, collection, photographer, location, date, keywords, favorites.

Search stays calm: no flashing results panels; wall filters in place; empty results are editorial, not errors.

---

## Empty states

Each should feel **intentional**, not broken.

| State | Tone |
|---|---|
| Empty gallery | “Add photographs to `gallery/` to begin.” Quiet invitation |
| No search results | “No photographs match.” Offer clear |
| No favorites | “Star photographs to collect them here.” |
| No metadata | Sidebar simply does not appear |
| Offline / unavailable (future) | Calm notice; cached viewing if possible |

Typography-led. No bouncing empty illustrations.

---

## Error states

Graceful degradation — keep the dark room calm.

| Failure | Behaviour |
|---|---|
| Broken / missing image | Quiet cell placeholder; optional retry |
| Decode failure | Same; do not infinite-loop decode |
| Missing metadata | Hide sidebar / fields |
| Missing manifest | Clear recovery copy (regenerate / check folder) |
| Corrupt image | Skip-friendly placeholder; nav still works |
| Unexpected load failure | Non-alarm inline message |
| Network failure (future) | Degrade to cache; explain without panic |

Never turn the product into a red error dashboard.

---

## Audio philosophy

The application intentionally includes:

- **No** UI sounds  
- **No** click sounds  
- **No** hover sounds  
- **No** slideshow sounds  

Photography remains silent.

---

## Progressive enhancement (experience levels)

The product stays useful at every level:

| Level | Experience |
|---|---|
| **0** | Core gallery + open/close + nav |
| **1** | Motion (reveal, shared element, chrome) |
| **2** | Ambient parallax |
| **3** | Dominant-color tint |
| **4** | Blur-up / progressive loading polish |
| **5** | Future enhancements |

Higher levels must not be required for viewing photographs. Reduced motion maps toward lower motion levels.

Engineering mapping: [ARCHITECTURE.md](./ARCHITECTURE.md#progressive-enhancement).

---

## Future experience ideas

Conceptual only — **do not design or build here**:

- Richer collection storytelling between albums  
- Timeline or map-shaped browsing moods  
- Presentation / critique mode for clients  
- Print-oriented review layout  
- Deeper “remembering” across sessions  

Roadmap modules: [ARCHITECTURE.md](./ARCHITECTURE.md#future-product-roadmap).

---

## Accessibility (experience)

- Keyboard-first paths for every critical action  
- Focus always visible  
- Motion never required to understand state  
- Screen readers get filenames, counts, and control names  

Detailed engineering a11y: [ARCHITECTURE.md](./ARCHITECTURE.md#accessibility).
