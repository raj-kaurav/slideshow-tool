# Engineering Standards

> Engineering source of truth for conventions used throughout Gallery Experience.  
> Philosophy: [PROJECT_PRINCIPLES.md](./PROJECT_PRINCIPLES.md) · Lifecycle: [FEATURE_LIFECYCLE.md](./FEATURE_LIFECYCLE.md)  
> Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md) · Quality gate: [QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)

---

## File organization

### Maximum file size

| Kind | Soft limit | Hard limit | Action when exceeded |
|---|---|---|---|
| React component | ~200 LOC | ~300 LOC | Extract subcomponents / hooks |
| Hook | ~150 LOC | ~250 LOC | Split by concern |
| Utility module | ~200 LOC | ~300 LOC | Split by domain |
| Context provider | ~250 LOC | ~350 LOC | Extract reducers / selectors |

Counts exclude imports and pure type blocks. Prefer clarity over gaming the limit.

### Folder ownership

| Path | Owns |
|---|---|
| `pages/` | Route-level / top-level screens (`HomePage.tsx`) |
| `components/LenisRoot.tsx` | Lenis smooth-scroll shell (app-level; not under `cursor/`) |
| `components/brand/` | Collection header / title presentation |
| `components/gallery/` | Wall, cards, toolbar |
| `components/viewer/` | Dark room, chrome, zoom, slideshow UI |
| `components/cursor/` | Desktop cursor affordances (Phase 10+) |
| `components/ui/` | Shared primitives (buttons, skeleton, focus ring, counter) |
| `hooks/` | Reusable stateful logic |
| `context/` | Providers only — thin orchestration (`*Context.tsx`) |
| `lib/` | Pure utilities (layout, sort, color, storage, motion tokens) |
| `types/` | Shared domain types |
| `styles/` | `tokens.css` + `globals.css` (Tailwind v4 entry) |
| `vite-plugins/` | Build-time gallery tooling |
| `docs/` | Product & engineering documentation |

### Naming conventions

- Components: `PascalCase.tsx` (`ImageCard.tsx`)
- Hooks: `useCamelCase.ts` (`useWaveReveal.ts`)
- Libs: `camelCase.ts` or domain noun (`justified.ts`, `waveOrder.ts`)
- Types: `camelCase.ts` files; exported types `PascalCase`
- CSS tokens: `--kebab-case`
- Tests: `*.test.ts(x)` colocated or under `__tests__/`

### Import ordering

1. External packages (`react`, `framer-motion`, …)  
2. Blank line  
3. Internal alias / absolute (`@/context`, `@/hooks`, …)  
4. Blank line  
5. Relative siblings (`./ImageCard`, `../types`)  
6. Types (`import type { … }`) preferred last or inline `import type`

No circular imports. Prefer `import type` for type-only usage.

### Dependency direction

```text
ui / brand / gallery / viewer  →  hooks → context → lib → types
vite-plugins / scripts         →  (node only; not imported by UI)
```

- `lib` never imports React components  
- `hooks` may use other hooks + `lib` + `context` consumers carefully (avoid cycles)  
- Features must not reach into another feature’s private internals  

### Feature boundaries

Gallery wall, viewer, and toolbar communicate through **context + callbacks**, not deep imports of private modules. Shared visuals go in `components/ui/`.

### When to create new folders

- A third related file appears in a catch-all directory  
- A new product surface needs clear ownership (still under `components/` or `hooks/`)  
- Do **not** create folders for a single file  

### When to split files

- Multiple unrelated exports  
- Distinct animation controller vs presentational markup  
- File exceeds size guidance  
- Testing one concern requires mocking another buried in the same file  

---

## React standards

| Topic | Standard |
|---|---|
| **Component size** | One primary responsibility; split when props/state tangle |
| **Hooks** | Extract when logic is reused or obscures JSX; name by behaviour |
| **Context** | Few providers (`Gallery`, `Viewer`, `Cursor`); values stable; split contexts if update frequency differs |
| **Composition** | Prefer composition over inheritance; slots/children over deep config objects |
| **Prop drilling** | ≤2 levels OK; beyond that use context or composition |
| **Memoization** | Do **not** default to `useMemo`/`useCallback`; add only for measured re-render/perf issues or stable context values |
| **State ownership** | Own state at the lowest level that still shares correctly; see [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) |

---

## Performance standards

- Avoid unnecessary renders: stable context value identities; virtualize the wall  
- Images: lazy + async decode; reserved aspect boxes; preload **N±1** only in viewer  
- Animation: `transform`/`opacity` only; honor reduced motion; use motion tokens  
- Lazy load routes/panels only if/when code-splitting is introduced  
- Virtualization required for large collections (row-based)  
- Memory cleanup: clear slideshow timers, revoke object URLs, kill GSAP timelines on unmount  

Budgets: [ARCHITECTURE.md](./ARCHITECTURE.md#performance-budgets-targets).

---

## TypeScript standards

- `strict` true; `noImplicitAny`; prefer `noUncheckedIndexedAccess` (enabled in `tsconfig.app.json`)  
- Avoid `any`; use `unknown` + narrow  
- Shared domain types in `types/`; do not duplicate interfaces across features  
- Prefer utility types (`Pick`, `Omit`, `Readonly`) over copy-paste  
- Prefer **string unions** over numeric enums for public APIs; const objects when needed  
- Naming: `PascalCase` types/interfaces; `T` prefixes discouraged; boolean props `is`/`has`/`should`  
- Path alias: `@/*` → `src/*` (Vite `resolve.alias` + `tsconfig.app.json` `paths`; `baseUrl` retained with `ignoreDeprecations: "6.0"` for TypeScript 6)  
- `verbatimModuleSyntax` — use `import type` for type-only imports  

---

## Styling standards

- **Tailwind CSS v4** via `@tailwindcss/vite` — **no** `tailwind.config.ts`  
- Entry: `src/styles/globals.css` (`@import 'tailwindcss'`, `@theme` bridges, `@layer base`)  
- **CSS tokens** in `src/styles/tokens.css`; TS mirrors for motion in `src/lib/motion.ts`  
- **Tokens only** for color, space, motion duration — no scattered magic hex/px for design values  
- Spacing from the spacing scale in [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md)  
- Responsive: mobile-first; match Architecture breakpoints behaviour  
- **No magic numbers** for motion — import [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) / `lib/motion.ts` tokens  

---

## Tooling

| Tool | Command / note |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` (`tsc -b && vite build`) |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` → **oxlint** (not ESLint) |
| Format | `npm run format` / `npm run format:check` → Prettier |
---

## Code quality

- Readable names over clever brevity  
- Small functions; prefer pure `lib/` helpers  
- No duplicated logic — extract hooks/utils on second use  
- Reusable hooks for behaviour; reusable UI in `components/ui/`  
- Document non-obvious invariants with short comments (why, not what)  

---

## Review checklist (every feature)

Before merge, the change must satisfy:

| Area | Bar |
|---|---|
| Performance | Within budgets; no full-album preload; no render storms |
| Accessibility | Keyboard, focus, labels, live regions as needed |
| Responsiveness | Mobile → ultra-wide verified |
| Motion consistency | Tokens + Animation Spec; reduced motion path |
| Type safety | Strict; no `any` escapes |
| Code quality | Standards above |
| Visual consistency | Visual Language |
| Documentation | Updated when behaviour/API/decisions change |

Use the full gate: [QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md).
