import { contentWidth, roundPx, safeAspectRatio } from '@/lib/layoutMath'
import { resolveLayoutOptions } from '@/lib/layoutBreakpoints'
import type {
  GalleryCell,
  GalleryLayout,
  GalleryRow,
  LayoutImageInput,
  LayoutOptions,
  LayoutResult,
} from '@/types/layout'

type NormalizedImage = {
  id: string
  aspectRatio: number
}

type RowDraft = {
  items: NormalizedImage[]
}

function normalizeImages(images: LayoutImageInput[]): NormalizedImage[] {
  const result: NormalizedImage[] = []
  for (const image of images) {
    const ratio =
      image.aspectRatio && image.aspectRatio > 0
        ? image.aspectRatio
        : safeAspectRatio(image.width, image.height)
    if (!(ratio > 0) || !image.id) continue
    result.push({ id: image.id, aspectRatio: ratio })
  }
  return result
}

function sum(values: number[]): number {
  let total = 0
  for (const value of values) total += value
  return total
}

function widthsAtTargetHeight(items: NormalizedImage[], targetRowHeight: number): number[] {
  return items.map((item) => item.aspectRatio * targetRowHeight)
}

function occupiedWidth(widths: number[], spacing: number): number {
  if (widths.length === 0) return 0
  return sum(widths) + spacing * (widths.length - 1)
}

/**
 * Partition images into row drafts (unordered geometry).
 * A row closes when its ideal width at target height meets/exceeds content width,
 * including the image that tipped it (classic justified behaviour).
 */
function partitionRows(
  images: NormalizedImage[],
  contentW: number,
  options: LayoutOptions,
): RowDraft[] {
  const rows: RowDraft[] = []
  let current: NormalizedImage[] = []

  const flush = () => {
    if (current.length === 0) return
    rows.push({ items: current })
    current = []
  }

  for (const image of images) {
    const soloWidth = image.aspectRatio * options.targetRowHeight

    if (
      current.length === 0 &&
      soloWidth >= contentW * options.panoramaSoloRatio
    ) {
      rows.push({ items: [image] })
      continue
    }

    current.push(image)
    const occupied = occupiedWidth(
      widthsAtTargetHeight(current, options.targetRowHeight),
      options.spacing,
    )

    if (occupied >= contentW) {
      flush()
    }
  }

  flush()
  return rows
}

function layoutRowCells(
  draft: RowDraft,
  rowIndex: number,
  y: number,
  contentW: number,
  options: LayoutOptions,
  isLast: boolean,
): GalleryRow {
  const widthsTarget = widthsAtTargetHeight(draft.items, options.targetRowHeight)
  const gaps = options.spacing * Math.max(0, draft.items.length - 1)
  const available = Math.max(0, contentW - gaps)
  const base = sum(widthsTarget)

  let justify = !isLast || options.lastRow === 'justify'

  if (isLast && options.lastRow === 'justify' && base > 0) {
    const scaleProbe = available / base
    if (scaleProbe > options.maxRowScale) {
      justify = false
    }
  }

  let scale = 1
  if (base > 0) {
    if (justify) {
      const fitScale = available / base
      const clamped = Math.min(options.maxRowScale, Math.max(options.minRowScale, fitScale))
      const clampedWidths = widthsTarget.map((w) => w * clamped)
      // Prefer clamp when it still fits; otherwise keep exact fit (may go below minRowScale).
      if (occupiedWidth(clampedWidths, options.spacing) <= contentW + 0.5) {
        scale = clamped
      } else {
        scale = fitScale
      }
    } else {
      const natural = occupiedWidth(widthsTarget, options.spacing)
      if (natural > contentW) {
        scale = available / base
        justify = true
      }
    }
  }

  const widths = widthsTarget.map((w) => roundPx(w * scale))
  let height = roundPx(options.targetRowHeight * scale)

  if (justify && widths.length === 1) {
    const only = draft.items[0]
    widths[0] = roundPx(available)
    if (only && only.aspectRatio > 0) {
      height = roundPx(available / only.aspectRatio)
    }
  } else if (justify && widths.length > 0) {
    const usedBeforeLast = sum(widths.slice(0, -1))
    widths[widths.length - 1] = Math.max(0, roundPx(available - usedBeforeLast))
  }
  const rowWidth = roundPx(sum(widths) + gaps)

  let x = options.padding.left
  if (isLast && options.lastRow === 'center' && !justify) {
    x = roundPx(options.padding.left + Math.max(0, contentW - rowWidth) / 2)
  }

  const cells: GalleryCell[] = []
  for (let i = 0; i < draft.items.length; i += 1) {
    const item = draft.items[i]
    const width = widths[i] ?? 0
    if (!item) continue

    cells.push({
      id: item.id,
      x: roundPx(x),
      y: roundPx(y),
      width,
      height,
      aspectRatio: item.aspectRatio,
      rowIndex,
      indexInRow: i,
    })
    x += width + options.spacing
  }

  return {
    index: rowIndex,
    cells,
    top: roundPx(y),
    height,
    width: rowWidth,
  }
}

/**
 * Flickr-style justified layout engine.
 * Pure + deterministic for identical inputs. No DOM.
 */
export function computeJustifiedLayout(
  images: LayoutImageInput[],
  optionsInput: LayoutOptions | number,
): LayoutResult {
  const options: LayoutOptions =
    typeof optionsInput === 'number' ? resolveLayoutOptions(optionsInput) : optionsInput

  const contentW = contentWidth(options.containerWidth, options.padding)
  const normalized = normalizeImages(images)

  if (normalized.length === 0 || contentW <= 0 || options.targetRowHeight <= 0) {
    return {
      rows: [],
      cells: [],
      itemCount: 0,
      rowCount: 0,
      containerWidth: options.containerWidth,
      contentWidth: Math.max(0, contentW),
      totalHeight: roundPx(options.padding.top + options.padding.bottom),
      options,
    }
  }

  const drafts = partitionRows(normalized, contentW, options)
  const rows: GalleryRow[] = []
  let y = options.padding.top

  for (let index = 0; index < drafts.length; index += 1) {
    const draft = drafts[index]
    if (!draft) continue
    const row = layoutRowCells(
      draft,
      index,
      y,
      contentW,
      options,
      index === drafts.length - 1,
    )
    rows.push(row)
    y += row.height + options.spacing
  }

  const cells = rows.flatMap((row) => row.cells)
  const last = rows[rows.length - 1]
  const totalHeight = last
    ? roundPx(last.top + last.height + options.padding.bottom)
    : roundPx(options.padding.top + options.padding.bottom)

  return {
    rows,
    cells,
    itemCount: cells.length,
    rowCount: rows.length,
    containerWidth: options.containerWidth,
    contentWidth: contentW,
    totalHeight,
    options,
  }
}

/** Resolve responsive options from container width, then layout. */
export function computeGalleryLayout(
  images: LayoutImageInput[],
  containerWidth: number,
  overrides?: Partial<LayoutOptions>,
): GalleryLayout {
  return computeJustifiedLayout(images, resolveLayoutOptions(containerWidth, overrides))
}

export function averageRowHeight(layout: LayoutResult): number {
  if (layout.rows.length === 0) return 0
  const total = layout.rows.reduce((acc, row) => acc + row.height, 0)
  return roundPx(total / layout.rows.length)
}
