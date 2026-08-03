/**
 * Dominant-color sampling for viewer tint — architecture only.
 * Returns null until a later phase implements canvas/OffscreenCanvas sampling.
 */
export type DominantColorResult = {
  /** CSS color string, e.g. `rgb(12, 40, 55)` — null until sampling ships */
  color: string | null
  ready: boolean
}

export function useDominantColor(_src: string | undefined): DominantColorResult {
  void _src
  return { color: null, ready: false }
}
