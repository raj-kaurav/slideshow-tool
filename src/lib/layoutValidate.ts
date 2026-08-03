import type {
  LayoutResult,
  LayoutValidationIssue,
  LayoutValidationResult,
} from '@/types/layout'

const ASPECT_EPSILON = 0.08
const OVERLAP_EPSILON = 0.05

function boxesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return !(
    a.x + a.width <= b.x + OVERLAP_EPSILON ||
    b.x + b.width <= a.x + OVERLAP_EPSILON ||
    a.y + a.height <= b.y + OVERLAP_EPSILON ||
    b.y + b.height <= a.y + OVERLAP_EPSILON
  )
}

/**
 * Development validation for justified layout output.
 * Does not throw — returns structured issues.
 */
export function validateLayout(layout: LayoutResult): LayoutValidationResult {
  const issues: LayoutValidationIssue[] = []
  const contentRight = layout.options.padding.left + layout.contentWidth

  if (layout.itemCount === 0) {
    return { ok: true, issues: [] }
  }

  for (const cell of layout.cells) {
    if (cell.width < 0 || cell.height < 0 || cell.x < 0 || cell.y < 0) {
      issues.push({
        code: 'negative-dimension',
        message: `Cell ${cell.id} has negative geometry`,
        cellId: cell.id,
        rowIndex: cell.rowIndex,
      })
    }

    if (cell.width <= 0 || cell.height <= 0) {
      issues.push({
        code: 'negative-dimension',
        message: `Cell ${cell.id} has non-positive size ${cell.width}×${cell.height}`,
        cellId: cell.id,
        rowIndex: cell.rowIndex,
      })
      continue
    }

    const actualAspect = cell.width / cell.height
    if (Math.abs(actualAspect - cell.aspectRatio) > ASPECT_EPSILON) {
      issues.push({
        code: 'aspect-mismatch',
        message: `Cell ${cell.id} aspect ${actualAspect.toFixed(4)} ≠ ${cell.aspectRatio.toFixed(4)}`,
        cellId: cell.id,
        rowIndex: cell.rowIndex,
      })
    }

    if (cell.x + cell.width > contentRight + 0.5) {
      issues.push({
        code: 'row-overflow',
        message: `Cell ${cell.id} overflows content width`,
        cellId: cell.id,
        rowIndex: cell.rowIndex,
      })
    }
  }

  for (let i = 0; i < layout.cells.length; i += 1) {
    const a = layout.cells[i]
    if (!a) continue
    for (let j = i + 1; j < layout.cells.length; j += 1) {
      const b = layout.cells[j]
      if (!b) continue
      if (boxesOverlap(a, b)) {
        issues.push({
          code: 'overlap',
          message: `Cells ${a.id} and ${b.id} overlap`,
          cellId: a.id,
          rowIndex: a.rowIndex,
        })
      }
    }
  }

  for (const row of layout.rows) {
    if (row.width > layout.contentWidth + 0.5) {
      issues.push({
        code: 'row-overflow',
        message: `Row ${row.index} width ${row.width} exceeds content ${layout.contentWidth}`,
        rowIndex: row.index,
      })
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  }
}

/** Assert two layouts match for determinism checks (dev). */
export function layoutsEqual(a: LayoutResult, b: LayoutResult): boolean {
  if (a.rowCount !== b.rowCount || a.itemCount !== b.itemCount) return false
  if (a.totalHeight !== b.totalHeight || a.contentWidth !== b.contentWidth) return false
  if (a.cells.length !== b.cells.length) return false

  for (let i = 0; i < a.cells.length; i += 1) {
    const ca = a.cells[i]
    const cb = b.cells[i]
    if (!ca || !cb) return false
    if (
      ca.id !== cb.id ||
      ca.x !== cb.x ||
      ca.y !== cb.y ||
      ca.width !== cb.width ||
      ca.height !== cb.height
    ) {
      return false
    }
  }
  return true
}

export function logLayoutValidation(
  result: LayoutValidationResult,
  label = '[gallery-layout]',
): void {
  if (result.ok) return
  for (const issue of result.issues) {
    console.warn(`${label} ${issue.code}: ${issue.message}`)
  }
}
