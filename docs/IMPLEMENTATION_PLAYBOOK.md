# Implementation Playbook

> Guidance for implementing roadmap phases — **documentation only**, not application code.  
> Phases: [ARCHITECTURE.md](./ARCHITECTURE.md#implementation-phases) · Standards: [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)

Each phase below lists goals, success criteria, deliverables, common mistakes, review checklist, and expected commit shape.

---

## Phase 1 — Scaffold

| | |
|---|---|
| **Status** | **Complete** |
| **Goals** | Vite + React + TS + Tailwind v4 + Framer Motion + GSAP + Lenis; fonts; token CSS bridge; providers |
| **Success criteria** | App boots; tokens importable; Lenis scrolls a blank shell; strict TS on; typecheck/build pass |
| **Deliverables (as shipped)** | Repo-root Vite app; `src/styles/tokens.css` + `globals.css`; `@fontsource` fonts; `CursorProvider` / `GalleryProvider` / `ViewerProvider`; `components/LenisRoot.tsx`; `pages/HomePage.tsx` + `CollectionHeader`; UI primitives; oxlint + Prettier |
| **Common mistakes** | Adding Three.js; Inter font; skipping token file; giant `App.tsx`; inventing gallery/viewer stubs |
| **Review checklist** | Stack matches Architecture; Visual Language fonts; no forbidden libs |
| **Commits** | `chore: scaffold Phase 1 Vite React application` (+ prettier ignore) |

---

## Phase 2 — Manifest plugin

| | |
|---|---|
| **Status** | **Complete** |
| **Goals** | Scan `public/gallery`; emit manifest; types; sample images; collection meta fields |
| **Success criteria** | Adding a file regenerates manifest in dev; dimensions present; app can read JSON |
| **Deliverables (as shipped)** | `src/vite-plugins/galleryManifest.ts`; `public/gallery-manifest.json`; `public/gallery.json` collection meta; typed `GalleryManifest` / `GalleryItem`; `GalleryProvider` load + `reload`; sample PNGs; `npm run gallery:manifest` |
| **Common mistakes** | Runtime directory listing in the browser; blocking UI thread on huge sync scans without care |
| **Review checklist** | Offline; schema documented; Glossary terms (`Manifest`, `Photograph`) |
| **Commits** | Types/utils → plugin → context/HomePage → samples |

---

## Phase 3 — Justified wall + wave reveal

Split in practice:

### Phase 3A — Layout engine (geometry only)

| | |
|---|---|
| **Status** | **Complete** |
| **Goals** | Pure justified layout algorithm; types; validation; container-width breakpoints |
| **Deliverables** | `src/lib/justified.ts`, `layoutBreakpoints.ts`, `layoutMath.ts`, `layoutValidate.ts`, `types/layout.ts`; HomePage debug summary |
| **Non-goals** | ImageCard, virtualization, wave reveal, rendering wall |

### Phase 3B — Wall rendering

| | |
|---|---|
| **Status** | **Complete** |
| **Goals** | Render justified layout with row virtualization; reserved geometry; responsive recompute |
| **Deliverables** | `JustifiedGallery`, `GalleryRow`, `GalleryCell`; `@tanstack/react-virtual` window virtualizer |
| **Non-goals** | Wave reveal, hover, ImageCard interactions, blur-up, viewer, toolbar |
| **Success criteria** | Smooth scroll; ResizeObserver-driven layout; semantic list; typecheck/build pass |

### Phase 3C — Image loading & GalleryCell enhancement

| | |
|---|---|
| **Status** | **Complete** |
| **Goals** | Lazy load, skeleton, optional blur slot, opacity fade-in, error fallback; zero CLS |
| **Deliverables** | Enhanced `GalleryCell`, `GalleryCellFallback`, `useImageLoad`, `objectFit` helpers |
| **Non-goals** | Wave reveal, hover, viewer, toolbar, Framer/GSAP |
| **Success criteria** | Reserved geometry; lazy + async decode; reduced-motion instant show; typecheck/build pass |

### Phase 3D — Gallery experience (motion + ambient + polish)

| | |
|---|---|
| **Status** | **Complete** |
| **Goals** | Priority wave reveal; hover elevation; ambient parallax + breathing; visual polish |
| **Deliverables** | `ImageCard`, `waveOrder`, `galleryReveal`, `useGalleryReveal`, `useGalleryAmbient`; polished header/skeleton/bg |
| **Non-goals** | Viewer open, toolbar, search, favorites, slideshow, metadata |
| **Success criteria** | Assemble ~1.5s once; no replay on resize; reduced-motion path; typecheck/build pass |

---

## Phase 4 — Viewer entry & deferred toolbar

Split in practice:

### Phase 4A — Viewer entry & exit

| | |
|---|---|
| **Status** | **Complete** (+ visual quality pass) |
| **Goals** | Shared-element open/close; dark-room shell; scroll + focus restore; Escape |
| **Deliverables** | `FullscreenViewer`, `ExpandingImage`, `BackgroundLayer`, `ViewerChrome`, `AnimatedCounter`, `useAutoHideUI`, `useViewerNav`, `useImagePreload`, `useDominantColor` |
| **Non-goals** | Zoom, slideshow, metadata panel, deferred toolbar |
| **Success criteria** | Spatial continuity; blurred backdrop; auto-hide chrome; prev/next + arrows; dominant tint; typecheck/build pass |

### Phase 4B — Deferred toolbar (pending)

| | |
|---|---|
| **Goals** | Search, sort, favorites; toolbar hidden until scroll/interact/shortcut/top hover |
| **Success criteria** | First paint chrome-minimal; `/` or shortcut focuses search; favorites persist |
| **Deliverables** | `GalleryToolbar`, `useDeferredToolbar`, `useFavorites`, sort helpers |
| **Common mistakes** | Always-visible dashboard bar; search without debounce; blocking main thread on filter |
| **Review checklist** | Experience deferred toolbar; a11y labels; Inventory rows |
| **Expected commits** | `feat: deferred gallery toolbar` → `feat: favorites localStorage` |

---

## Phase 5 — Dark room viewer polish

| | |
|---|---|
| **Goals** | Dominant tint; remaining viewer shell polish beyond 4A entry/exit |
| **Success criteria** | Tint 3–5%; spatial continuity preserved |
| **Deliverables** | `useDominantColor`; tinted `BackgroundLayer` |
| **Common mistakes** | Tint too strong; hard-cut close |
| **Review checklist** | Animation Spec Open/Close; Design Decisions tint/charcoal |
| **Expected commits** | `feat: dominant color tint` |
| **Note** | Shared-element open/close + viewer shell shipped in **Phase 4A** |

---

## Phase 6 — Navigation + counter

| | |
|---|---|
| **Goals** | Keys/wheel/swipe; N±1 preload; slide-fades; animated counter |
| **Success criteria** | Smooth prev/next; ≤3 decoded full-res; live region announces index |
| **Deliverables** | `useViewerNav`, `useImagePreload`, `AnimatedCounter` |
| **Common mistakes** | Preloading ±10; instant counter swap only; ignoring swipe |
| **Review checklist** | Memory budget; Inventory nav; reduced motion crossfade |
| **Expected commits** | `feat: viewer navigation and preload` → `feat: animated image counter` |

---

## Phase 7 — Zoom + chrome auto-hide

| | |
|---|---|
| **Goals** | Zoom/pan/fit/actual; background modes; chrome idle ~2s |
| **Success criteria** | Wheel/pinch/dblclick; Fit/`0` Actual/`1`; chrome returns on move |
| **Deliverables** | `ZoomStage`, `useZoomPan`, `useAutoHideUI`, bg picker |
| **Common mistakes** | Elastic bounce zoom; chrome never hiding; layout thrash on pan |
| **Review checklist** | Zoom philosophy; transform-only pan; a11y shortcuts |
| **Expected commits** | `feat: zoom and pan stage` → `feat: viewer chrome auto-hide` |

---

## Phase 8 — Slideshow

| | |
|---|---|
| **Goals** | Exhibition mode; hide cursor/chrome; crossfade; Ken Burns 100–104% |
| **Success criteria** | Play/pause/loop/shuffle/intervals; reduced motion disables Ken Burns |
| **Deliverables** | `useSlideshow`, `SlideshowControls`, progress affordance |
| **Common mistakes** | Cube/flip transitions; sounds; leaving chrome visible the whole time |
| **Review checklist** | Animation Spec Slideshow; silent audio principle |
| **Expected commits** | `feat: exhibition slideshow` → `feat: optional ken burns` |

---

## Phase 9 — Download + metadata + persistence

| | |
|---|---|
| **Goals** | Original download; EXIF sidebar; last viewed / settings persistence |
| **Success criteria** | No recompress; sidebar hidden without meta; storage namespaced |
| **Deliverables** | download util, `useExif`, `MetaSidebar`, storage helpers |
| **Common mistakes** | Parsing EXIF for every wall image; canvas recompress download |
| **Review checklist** | Lazy EXIF; Offline; Glossary Metadata |
| **Expected commits** | `feat: download original` → `feat: exif metadata sidebar` → `feat: view persistence` |

---

## Phase 10 — Polish

| | |
|---|---|
| **Status** | **Partially complete (ambient absorbed into 3D)** |
| **Goals** | Remaining QA hardening beyond gallery experience ambient/motion |
| **Success criteria** | Full Quality Checklist green before V1 ship |
| **Deliverables** | Broader a11y/responsive QA; any leftover polish not covered in 3D |
| **Note** | Wave reveal, hover, parallax, breathing, and gallery visual polish shipped in **Phase 3D** |

---

## Cross-phase rules

- Do not implement later-phase features early “because they’re easy” if they couple poorly  
- Update docs in the same PR as behaviour  
- Prefer the commit shapes above; squash only when history is noisy — not to hide unfinished work from review  
