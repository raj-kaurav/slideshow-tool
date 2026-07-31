# Quality Checklist

> Every feature must pass this checklist before merging.  
> Items are **measurable**. Mark each ✔ or N/A with reason.

Companion: [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) · [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

---

## Architecture

- [ ] Change fits folder ownership; no forbidden dependency direction  
- [ ] No new context/provider without documented need  
- [ ] Public behaviour covered in Architecture / Component Guidelines if structural  
- [ ] No circular imports introduced  

## Visual

- [ ] Colors/spacing/type use design tokens (no new magic hex/px for design values)  
- [ ] Matches [VISUAL_LANGUAGE.md](./VISUAL_LANGUAGE.md) elevation and chrome rules  
- [ ] No cards/overlays in gallery hover beyond approved filename treatment  
- [ ] Empty/error states are typography-led and calm  

## Interaction

- [ ] Listed or updated in [INTERACTION_INVENTORY.md](./INTERACTION_INVENTORY.md) if user-facing  
- [ ] Interaction never blocked by animation (visible targets clickable)  
- [ ] Deferred toolbar / auto-hide chrome behaviour preserved unless intentionally changed  

## Motion

- [ ] Durations/easings reference [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) tokens  
- [ ] Spec added/updated in [ANIMATION_SPEC.md](./ANIMATION_SPEC.md) when motion changes  
- [ ] Within motion maximums (scale ≤1.02 hover, rotation ≤5°, etc.)  
- [ ] `prefers-reduced-motion` path verified (no parallax/breathing/Ken Burns when reduced)  

## Accessibility

- [ ] Keyboard path for primary task works end-to-end  
- [ ] Visible focus rings on new controls  
- [ ] Icon-only controls have accessible names  
- [ ] Dialog/viewer focus trap + restore verified if applicable  
- [ ] Live regions updated for count/filter changes if applicable  
- [ ] Contrast AA for chrome on charcoal / tint / white modes as touched  

## Performance

- [ ] No full-gallery image preload introduced  
- [ ] Viewer still preloads at most N±1 full-res  
- [ ] Wall remains virtualized for large lists; no accidental mount-all  
- [ ] Timers/subscriptions/GSAP timelines cleaned up on unmount  
- [ ] No unexplained FPS cliffs on scroll/open in manual check  

## Responsive

- [ ] Verified at mobile, tablet, and desktop widths  
- [ ] Touch targets ≥ 44px where newly interactive on touch  
- [ ] Ultra-wide or large desktop does not break letterboxing/header  

## Offline

- [ ] Feature works without network (except intentional future online modules)  
- [ ] No hard dependency on external APIs for core path  
- [ ] localStorage usage namespaced (`ge:*`) and failure-tolerant  

## Documentation

- [ ] README/docs map unchanged unless new doc added (then linked)  
- [ ] Experience / Decisions / Glossary updated if terminology or intent changed  
- [ ] Roadmap status touched only if version scope completed  

## Testing

- [ ] Unit/component tests added for logic branched in this PR (per Testing Strategy)  
- [ ] Manual QA items relevant to the change executed  
- [ ] Large-gallery smoke (or fixture ≥ threshold agreed in Testing Strategy) if touch wall/viewer  

## Maintainability

- [ ] Files within size guidance or split with reason  
- [ ] No duplicated logic that already exists in `lib/` or hooks  
- [ ] Types strict; no new `any`  
- [ ] Commit/PR description explains *why*  

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| Author | | |
| Reviewer | | |

Merge only when all applicable items are ✔ or explicitly waived in the PR with principle justification.
