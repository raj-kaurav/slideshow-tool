# Testing Strategy

> Testing philosophy for Gallery Experience.  
> Gate: [QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md) · Lifecycle: [FEATURE_LIFECYCLE.md](./FEATURE_LIFECYCLE.md)

Prefer tests that protect photography workflows (browse, open, navigate, close) over implementation trivia.

---

## Unit testing

- **Target:** `lib/` pure functions — justified layout, sort, wave order, formatters, storage parsers  
- **Tools:** Vitest (recommended with Vite)  
- **Bar:** Edge cases for orientation, empty lists, stable ids  

---

## Component testing

- **Target:** Image Card load/error, Counter formatting, Toolbar deferred visibility hooks, Empty/Error states  
- **Tools:** Vitest + React Testing Library  
- **Bar:** Accessible roles/names asserted; avoid testing Tailwind class strings  

---

## Interaction testing

- **Target:** Open Viewer, Esc close + focus restore, next/prev, search debounce filter, favorites toggle  
- **Bar:** User-event flows; no reliance on animation timers completing for clickability  

---

## Accessibility testing

- Keyboard paths for Gallery → Viewer → close  
- Focus trap and restore  
- `axe` or equivalent on Home + Viewer where automation helps  
- Manual screen reader spot-check for Counter live region and icon labels  
- Reduced motion: verify parallax/breathing/Ken Burns off  

---

## Responsive testing

- Widths: ~375, 768, 1280, 1920+  
- Touch swipe next/prev on Viewer  
- Toolbar deferred behaviour on small screens  
- Safe-area / bottom chrome on notched devices (manual)  

---

## Performance testing

- Fixture Gallery: **≥ 200** images for wall virtualization smoke; **≥ 500** periodically  
- Scroll FPS subjective/manual or profiler; watch mount counts  
- Viewer: confirm only N±1 full-res preloads (network/panel or logs in dev)  
- No memory monotonic climb across 50 open/close cycles (spot check)  
- Compare against [Architecture budgets](./ARCHITECTURE.md#performance-budgets-targets)  

---

## Motion testing

- Reveal completes roughly within assemble token; placeholders do not shift layout  
- Open/close Shared Element does not hard-cut  
- `prefers-reduced-motion: reduce` screenshots or flags in tests where feasible  
- Token usage — grep for hardcoded `ms` durations in components (lint/review)  

---

## Visual regression testing

- Optional Playwright/Chromatic later for Collection Header, Gallery slice, Viewer chrome  
- V1 minimum: manual before/after screenshots for motion/visual PRs  
- Stabilize: disable breathing/parallax in screenshot mode  

---

## Manual QA checklist

- [ ] Drop new images into `public/gallery/` → appear after refresh/HMR  
- [ ] Wave Reveal; click mid-reveal works  
- [ ] Hover elevation subtle; filename optional only  
- [ ] Open/close spatial continuity; scroll restored  
- [ ] Arrows, wheel, swipe, Esc, Space (slideshow), zoom keys  
- [ ] Dominant Tint perceptible only as atmosphere  
- [ ] Slideshow hides chrome/cursor; movement restores  
- [ ] Download opens/saves original  
- [ ] Info sidebar hidden without metadata  
- [ ] Favorites persist across reload  
- [ ] Empty gallery / empty search copy calm  
- [ ] Broken image placeholder quiet  
- [ ] Reduced motion path  
- [ ] Offline (dev server stopped for static preview / `vite preview` without network deps)  

---

## Offline testing

- `vite preview` after build; disable network in DevTools  
- Confirm no CDN-required runtime for core (fonts should be self-hosted or fallback-safe)  
- localStorage favorites/settings still read  

---

## Large gallery testing

| Fixture | Intent |
|---|---|
| 50 | Functional smoke |
| 200 | Virtualization + scroll |
| 500–1000 | Memory/nav stress; preload discipline |

Include mixed portrait/landscape/panorama/square. Keep fixtures out of git if huge — document how to generate locally.

---

## What not to over-test

- Exact spring pixel values  
- Third-party Lenis/GSAP internals  
- Snapshotting entire animated timelines frame-by-frame in V1  

---

## CI expectations (when enabled)

- Unit + component tests on PR  
- Lint / `tsc --noEmit`  
- Optional axe on smoke routes  
- Performance budgets as non-blocking warnings first, then tighten  
