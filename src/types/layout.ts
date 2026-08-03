/** Pure layout geometry types — no DOM / React. */

export type LayoutPadding = {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * How to treat the final row when it would not naturally fill the width.
 * - `left` — keep near target height; left-align (default; avoids awkward stretch)
 * - `justify` — scale to fill width like other rows
 * - `center` — like `left`, but center the group in the content box
 */
export type LastRowBehavior = 'left' | 'justify' | 'center'

/** Breakpoint keyed by minimum container width (px), ascending. */
export type LayoutBreakpoint = {
  /** Inclusive minimum container width for this config */
  minContainerWidth: number
  targetRowHeight: number
  spacing: number
  padding: number | LayoutPadding
  lastRow?: LastRowBehavior
}

export type LayoutOptions = {
  containerWidth: number
  targetRowHeight: number
  /** Gap between cells (horizontal) and between rows (vertical). */
  spacing: number
  padding: LayoutPadding
  lastRow: LastRowBehavior
  /**
   * If justifying a row would scale height above `targetRowHeight * maxRowScale`,
   * stop adding items earlier (completed rows) or fall back to non-stretch for last row.
   */
  maxRowScale: number
  /** Minimum scale when justifying (rarely binds). */
  minRowScale: number
  /**
   * If an item’s width at target height is ≥ contentWidth * this ratio, place it alone.
   * Helps panoramas.
   */
  panoramaSoloRatio: number
}

/** Minimal input for layout — typically mapped from GalleryItem. */
export type LayoutImageInput = {
  id: string
  width: number
  height: number
  /** Optional; computed from width/height when omitted */
  aspectRatio?: number
}

export type GalleryCell = {
  id: string
  x: number
  y: number
  width: number
  height: number
  aspectRatio: number
  rowIndex: number
  indexInRow: number
}

export type GalleryRow = {
  index: number
  cells: GalleryCell[]
  /** Row box top (includes cumulative spacing; padding.top already applied to first row) */
  top: number
  height: number
  /** Sum of cell widths + inner gaps (should equal contentWidth when justified) */
  width: number
}

export type LayoutResult = {
  rows: GalleryRow[]
  /** Flattened cells in reading order */
  cells: GalleryCell[]
  itemCount: number
  rowCount: number
  containerWidth: number
  contentWidth: number
  totalHeight: number
  options: LayoutOptions
}

/** Alias used by Architecture / Glossary naming. */
export type GalleryLayout = LayoutResult

export type LayoutValidationIssueCode =
  | 'overlap'
  | 'negative-dimension'
  | 'row-overflow'
  | 'aspect-mismatch'
  | 'non-deterministic-risk'
  | 'empty-ok'

export type LayoutValidationIssue = {
  code: LayoutValidationIssueCode
  message: string
  cellId?: string
  rowIndex?: number
}

export type LayoutValidationResult = {
  ok: boolean
  issues: LayoutValidationIssue[]
}
