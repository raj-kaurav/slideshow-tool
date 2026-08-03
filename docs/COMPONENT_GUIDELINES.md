# Component Guidelines

> Behaviour standards for major UI units.  
> Visual tokens: [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md)  
> Motion: [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) · [ANIMATION_SPEC.md](./ANIMATION_SPEC.md)  
> Architecture / state: [ARCHITECTURE.md](./ARCHITECTURE.md)

**Rule:** Components do not own responsibilities that belong to context, hooks, or sibling components. Prefer props + callbacks over hidden global side effects.

---

## CollectionHeader

| | |
|---|---|
| **Responsibility** | Display product title and editorial collection personality (title, count, dates, photographer, location) |
| **Props** | `productName`, `collectionMeta`, `imageCount` |
| **State ownership** | None — presentational from `GalleryProvider` |
| **Accessibility** | Landmark/banner or header; heading hierarchy (`h1` product, optional `h2` collection) |
| **Motion** | Static on load; no gate animation |
| **Visual** | Display + muted meta; no cards/borders |
| **Interaction** | None required |
| **Performance** | Trivial |

---

## Gallery (`JustifiedGallery`)

| | |
|---|---|
| **Responsibility** | Compute/consume justified geometry; virtualize rows; host wave reveal, ambient parallax, breathing; open viewer via callback |
| **Props** | `items`, `onOpen(id)`, layout width, reduced-motion flag |
| **State ownership** | Layout cache local; reveal progress local/GSAP; does **not** own favorites/sort/query |
| **Accessibility** | List/grid of activatable items; keyboard roving or tabbable cards |
| **Motion** | Gallery Reveal, ambient, breathing — see Animation Spec |
| **Visual** | Reserved aspect boxes; gutters from visual language |
| **Interaction** | Immediately interactive during reveal |
| **Performance** | Row virtualization; no full-gallery preload |

---

## ImageCard

| | |
|---|---|
| **Responsibility** | Render one photograph in a reserved box; hover elevation; activate open |
| **Props** | `item`, `layout`, `onOpen`, `isVisible`, reveal controls |
| **State ownership** | Local load/error UI; no global index ownership |
| **Accessibility** | `button` or equivalent; `alt` from filename/title; focus ring |
| **Motion** | Hover; participate in wave; shared `layoutId` for open |
| **Visual** | Skeleton → blur-up → image; optional filename on hover |
| **Interaction** | Click/Enter as soon as painted; never wait for wave end |
| **Performance** | `loading="lazy"` `decoding="async"`; decode only when near viewport |

---

## GalleryToolbar

| | |
|---|---|
| **Responsibility** | Search, sort, favorites filter — deferred visibility |
| **Props** | `query`, `sort`, `favoritesOnly`, setters, `visible` |
| **State ownership** | Visibility may be local (`useDeferredToolbar`); filter values live in gallery context |
| **Accessibility** | Labelled controls; search shortcut focuses input |
| **Motion** | Toolbar Reveal |
| **Visual** | Quiet floating surface; icon-first |
| **Interaction** | Does not appear on first paint |
| **Performance** | Debounced search |

---

## Viewer (`FullscreenViewer`)

| | |
|---|---|
| **Responsibility** | Dark-room presentation, nav shell, chrome auto-hide, orchestrate zoom/slideshow/sidebar |
| **Props** / context | Current item, index, list, close, nav callbacks |
| **State ownership** | Chrome visibility, bg mode, tint; delegates zoom to `ZoomStage`, slideshow to hook |
| **Accessibility** | `role="dialog"` `aria-modal`; focus trap; Esc closes |
| **Motion** | Open/Close, nav, chrome fade — Animation Spec |
| **Visual** | Charcoal + dominant tint; minimal chrome clusters |
| **Interaction** | Keyboard, wheel, swipe; auto-hide ~2s |
| **Performance** | Preload N±1 only; unmount heavy stage on close |

Does **not** own gallery filter state or manifest loading.

---

## ZoomStage

| | |
|---|---|
| **Responsibility** | Fit / actual / free zoom + pan |
| **Props** | `src`, dimensions, fit mode callbacks |
| **State ownership** | Local transform; reset on image change |
| **Accessibility** | Keyboard zoom shortcuts documented in Experience |
| **Motion** | Zoom spec |
| **Visual** | Letterboxed in dark room |
| **Interaction** | Wheel, pinch, double-click/tap, drag when zoomed |
| **Performance** | Transform-only; avoid re-decoding on pan |

---

## Metadata Sidebar (`MetaSidebar`)

| | |
|---|---|
| **Responsibility** | Show file/EXIF when present |
| **Props** | `open`, `onClose`, `metadata` |
| **State ownership** | None — EXIF fetched by `useExif` / parent |
| **Accessibility** | Labelled dialog/complementary; Esc closes sidebar first |
| **Motion** | Sidebar slide |
| **Visual** | Editorial key/value; hide if empty |
| **Interaction** | Info toggle / `I` |
| **Performance** | Parse EXIF only when opened |

---

## AnimatedCounter

| | |
|---|---|
| **Responsibility** | Display `current / total` with digit motion |
| **Props** | `current`, `total`, pad width |
| **State ownership** | None |
| **Accessibility** | Visual digits decorative relative to `aria-live` announcement owned by viewer |
| **Motion** | Counter Animation |
| **Visual** | Tabular nums; caption size |
| **Interaction** | None |
| **Performance** | Only animate changed digits |

---

## Buttons (`IconButton` et al.)

| | |
|---|---|
| **Responsibility** | Quiet activators for chrome actions |
| **Props** | `aria-label` (required), `onClick`, `pressed?`, `disabled?` |
| **State ownership** | None |
| **Accessibility** | Name + focus ring + disabled semantics |
| **Motion** | Optional magnetic pull (desktop); press opacity |
| **Visual** | Icon sizes/stroke from Visual Language |
| **Interaction** | Hit target ≥44px touch |
| **Performance** | Trivial |

---

## Loading

| | |
|---|---|
| **Responsibility** | Skeletons / preparing copy — never a branded spinner hero |
| **Props** | `variant`: skeleton card, collection, viewer |
| **State ownership** | Parent-driven `aria-busy` |
| **Accessibility** | Busy state announced appropriately |
| **Motion** | Soft pulse only if needed; respect reduced motion (static skeleton) |
| **Visual** | Matches reserved aspect boxes |
| **Interaction** | None |
| **Performance** | CSS-only preferred |

---

## Empty State

| | |
|---|---|
| **Responsibility** | Editorial empty for gallery / search / favorites |
| **Props** | `kind`, optional `query` |
| **State ownership** | None |
| **Accessibility** | Readable copy; not `role="alert"` unless error |
| **Motion** | Soft entrance |
| **Visual** | Typography-led; no loud illustration |
| **Interaction** | Optional clear-search / view-all actions |
| **Performance** | Trivial |

---

## Error State

| | |
|---|---|
| **Responsibility** | Cell-level or page-level graceful failure |
| **Props** | `kind`, `onRetry?` |
| **State ownership** | None |
| **Accessibility** | Text description; retry button |
| **Motion** | Minimal |
| **Visual** | Calm placeholder — not alarm red UI |
| **Interaction** | Retry when meaningful |
| **Performance** | Failed imgs must not retry-loop unbounded |

---

## Slideshow controls

| | |
|---|---|
| **Responsibility** | Play/pause, interval, loop, shuffle, Ken Burns toggle, progress |
| **Props** | Slideshow state + setters from `useSlideshow` |
| **State ownership** | Hook/context — not local forever-state for interval persistence (persist via storage util) |
| **Accessibility** | Labels; pause when focusing controls |
| **Motion** | Chrome fade with exhibition mode |
| **Visual** | Secondary to image; hidden in idle slideshow |
| **Interaction** | Space play/pause in viewer |
| **Performance** | Timer cleanup on unmount |

---

## Anti-patterns

- ImageCard fetching EXIF for the whole gallery  
- Toolbar owning the justified layout  
- Viewer mutating favorites without going through gallery context  
- Hardcoded durations instead of motion tokens  
- Components rendering “marketing” sections unrelated to photography viewing  
