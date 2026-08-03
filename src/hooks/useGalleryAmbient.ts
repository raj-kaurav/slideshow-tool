import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import { motion, motionLimits } from '@/lib/motion'

export type UseGalleryAmbientOptions = {
  /** Outer plane — pointer parallax translate */
  planeRef: React.RefObject<HTMLElement | null>
  reducedMotion: boolean
  /** Ambient starts after wave settle */
  enabled: boolean
}

function randomPeriodMs(): number {
  const span = motion.breathePeriodMax - motion.breathePeriodMin
  return motion.breathePeriodMin + Math.random() * span
}

/**
 * Pointer parallax (3–8px, nearby cells stronger) + nearly invisible breathing.
 * Stops completely when the pointer leaves the plane.
 * Compositor-only transforms / filter.
 *
 * Expects:
 * - `planeRef` → parallax layer
 * - child `[data-breathe-layer]` → breathing y + brightness
 * - descendants `[data-parallax-cell]` → local micro-shift
 */
export function useGalleryAmbient({
  planeRef,
  reducedMotion,
  enabled,
}: UseGalleryAmbientOptions): void {
  const pointerInside = useRef(false)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const breatheTween = useRef<gsap.core.Tween | null>(null)
  const breatheDelay = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const plane = planeRef.current
    if (!plane || reducedMotion || !enabled) {
      if (plane) {
        gsap.set(plane, { x: 0, y: 0, clearProps: 'transform' })
        const breathe = plane.querySelector<HTMLElement>('[data-breathe-layer]')
        if (breathe) gsap.set(breathe, { y: 0, filter: 'none', clearProps: 'transform,filter' })
        plane.querySelectorAll<HTMLElement>('[data-parallax-cell]').forEach((cell) => {
          gsap.set(cell, { x: 0, y: 0, clearProps: 'transform' })
        })
      }
      return
    }

    const breatheLayer =
      plane.querySelector<HTMLElement>('[data-breathe-layer]') ?? plane
    const maxPx = motionLimits.maxParallaxPx
    const minPx = motionLimits.minParallaxPx
    const amplitude = (minPx + maxPx) / 2

    const stopBreathing = () => {
      breatheTween.current?.kill()
      breatheTween.current = null
      breatheDelay.current?.kill()
      breatheDelay.current = null
      gsap.set(breatheLayer, { y: 0, filter: 'brightness(1)' })
    }

    const startBreathing = () => {
      stopBreathing()
      const period = randomPeriodMs() / 1000
      breatheTween.current = gsap.to(breatheLayer, {
        y: motionLimits.breatheAmplitudePx,
        filter: 'brightness(1.015)',
        duration: period / 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          if (!pointerInside.current) return
          breatheDelay.current = gsap.delayedCall(0.4, () => {
            if (pointerInside.current) startBreathing()
          })
        },
      })
    }

    const applyCellParallax = (pointerX: number, pointerY: number, strength: number) => {
      const cells = plane.querySelectorAll<HTMLElement>('[data-parallax-cell]')
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = pointerX - cx
        const dy = pointerY - cy
        const dist = Math.hypot(dx, dy)
        const influence = Math.max(0, 1 - dist / 720)
        const local = influence * strength * 0.45
        gsap.set(cell, {
          x: (dx / 720) * local * -1,
          y: (dy / 720) * local * -1,
          force3D: true,
        })
      })
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08
      current.current.y += (target.current.y - current.current.y) * 0.08

      gsap.set(plane, {
        x: current.current.x,
        y: current.current.y,
        force3D: true,
      })

      rafRef.current = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = plane.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5
      const ny = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5
      target.current.x = Math.max(-maxPx, Math.min(maxPx, nx * amplitude * 2))
      target.current.y = Math.max(-maxPx, Math.min(maxPx, ny * amplitude * 2))

      const strength = Math.hypot(target.current.x, target.current.y)
      applyCellParallax(event.clientX, event.clientY, strength)
    }

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointerInside.current = true
      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(tick)
      }
      startBreathing()
    }

    const onPointerLeave = () => {
      pointerInside.current = false
      target.current.x = 0
      target.current.y = 0
      stopBreathing()
      plane.querySelectorAll<HTMLElement>('[data-parallax-cell]').forEach((cell) => {
        gsap.to(cell, { x: 0, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
      })
      gsap.to(plane, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    plane.addEventListener('pointerenter', onPointerEnter)
    plane.addEventListener('pointermove', onPointerMove)
    plane.addEventListener('pointerleave', onPointerLeave)

    return () => {
      pointerInside.current = false
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      stopBreathing()
      plane.removeEventListener('pointerenter', onPointerEnter)
      plane.removeEventListener('pointermove', onPointerMove)
      plane.removeEventListener('pointerleave', onPointerLeave)
      gsap.set(plane, { x: 0, y: 0, clearProps: 'transform' })
      gsap.set(breatheLayer, { y: 0, filter: 'none', clearProps: 'transform,filter' })
      plane.querySelectorAll<HTMLElement>('[data-parallax-cell]').forEach((cell) => {
        gsap.set(cell, { x: 0, y: 0, clearProps: 'transform' })
      })
    }
  }, [planeRef, reducedMotion, enabled])
}
