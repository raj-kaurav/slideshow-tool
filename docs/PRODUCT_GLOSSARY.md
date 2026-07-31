# Product Glossary

> Canonical terminology. **Never** use multiple names for the same concept in UI copy, code identifiers (when practical), or docs.

If you need a new term, add it here first.

| Term | Definition | Do not call it |
|---|---|---|
| **Gallery** | The justified photograph wall on the home surface | Grid, feed, dashboard, library browser |
| **Collection** | The set of photographs represented by the manifest (+ optional editorial meta) | Album (reserved for future), dataset |
| **Photograph** | A single image asset in the collection | Asset (UI), attachment, file (prefer Photograph in product language; `filename` OK in meta) |
| **Viewer** | Fullscreen dark-room viewing mode for one photograph | Modal, lightbox, popup, carousel shell |
| **Dark Room** | The experiential quality of the Viewer (charcoal + tint) | Blackout, theater mode |
| **Metadata** | File and EXIF information shown in the sidebar | Properties panel, EXIF popup (say Metadata / Info) |
| **Thumbnail** | Display-sized rendering of a photograph on the Gallery wall | Tile, chip, sticker |
| **Placeholder** | Reserved layout box before/during reveal (geometry locked) | Skeleton only (skeleton is the *loading visual* inside a placeholder) |
| **Skeleton** | Loading visual inside a Placeholder | Placeholder (not interchangeable) |
| **Reveal** | The act of photographs populating placeholders after geometry is ready | Intro animation, entrance parade |
| **Wave Reveal** | Priority organic staggered Reveal across the Gallery | Cascade, domino, random scatter |
| **Chrome** | Transient viewer/app controls (nav, download, info, close, toolbar) | HUD, widgets, admin bar |
| **Collection Header** | Product title + editorial collection meta above the Gallery | Hero landing, splash, masthead marketing |
| **Image Card** | Interactive photograph unit in the Gallery (placeholder + media + hit target) | Tile, widget |
| **Counter** | Viewer index display `current / total` (animated digits) | Pager, scrubber |
| **Shared Element** | Spatial continuity transition between Image Card and Viewer image | Morph modal, hero transition (OK internally), popup expand |
| **Dominant Tint** | ~3–5% mix of photograph dominant color into Viewer background | Theme color, aura, glow |
| **Toolbar** | Deferred Gallery utilities: search, sort, favorites filter | Navbar, app bar, dashboard filters |
| **Interaction** | A user-triggered behaviour catalogued in the Interaction Inventory | Gesture only (too narrow), feature (too broad) |
| **Slideshow** | Hands-free exhibition playback in the Viewer | Autoplay carousel, party mode |
| **Ken Burns** | Subtle scale 100%→~104% during Slideshow | Zoom pan effect (legacy), drift |
| **Favorites** | Local browser-only starred photographs | Likes, bookmarks cloud |
| **Manifest** | Generated `gallery-manifest.json` index of photographs | Database, CMS feed |
| **Justified Layout** | Row-based layout with shared row height and variable widths | Masonry, mosaic, collage |
| **Breathing** | Near-invisible ambient micro-motion after Reveal settles | Idle float, ambient animation (prefer Breathing) |
| **Ambient Parallax** | Pointer-driven ≤8px Gallery plane shift | Mouse trail, tilt 3D |
| **Progressive Enhancement Level** | Capability tier 0–5 for optional polish | Feature flag soup (map flags *to* levels) |

---

## Usage rules

1. Prefer glossary terms in PR titles, docs, and user-visible strings  
2. Code may use short identifiers (`item`, `src`) but public component names should align (`ImageCard`, `ViewerChrome`)  
3. Deprecate aliases in docs when found — do not leave dual vocabulary  
