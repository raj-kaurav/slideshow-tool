import gsap from 'gsap'

import { motion, motionLimits, spring } from '@/lib/motion'
import type { WaveOrderEntry } from '@/lib/waveOrder'

export const REVEAL_SURFACE_ATTR = 'data-reveal-surface'
export const REVEAL_ID_ATTR = 'data-reveal-id'
export const REVEALED_ATTR = 'data-revealed'

export type GalleryRevealTimelineOptions = {
  /** Root that contains reveal surfaces (may be virtualized — only mounted nodes animate). */
  root: HTMLElement
  waveOrder: readonly WaveOrderEntry[]
  onComplete?: () => void
}

/**
 * Approximate soft-spring reveal with over-damped feel (MOTION_SYSTEM ease.reveal).
 * GSAP has no Framer-style spring token — map stiffness/damping to a calm power ease.
 */
function revealEase(): string {
  // Critically / over-damped — no bounce (spring.reveal damping ≥ 28)
  void spring.reveal
  return 'power3.out'
}

function staggerMs(entry: WaveOrderEntry): number {
  const span = motion.staggerMax - motion.staggerMin
  return motion.staggerMin + entry.staggerNoise * span
}

/**
 * Build the one-shot gallery assemble timeline.
 * Animates compositor-friendly props only (opacity / transform).
 * Layout boxes are never moved — only `[data-reveal-surface]` contents.
 */
export function createGalleryRevealTimeline({
  root,
  waveOrder,
  onComplete,
}: GalleryRevealTimelineOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: { ease: revealEase() },
    onComplete: () => {
      root.querySelectorAll(`[${REVEAL_SURFACE_ATTR}]`).forEach((node) => {
        node.setAttribute(REVEALED_ATTR, '')
      })
      onComplete?.()
    },
  })

  const orderIndex = new Map(waveOrder.map((entry, index) => [entry.id, index]))
  const surfaces = Array.from(
    root.querySelectorAll<HTMLElement>(`[${REVEAL_SURFACE_ATTR}]`),
  ).filter((el) => {
    const id = el.getAttribute(REVEAL_ID_ATTR)
    return id != null && orderIndex.has(id)
  })

  surfaces.sort((a, b) => {
    const ai = orderIndex.get(a.getAttribute(REVEAL_ID_ATTR) ?? '') ?? 0
    const bi = orderIndex.get(b.getAttribute(REVEAL_ID_ATTR) ?? '') ?? 0
    return ai - bi
  })

  if (surfaces.length === 0) {
    onComplete?.()
    return tl
  }

  const moveSpan = motionLimits.maxRevealMovePx - motionLimits.minRevealMovePx

  surfaces.forEach((el, index) => {
    const id = el.getAttribute(REVEAL_ID_ATTR) ?? ''
    const entry = waveOrder[orderIndex.get(id) ?? index]
    const noise = entry?.staggerNoise ?? 0.5
    const yFrom = motionLimits.minRevealMovePx + noise * moveSpan
    const rotateFrom = (noise * 2 - 1) * motionLimits.maxRotationDeg

    gsap.set(el, {
      opacity: 0,
      y: yFrom,
      scale: motionLimits.revealScaleFrom,
      rotate: rotateFrom,
      transformOrigin: '50% 50%',
    })

    // Organic stagger: base index * mid stagger + per-cell noise in token band
    const delay =
      (index * ((motion.staggerMin + motion.staggerMax) / 2) + (entry ? staggerMs(entry) : 0)) /
      1000

    // Keep total assemble near motion.assemble by capping late starts
    const cappedDelay = Math.min(delay, (motion.assemble - motion.revealCell * 0.55) / 1000)

    tl.to(
      el,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: Math.min(motion.revealCell, 720) / 1000,
        onStart: () => {
          el.setAttribute(REVEALED_ATTR, '')
        },
      },
      cappedDelay,
    )
  })

  return tl
}

/** Snap mounted reveal surfaces to settled state (reduced motion / late mounts). */
export function settleRevealSurfaces(root: HTMLElement, onlyUnrevealed = false): void {
  const selector = onlyUnrevealed
    ? `[${REVEAL_SURFACE_ATTR}]:not([${REVEALED_ATTR}])`
    : `[${REVEAL_SURFACE_ATTR}]`
  const surfaces = root.querySelectorAll<HTMLElement>(selector)
  if (surfaces.length === 0) return
  gsap.set(surfaces, { opacity: 1, y: 0, scale: 1, rotate: 0 })
  surfaces.forEach((el) => el.setAttribute(REVEALED_ATTR, ''))
}
