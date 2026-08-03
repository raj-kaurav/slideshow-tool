import type { GalleryCell } from '@/types/layout'

export type WaveOrderEntry = {
  id: string
  /** Priority score — higher reveals earlier (hero / larger first) */
  score: number
  /** Stable organic stagger offset within the 15–25ms band (0–1) */
  staggerNoise: number
}

/**
 * Deterministic hash in [0, 1) from an id string — keeps stagger organic but stable.
 */
function unitNoise(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

/**
 * Priority wave order: larger / hero cells earlier, with stable organic noise.
 * Pure — safe for tests and replay-free layout recomputes.
 */
export function computeWaveOrder(cells: readonly GalleryCell[]): WaveOrderEntry[] {
  const entries: WaveOrderEntry[] = cells.map((cell) => {
    const area = Math.max(0, cell.width) * Math.max(0, cell.height)
    const rowBias = 1 / (1 + cell.rowIndex * 0.08)
    const noise = unitNoise(cell.id)
    // Slight noise so equal-area cells do not lockstep; area still dominates.
    const score = area * rowBias * (0.92 + noise * 0.16)
    return {
      id: cell.id,
      score,
      staggerNoise: noise,
    }
  })

  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.id.localeCompare(b.id)
  })

  return entries
}

/** Map of cell id → wave index (0 = first to reveal). */
export function waveIndexById(cells: readonly GalleryCell[]): ReadonlyMap<string, number> {
  const order = computeWaveOrder(cells)
  const map = new Map<string, number>()
  order.forEach((entry, index) => {
    map.set(entry.id, index)
  })
  return map
}
