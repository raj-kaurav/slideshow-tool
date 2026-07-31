# UI Patterns

> Reusable UI patterns — purpose, behaviour, motion, accessibility, usage.  
> Visual: [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md) · Motion: [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) · Components: [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md)

Use these patterns before inventing new ones ([Consistency Over Novelty](./PROJECT_PRINCIPLES.md)).

---

## Gallery

| | |
|---|---|
| **Purpose** | Browse the Collection as a justified wall |
| **Behaviour** | Placeholders reserved; Wave Reveal; virtualized rows; immediately interactive |
| **Motion** | Reveal, ambient parallax, breathing |
| **Accessibility** | Keyboard-activatable Image Cards; meaningful names/alts |
| **Usage** | Home primary surface under Collection Header |

---

## Viewer

| | |
|---|---|
| **Purpose** | Immersive single-Photograph inspection (Dark Room) |
| **Behaviour** | Shared Element open/close; N±1 preload; Dominant Tint; auto-hide Chrome |
| **Motion** | Expand/close, nav slide-fade, chrome fade |
| **Accessibility** | `dialog` + focus trap; Esc closes; arrows navigate |
| **Usage** | Only from Gallery activation — not a standalone marketing page |

---

## Toolbar

| | |
|---|---|
| **Purpose** | Search, sort, favorites filter |
| **Behaviour** | Deferred reveal; debounced search; local favorites |
| **Motion** | Toolbar fade |
| **Accessibility** | Labelled controls; shortcut focuses search |
| **Usage** | Gallery only — never permanent dashboard chrome |

---

## Dialogs

| | |
|---|---|
| **Purpose** | Modal tasks that require focus (Viewer is the primary dialog) |
| **Behaviour** | Focus trap; Esc; restore focus |
| **Motion** | Soft fade/scale ≤ product rules — Viewer uses Shared Element instead of generic dialog motion |
| **Accessibility** | `role="dialog"` `aria-modal` labelled |
| **Usage** | Prefer Viewer pattern for photographs; avoid nested dialogs |

---

## Panels

| | |
|---|---|
| **Purpose** | Secondary information (Metadata sidebar) |
| **Behaviour** | Slide from edge; hidden when empty; Esc closes panel before Viewer when open |
| **Motion** | Panel slide `motion.normal` |
| **Accessibility** | Complementary/dialog semantics; focus management |
| **Usage** | Metadata only in V1 |

---

## Buttons

| | |
|---|---|
| **Purpose** | Quiet actions |
| **Behaviour** | Icon-first; pressed states for toggles |
| **Motion** | Optional magnetic (desktop); press opacity |
| **Accessibility** | `aria-label` required for icon-only; focus ring; ≥44px touch |
| **Usage** | Toolbar + Viewer Chrome; no marketing CTAs on the wall |

---

## Counters

| | |
|---|---|
| **Purpose** | Orient within the Collection in Viewer |
| **Behaviour** | Zero-padded `current / total`; digit-level animation |
| **Motion** | Counter digit token |
| **Accessibility** | Live region speaks full sentence; visuals may be aria-hidden if live region present |
| **Usage** | Viewer bottom center only |

---

## Search

| | |
|---|---|
| **Purpose** | Instant client filter |
| **Behaviour** | Debounced; filters Gallery in place; empty state when no hits |
| **Motion** | Fast opacity on item exit/enter |
| **Accessibility** | Results count announced |
| **Usage** | Toolbar; V1 filename; future fields per Experience |

---

## Loading

| | |
|---|---|
| **Purpose** | Calm waiting |
| **Behaviour** | Skeletons in Placeholders; optional “Preparing collection” copy |
| **Motion** | Soft fade-in of media — no hero spinner |
| **Accessibility** | `aria-busy` when appropriate |
| **Usage** | Manifest load + image decode |

---

## Empty states

| | |
|---|---|
| **Purpose** | Intentional zero-result surfaces |
| **Behaviour** | Editorial copy; optional clear/filter actions |
| **Motion** | Soft entrance |
| **Accessibility** | Textual, not alert-only color |
| **Usage** | Empty Gallery / search / favorites |

---

## Error states

| | |
|---|---|
| **Purpose** | Graceful degradation |
| **Behaviour** | Quiet placeholder; optional retry; nav continues |
| **Motion** | Minimal |
| **Accessibility** | Describe failure; focusable retry |
| **Usage** | Broken Photograph, missing Manifest |

---

## Skeletons

| | |
|---|---|
| **Purpose** | Loading visual inside Placeholder |
| **Behaviour** | Match aspect ratio; static under reduced motion |
| **Motion** | Optional soft pulse if not reduced |
| **Accessibility** | Decorative within busy region |
| **Usage** | Never replace Reserved Placeholder geometry |

---

## Metadata

| | |
|---|---|
| **Purpose** | Show file/EXIF when present |
| **Behaviour** | Lazy parse on open; hide if none |
| **Motion** | Panel pattern |
| **Accessibility** | Definition-like structure; Esc |
| **Usage** | Viewer Info control |

---

## Collection Header

| | |
|---|---|
| **Purpose** | Product + Collection personality |
| **Behaviour** | Always visible on home; no Explore gate |
| **Motion** | None required |
| **Accessibility** | Proper heading hierarchy |
| **Usage** | Above Gallery |

---

## Image Card

| | |
|---|---|
| **Purpose** | One Photograph in the Gallery |
| **Behaviour** | Hover elevation; open Viewer; interactive when visible |
| **Motion** | Hover + participate in Wave Reveal + Shared Element source |
| **Accessibility** | Activator with name/alt |
| **Usage** | Only inside Gallery |

---

## Pattern addition rule

New patterns need a section here **and** Glossary terms **and** Component Guidelines ownership before widespread use.
