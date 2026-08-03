import { useEffect, useRef, useState } from 'react'

import {
  createGalleryRevealTimeline,
  settleRevealSurfaces,
} from '@/lib/galleryReveal'
import type { WaveOrderEntry } from '@/lib/waveOrder'

/**
 * Session flag — reveal plays once per page load.
 * Survives React StrictMode remounts and layout resize; never replays for filter (later).
 */
const revealSession = {
  started: false,
  completed: false,
}

export type UseGalleryRevealOptions = {
  /** Gallery plane that hosts `[data-reveal-surface]` nodes */
  rootRef: React.RefObject<HTMLElement | null>
  waveOrder: readonly WaveOrderEntry[] | null
  reducedMotion: boolean
  /** True once justified geometry is ready for the first time */
  layoutReady: boolean
}

export type UseGalleryRevealResult = {
  /** True after assemble completes (or instantly under reduced motion) */
  revealComplete: boolean
  /** Surfaces should start hidden until reveal owns them */
  hideUntilRevealed: boolean
}

/**
 * One-shot priority wave reveal (GSAP). Does not replay on resize.
 */
export function useGalleryReveal({
  rootRef,
  waveOrder,
  reducedMotion,
  layoutReady,
}: UseGalleryRevealOptions): UseGalleryRevealResult {
  const [revealComplete, setRevealComplete] = useState(() => revealSession.completed)
  const waveOrderRef = useRef(waveOrder)
  waveOrderRef.current = waveOrder

  useEffect(() => {
    if (!layoutReady) return

    const root = rootRef.current
    if (!root) return

    if (revealSession.completed) {
      settleRevealSurfaces(root)
      setRevealComplete(true)
      return
    }

    if (reducedMotion) {
      settleRevealSurfaces(root)
      revealSession.started = true
      revealSession.completed = true
      setRevealComplete(true)
      return
    }

    const order = waveOrderRef.current
    if (!order || order.length === 0) {
      revealSession.completed = true
      setRevealComplete(true)
      return
    }

    // Allow a frame for virtualized rows to mount first-viewport cells
    let cancelled = false
    let timeline: ReturnType<typeof createGalleryRevealTimeline> | null = null
    const frame = window.requestAnimationFrame(() => {
      if (cancelled || revealSession.completed) return

      revealSession.started = true

      timeline = createGalleryRevealTimeline({
        root,
        waveOrder: order,
        onComplete: () => {
          revealSession.completed = true
          if (!cancelled) setRevealComplete(true)
        },
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      timeline?.kill()
    }
  }, [layoutReady, reducedMotion, rootRef])

  // Late-mounted virtualized cells after reveal: settle only unrevealed surfaces
  useEffect(() => {
    if (!revealComplete) return
    const root = rootRef.current
    if (!root) return

    settleRevealSurfaces(root, true)

    const observer = new MutationObserver(() => {
      settleRevealSurfaces(root, true)
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [revealComplete, rootRef])

  return {
    revealComplete,
    hideUntilRevealed: !revealComplete && !reducedMotion && !revealSession.completed,
  }
}

/** Test helper — reset session between unit tests if needed. */
export function __resetGalleryRevealSessionForTests(): void {
  revealSession.started = false
  revealSession.completed = false
}
