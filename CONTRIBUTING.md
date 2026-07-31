# Contributing

Thank you for helping build **Gallery Experience** — a premium, offline-first photography application.

> The interface should disappear. The photographs should remain in memory.

---

## Project philosophy

Read first:

1. [docs/PROJECT_PRINCIPLES.md](docs/PROJECT_PRINCIPLES.md)  
2. [docs/EXPERIENCE_DESIGN.md](docs/EXPERIENCE_DESIGN.md)  
3. [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)  

We are building a photography **application** (Photos / Lightroom / Linear calm), not an agency portfolio or image manager.

---

## Documentation order

When you need answers, read in this order:

| Order | Doc | Question it answers |
|---|---|---|
| 1 | PROJECT_PRINCIPLES | Should we build this at all? |
| 2 | PRODUCT_GLOSSARY | What words do we use? |
| 3 | EXPERIENCE_DESIGN / VISUAL_LANGUAGE / MOTION_SYSTEM | How should it feel/look/move? |
| 4 | ANIMATION_SPEC / INTERACTION_INVENTORY / UI_PATTERNS | Exact behaviour patterns |
| 5 | ARCHITECTURE / ENGINEERING_STANDARDS | How is it structured? |
| 6 | COMPONENT_GUIDELINES / IMPLEMENTATION_PLAYBOOK | How do I implement? |
| 7 | FEATURE_LIFECYCLE / QUALITY_CHECKLIST / TESTING_STRATEGY | How do I ship? |
| 8 | ROADMAP | What is in/out of scope for versions? |

---

## Coding standards

Follow [docs/ENGINEERING_STANDARDS.md](docs/ENGINEERING_STANDARDS.md).

Highlights:

- Strict TypeScript; no `any`  
- Motion/visual **tokens only**  
- Interaction never waits on animation  
- Preload N±1 only in the Viewer  
- Small files; correct folder ownership  

---

## Commit expectations

- Small, modular commits with imperative subjects (“Add wave reveal timeline”)  
- Explain *why* in the body when non-obvious  
- Do not mix unrelated refactors with feature work  
- Keep the app runnable at each commit when possible  

---

## Branch naming

- Feature/docs work: `cursor/<descriptive-name>-<suffix>` when using Cursor cloud agents, or `feat/…`, `docs/…`, `fix/…` locally  
- Lowercase; hyphen-separated; no spaces  

---

## Review expectations

- Authors complete [docs/QUALITY_CHECKLIST.md](docs/QUALITY_CHECKLIST.md) in the PR  
- Reviewers verify principles, a11y, perf, motion tokens, and doc sync  
- “Looks fine” is not enough for Viewer/Gallery motion changes — check reduced motion  

---

## How to add features

1. Follow [docs/FEATURE_LIFECYCLE.md](docs/FEATURE_LIFECYCLE.md)  
2. Confirm fit with [docs/ROADMAP.md](docs/ROADMAP.md) and principles  
3. Update Interaction Inventory / Animation Spec / Decisions when behaviour is new  
4. Implement with [docs/IMPLEMENTATION_PLAYBOOK.md](docs/IMPLEMENTATION_PLAYBOOK.md) guidance  
5. Test per [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)  
6. Pass the Quality Checklist before merge  

---

## How to update documentation

- **One responsibility per doc** — do not paste Experience prose into Architecture  
- Cross-link instead of duplicating  
- New terms → Product Glossary first  
- New decisions → Design Decisions  
- Version scope changes → Roadmap  
- After doc-only changes, still open a PR for review  

---

## What we will reject

- Landing gates / marketing heroes that hide the Gallery  
- Heavy WebGL / Three.js “showcases” for V1  
- UI sound effects  
- Features that require a backend for core viewing  
- Motion that blocks interaction or ignores reduced motion  
- New vocabulary for existing Glossary terms  
