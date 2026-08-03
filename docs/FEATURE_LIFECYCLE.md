# Feature Lifecycle

> How features evolve from idea to maintenance.  
> Principles: [PROJECT_PRINCIPLES.md](./PROJECT_PRINCIPLES.md) · Playbook: [IMPLEMENTATION_PLAYBOOK.md](./IMPLEMENTATION_PLAYBOOK.md) · Gate: [QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)

```text
Idea → Research → Architecture → Implementation → Review → Polish → Release → Maintenance
```

Do not skip stages for “small” UX changes that affect motion, a11y, or performance — only true typo/docs fixes may fast-track.

---

## 1. Idea

- Capture the user problem in Photography First language  
- Check [ROADMAP.md](./ROADMAP.md) and [PROJECT_PRINCIPLES.md](./PROJECT_PRINCIPLES.md)  
- **Docs:** short problem statement (issue or decision draft)  
- **Testing / a11y / perf / motion / visual:** N/A yet  

---

## 2. Research

- Study existing patterns in [UI_PATTERNS.md](./UI_PATTERNS.md), Experience, and comparable product references (Photos, Lightroom, Linear — not agency sites)  
- Identify risks: memory, virtualization, EXIF, motion  
- **Docs:** notes linked from issue; update [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) if a fork appears  
- **Reviews:** informal principle check  

---

## 3. Architecture

- Place ownership (folder, context, hooks) per [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)  
- Define data flow; avoid new global state without need  
- **Docs required:** Architecture touchpoints; Interaction Inventory row if new interaction; Animation Spec if motion; Component Guidelines if new component  
- **Testing required:** plan unit/component/interaction coverage ([TESTING_STRATEGY.md](./TESTING_STRATEGY.md))  
- **A11y / perf / motion / visual review:** design the path now (reduced motion, budgets, tokens)  

---

## 4. Implementation

- Follow [IMPLEMENTATION_PLAYBOOK.md](./IMPLEMENTATION_PLAYBOOK.md) when on a roadmap phase; otherwise small modular commits  
- Use motion/visual tokens only  
- **Docs:** keep specs in sync as behaviour lands  
- **Testing:** write tests with the code, not after  
- **A11y:** labels, focus, keyboard as you build  
- **Perf:** no full-album preload; clean up effects  
- **Motion:** tokens + reduced-motion branch  
- **Visual:** Visual Language compliance  

---

## 5. Review

- Peer review against [QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)  
- **Docs:** PR lists doc updates  
- **Testing:** CI / manual QA per Testing Strategy  
- **A11y review:** keyboard pass + axe or equivalent where possible  
- **Perf review:** scroll/viewer with large fixture set  
- **Motion review:** Animation Spec + reduced motion  
- **Visual review:** side-by-side with Visual Language  

---

## 6. Polish

- Timing, empty/error copy, focus order, counter/tint edge cases  
- Remove debug affordances; verify offline  
- **Docs:** finalize copy in Experience if user-facing strings changed  

---

## 7. Release

- Merge only when Quality Checklist passes  
- Tag/roadmap status update in [ROADMAP.md](./ROADMAP.md) if scope completes a version slice  
- **Docs:** README/status only if contributor-facing surface changed  

---

## 8. Maintenance

- Fix regressions with the same checklist proportional to risk  
- Revisit decisions if principles conflict in production  
- **Docs:** amend Decision / Spec docs when behaviour changes — never leave docs stale  

---

## Per-feature requirements matrix

| Requirement | Idea | Research | Architecture | Implementation | Review | Polish | Release | Maintenance |
|---|---|---|---|---|---|---|---|---|
| Documentation | Problem note | Research notes | Specs updated | Keep in sync | PR lists docs | Copy final | Roadmap if needed | Amend on change |
| Testing | — | Plan risks | Test plan | Tests land | CI + QA | Edge cases | — | Regression tests |
| Accessibility review | Principle check | — | Design path | Build a11y | Formal pass | Focus polish | — | On UI change |
| Performance review | — | Risk ID | Budget fit | Build to budget | Measure | Tune | — | On hot path change |
| Motion review | — | Need? | Spec draft | Tokens + RM | Spec match | Timing | — | On motion change |
| Visual review | — | Pattern fit | Tokens | Implement | VL match | Micro | — | On UI change |

---

## Fast-track (docs-only / chore)

Allowed to compress Idea→Release when **no** user-facing behaviour, motion, or public API changes. Still update docs if terminology or standards change.
