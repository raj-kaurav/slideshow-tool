# Project Principles

> Long-term philosophy. Every future feature should be evaluated against these principles.  
> Decisions log: [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) · Experience: [EXPERIENCE_DESIGN.md](./EXPERIENCE_DESIGN.md)

**North star:** The interface should disappear. The photographs should remain in memory.

---

## Photography First

Photographs are the product. UI exists only to help people find, view, and leave with images in mind — never to showcase the interface itself.

**Test:** If we removed the chrome, would the feature still make sense as photography?

---

## Invisible Interface

Controls appear when useful and vanish when not. Deferred toolbar, auto-hiding viewer chrome, quiet hover. No dashboards, no CMS chrome, no file-manager energy.

**Test:** Does first paint feel empty of management UI?

---

## Performance First

Smooth with 100–1000+ high-resolution images. Lazy load, virtualize, preload N±1 only, respect memory. Jank breaks trust with photographers.

**Test:** Does this add decode/memory/render cost without a clear user benefit?

---

## Accessibility Always

Keyboard, focus, ARIA, contrast, and reduced motion are part of the product — not a phase at the end.

**Test:** Can the task be completed without a pointer and without motion?

---

## Motion With Purpose

Motion orients and connects (spatial continuity). It never entertains for its own sake. Tokens and specs are mandatory.

**Test:** If we removed the animation, would orientation suffer — or only spectacle?

---

## Consistency Over Novelty

Timeless photography-app patterns over trendy agency tricks. Prefer the design system and existing patterns to one-off inventions.

**Test:** Does this introduce a new pattern when an existing one would do?

---

## Progressive Enhancement

Core gallery works at Level 0. Parallax, tint, blur-up, and future polish layer on without becoming requirements.

**Test:** If higher levels fail, can the user still view photographs?

---

## Maintainability

Clear folder ownership, small modules, documented decisions, no giant files. Future contributors should understand *why*.

**Test:** Can another engineer find the owner of this behaviour in under a minute?

---

## Craft Over Quantity

Fewer features, finished. Prefer polish on open/close, reveal, and viewer over a pile of half-built tools.

**Test:** Would we be proud to show this surface to a professional photographer?

---

## Offline First

No required network, backend, CMS, or account for core viewing. Images live in a local folder; state in the browser when needed.

**Test:** Does this feature assume a server we do not have?

---

## Long-term Maintainability

Documentation stays the source of truth. Features follow the lifecycle. Roadmap stays conceptual until scheduled. Avoid lock-in to novelty libraries without ownership clarity.

**Test:** Will this still be intelligible and replaceable in two years?

---

## How to use this document

1. Ideate against these principles (see [FEATURE_LIFECYCLE.md](./FEATURE_LIFECYCLE.md))  
2. Record principle tension in [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) when trading one off against another  
3. Reject or redesign features that fail Photography First, Offline First, or Accessibility Always without an explicit, documented exception  
