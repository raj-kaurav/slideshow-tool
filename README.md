# Gallery Experience

A premium, offline-first photography viewing application.

> The interface should disappear. The photographs should remain in memory.

## Start here

1. [Contributing](CONTRIBUTING.md)  
2. [Project Principles](docs/PROJECT_PRINCIPLES.md)  
3. [Product Glossary](docs/PRODUCT_GLOSSARY.md)  

## Documentation system

### Product & design

| Document | Responsibility |
|---|---|
| [Experience Design](docs/EXPERIENCE_DESIGN.md) | Emotional journey & interaction feel |
| [Visual Language](docs/VISUAL_LANGUAGE.md) | Design system |
| [Motion System](docs/MOTION_SYSTEM.md) | Motion tokens, easing, rules |
| [Animation Spec](docs/ANIMATION_SPEC.md) | Per-interaction animation specs |
| [Interaction Inventory](docs/INTERACTION_INVENTORY.md) | Master interaction catalogue |
| [UI Patterns](docs/UI_PATTERNS.md) | Reusable UI patterns |
| [Design Decisions](docs/DESIGN_DECISIONS.md) | Why we chose what we chose |
| [Roadmap](docs/ROADMAP.md) | V1 / V1.1 / V2 / future ideas |

### Engineering & delivery

| Document | Responsibility |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | How the application is built |
| [Engineering Standards](docs/ENGINEERING_STANDARDS.md) | Coding conventions |
| [Component Guidelines](docs/COMPONENT_GUIDELINES.md) | Component boundaries |
| [Implementation Playbook](docs/IMPLEMENTATION_PLAYBOOK.md) | Phase-by-phase implementation guidance |
| [Feature Lifecycle](docs/FEATURE_LIFECYCLE.md) | Idea → maintenance |
| [Quality Checklist](docs/QUALITY_CHECKLIST.md) | Merge gate |
| [Testing Strategy](docs/TESTING_STRATEGY.md) | Testing philosophy |

## Status

- Documentation system complete
- **Phase 1 (Scaffold)** complete — Vite 8 + React 19 + TypeScript strict + **Tailwind CSS v4** + Framer Motion + GSAP + Lenis; design tokens; `@fontsource` fonts; providers; `pages/HomePage` shell; **oxlint** + Prettier

```bash
npm install
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b` + production build |
| `npm run typecheck` | TypeScript project build check |
| `npm run lint` | oxlint |
| `npm run format` | Prettier write |

Further phases: [Implementation Playbook](docs/IMPLEMENTATION_PLAYBOOK.md)
