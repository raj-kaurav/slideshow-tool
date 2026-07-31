# Roadmap

> Future product direction — **features, goals, dependencies, non-goals**.  
> No implementation detail. Engineering plans live in Architecture / Playbook.

Principles: [PROJECT_PRINCIPLES.md](./PROJECT_PRINCIPLES.md)

---

## V1

**Goal:** A production-quality offline photography viewing application with Gallery-first home, Wave Reveal, Dark Room Viewer, and exhibition Slideshow.

**Progress:** Phases 1–2 complete; Phase **3A–3B** complete (layout engine + virtualized wall). Phase 3C+ pending — see [IMPLEMENTATION_PLAYBOOK.md](./IMPLEMENTATION_PLAYBOOK.md).

### Features

- Justified Gallery + priority Wave Reveal + virtualization  
- Collection Header with editorial personality fields  
- Deferred Toolbar (search filename, sort, favorites)  
- Shared Element Viewer with Dominant Tint and auto-hide Chrome  
- Nav (keyboard / wheel / swipe), animated Counter, N±1 preload  
- Zoom / pan / fit / actual  
- Slideshow with optional Ken Burns  
- Download original; Metadata sidebar (EXIF when present)  
- Ambient parallax + Breathing  
- Persistence: favorites, settings, last viewed, scroll  

### Dependencies

- Local `public/gallery/` + manifest plugin  
- Docs system complete before/alongside implementation  

### Non-goals (V1)

- Accounts, cloud sync, CMS, upload UI  
- Three.js / WebGL heroes  
- UI audio  
- Landing / Explore gates  
- Server-side image transcoding  
- AI search  

---

## V1.1

**Goal:** Harden craft and expand calm utilities without changing product identity.

### Features (candidate)

- Stronger progressive / responsive image pipeline (`srcset`)  
- Richer search fields already in manifest/meta (date, photographer) when available  
- Improved empty/error copy localization readiness  
- Visual regression baselines  
- Presentation refinements (counter, tint caching)  

### Dependencies

- V1 stable; Testing Strategy CI basics  

### Non-goals

- Social features; marketplace; editing suite  

---

## V2

**Goal:** Multi-collection organization while remaining offline-first by default.

### Features (candidate)

- Collections / Albums as first-class groupings  
- Timeline browsing mood  
- Presentation Mode for clients  
- Optional map view when GPS exists  
- Print-oriented review layout  

### Dependencies

- Manifest schema versioning; clearer Collection model in Glossary/Architecture  
- Performance budgets revalidated for multi-collection  

### Non-goals

- Mandatory cloud accounts  
- Heavy destructive editing (RAW develop)  

---

## Future ideas

Conceptual only — not scheduled:

- AI / colour / face search  
- Cloud sync (optional)  
- Printing integrations  
- Advanced editing  
- True 3D hero experiments (only if DOM approach fails a documented need)

Each idea must pass Project Principles before entering V2+ planning.

---

## Roadmap hygiene

- Moving an item between versions requires updating this file in the same PR as the decision  
- Do not put API sketches or file lists here  
- Reject novelty that conflicts with Invisible Interface or Offline First unless Decision Log records an exception  
