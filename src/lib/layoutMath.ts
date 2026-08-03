import type { LayoutPadding } from '@/types/layout'

/** Normalize padding shorthand to a full box. */
export function resolvePadding(padding: number | LayoutPadding): LayoutPadding {
  if (typeof padding === 'number') {
    return { top: padding, right: padding, bottom: padding, left: padding }
  }
  return {
    top: padding.top,
    right: padding.right,
    bottom: padding.bottom,
    left: padding.left,
  }
}

export function contentWidth(containerWidth: number, padding: LayoutPadding): number {
  return Math.max(0, containerWidth - padding.left - padding.right)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Stable pixel rounding for deterministic layout output. */
export function roundPx(value: number): number {
  return Math.round(value * 100) / 100
}

export function safeAspectRatio(width: number, height: number, fallback = 1): number {
  if (width <= 0 || height <= 0) return fallback
  return width / height
}
