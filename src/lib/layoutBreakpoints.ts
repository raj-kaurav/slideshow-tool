import { resolvePadding } from '@/lib/layoutMath'
import type { LayoutBreakpoint, LayoutOptions } from '@/types/layout'

/**
 * Default breakpoints keyed by container width (not viewport APIs).
 * Aligns with Architecture responsive row-height guidance.
 */
export const DEFAULT_LAYOUT_BREAKPOINTS: readonly LayoutBreakpoint[] = [
  {
    minContainerWidth: 0,
    targetRowHeight: 140,
    spacing: 8,
    padding: { top: 0, right: 16, bottom: 48, left: 16 },
    lastRow: 'left',
  },
  {
    minContainerWidth: 640,
    targetRowHeight: 200,
    spacing: 10,
    padding: { top: 0, right: 24, bottom: 56, left: 24 },
    lastRow: 'left',
  },
  {
    minContainerWidth: 1024,
    targetRowHeight: 240,
    spacing: 12,
    padding: { top: 0, right: 40, bottom: 64, left: 40 },
    lastRow: 'left',
  },
  {
    minContainerWidth: 1440,
    targetRowHeight: 260,
    spacing: 12,
    padding: { top: 0, right: 48, bottom: 80, left: 48 },
    lastRow: 'left',
  },
  {
    minContainerWidth: 1800,
    targetRowHeight: 280,
    spacing: 12,
    padding: { top: 0, right: 48, bottom: 96, left: 48 },
    lastRow: 'left',
  },
] as const

export const DEFAULT_LAYOUT_LIMITS = {
  maxRowScale: 1.35,
  minRowScale: 0.65,
  panoramaSoloRatio: 0.92,
} as const

function pickBreakpoint(
  containerWidth: number,
  breakpoints: readonly LayoutBreakpoint[],
): LayoutBreakpoint {
  let chosen = breakpoints[0]
  if (!chosen) {
    throw new Error('Layout breakpoints must not be empty')
  }

  for (const bp of breakpoints) {
    if (containerWidth >= bp.minContainerWidth) {
      chosen = bp
    }
  }
  return chosen
}

/**
 * Resolve full LayoutOptions from container width + optional overrides.
 * Container width drives the result — no window/viewport reads here.
 */
export function resolveLayoutOptions(
  containerWidth: number,
  overrides: Partial<LayoutOptions> = {},
  breakpoints: readonly LayoutBreakpoint[] = DEFAULT_LAYOUT_BREAKPOINTS,
): LayoutOptions {
  const width = Math.max(0, containerWidth)
  const bp = pickBreakpoint(width, breakpoints)

  return {
    containerWidth: width,
    targetRowHeight: overrides.targetRowHeight ?? bp.targetRowHeight,
    spacing: overrides.spacing ?? bp.spacing,
    padding: overrides.padding ?? resolvePadding(bp.padding),
    lastRow: overrides.lastRow ?? bp.lastRow ?? 'left',
    maxRowScale: overrides.maxRowScale ?? DEFAULT_LAYOUT_LIMITS.maxRowScale,
    minRowScale: overrides.minRowScale ?? DEFAULT_LAYOUT_LIMITS.minRowScale,
    panoramaSoloRatio: overrides.panoramaSoloRatio ?? DEFAULT_LAYOUT_LIMITS.panoramaSoloRatio,
  }
}
