import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'

import { GalleryRow } from '@/components/gallery/GalleryRow'
import { useGallery } from '@/context/GalleryContext'
import { useViewer } from '@/context/ViewerContext'
import { useContainerWidth } from '@/hooks/useContainerWidth'
import { useGalleryAmbient } from '@/hooks/useGalleryAmbient'
import { useGalleryReveal } from '@/hooks/useGalleryReveal'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { computeGalleryLayout } from '@/lib/justified'
import { computeWaveOrder } from '@/lib/waveOrder'
import type { GalleryItem } from '@/types/gallery'

function buildItemsById(items: GalleryItem[]): ReadonlyMap<string, GalleryItem> {
  const map = new Map<string, GalleryItem>()
  for (const item of items) {
    map.set(item.id, item)
  }
  return map
}

function rowStride(
  rows: { top: number; height: number }[],
  index: number,
  paddingBottom: number,
): number {
  const row = rows[index]
  if (!row) return 0
  const next = rows[index + 1]
  if (next) return Math.max(0, next.top - row.top)
  return row.height + paddingBottom
}

/**
 * Virtualized justified gallery wall with wave reveal + ambient life.
 * Opens the dark-room viewer via ImageCard activation (Phase 4A).
 */
export function JustifiedGallery() {
  const { items, loading, error, reload } = useGallery()
  const { isOpen, currentId } = useViewer()
  const wallInactive = isOpen || currentId != null
  const { ref: widthRef, width } = useContainerWidth<HTMLDivElement>()
  const listRef = useRef<HTMLDivElement | null>(null)
  const planeRef = useRef<HTMLDivElement | null>(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  /** Freeze first ready layout signature for wave order — resize must not rebuild order mid-session. */
  const initialWaveRef = useRef<ReturnType<typeof computeWaveOrder> | null>(null)

  const layout = useMemo(() => {
    if (width <= 0 || items.length === 0) return null
    return computeGalleryLayout(items, width)
  }, [items, width])

  if (layout && !initialWaveRef.current) {
    initialWaveRef.current = computeWaveOrder(layout.cells)
  }

  const itemsById = useMemo(() => buildItemsById(items), [items])
  const layoutReady = layout != null && layout.itemCount > 0

  const { revealComplete, hideUntilRevealed } = useGalleryReveal({
    rootRef: planeRef,
    waveOrder: initialWaveRef.current,
    reducedMotion,
    layoutReady,
  })

  useGalleryAmbient({
    planeRef,
    reducedMotion,
    enabled: revealComplete && layoutReady && !wallInactive,
  })

  const setContainerRef = (node: HTMLDivElement | null) => {
    widthRef(node)
    listRef.current = node
  }

  useLayoutEffect(() => {
    const node = listRef.current
    if (!node) return

    const updateMargin = () => {
      const top = node.getBoundingClientRect().top + window.scrollY
      setScrollMargin((prev) => (Math.abs(prev - top) < 1 ? prev : top))
    }

    updateMargin()
    window.addEventListener('resize', updateMargin)
    return () => window.removeEventListener('resize', updateMargin)
  }, [layout?.totalHeight, layout?.rowCount, loading])

  const rowCount = layout?.rowCount ?? 0
  const paddingBottom = layout?.options.padding.bottom ?? 0
  const layoutKey = layout
    ? `${layout.containerWidth}:${layout.rowCount}:${layout.totalHeight}`
    : 'empty'

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: (index) => {
      if (!layout) return 0
      return rowStride(layout.rows, index, paddingBottom)
    },
    overscan: 2,
    scrollMargin,
  })

  const measureRef = useRef(() => {})
  measureRef.current = () => {
    virtualizer.measure()
  }

  useLayoutEffect(() => {
    measureRef.current()
  }, [layoutKey, scrollMargin])

  if (loading) {
    return (
      <div
        ref={setContainerRef}
        className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-inset)] py-[var(--space-6)] text-[color:var(--text-muted)]"
        aria-busy="true"
        aria-live="polite"
      >
        Preparing collection…
      </div>
    )
  }

  if (error) {
    return (
      <div
        ref={setContainerRef}
        className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-inset)] py-[var(--space-6)] text-[color:var(--text-muted)]"
        role="alert"
      >
        <p>Unable to load collection — {error}</p>
        <button
          type="button"
          onClick={reload}
          className="mt-[var(--space-4)] text-[color:var(--accent)] underline-offset-4 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!layout || layout.itemCount === 0) {
    return (
      <div
        ref={setContainerRef}
        className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-inset)] py-[var(--space-6)] text-[color:var(--text-muted)]"
      >
        <p>Add photographs to public/gallery/ to begin.</p>
      </div>
    )
  }

  const virtualRows = virtualizer.getVirtualItems()

  return (
    <section
      ref={setContainerRef}
      className="mx-auto w-full max-w-[var(--content-max)]"
      aria-label="Photograph gallery"
      aria-hidden={wallInactive || undefined}
    >
      <div
        ref={planeRef}
        role="list"
        aria-label="Photographs"
        className="relative w-full will-change-transform"
        style={{ height: layout.totalHeight }}
      >
        <div data-breathe-layer="" className="relative h-full w-full will-change-transform">
          {virtualRows.map((virtualRow) => {
            const row = layout.rows[virtualRow.index]
            if (!row) return null
            return (
              <GalleryRow
                key={row.index}
                row={row}
                itemsById={itemsById}
                hideUntilRevealed={hideUntilRevealed}
                reducedMotion={reducedMotion}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
