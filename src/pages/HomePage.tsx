import { useMemo } from 'react'

import { CollectionHeader } from '@/components/brand/CollectionHeader'
import { useGallery } from '@/context/GalleryContext'
import { useContainerWidth } from '@/hooks/useContainerWidth'
import { averageRowHeight, computeGalleryLayout } from '@/lib/justified'
import { layoutsEqual, logLayoutValidation, validateLayout } from '@/lib/layoutValidate'

/**
 * Phase 3A — prove justified layout geometry without rendering the wall.
 */
export function HomePage() {
  const { productName, collectionMeta, items, loading, error, reload } = useGallery()
  const { ref, width } = useContainerWidth<HTMLDivElement>()

  const layoutSummary = useMemo(() => {
    if (loading || error || width <= 0) return null

    const layout = computeGalleryLayout(items, width)
    const validation = validateLayout(layout)
    logLayoutValidation(validation)

    if (import.meta.env.DEV) {
      const again = computeGalleryLayout(items, width)
      if (!layoutsEqual(layout, again)) {
        console.warn('[gallery-layout] non-deterministic-risk: repeated layout differed')
      }
    }

    return {
      photographs: layout.itemCount,
      rows: layout.rowCount,
      averageRowHeight: averageRowHeight(layout),
      totalHeight: layout.totalHeight,
      contentWidth: layout.contentWidth,
      targetRowHeight: layout.options.targetRowHeight,
      valid: validation.ok,
      issueCount: validation.issues.length,
    }
  }, [items, loading, error, width])

  const statusLine = loading
    ? 'Loading collection…'
    : error
      ? `Unable to load collection — ${error}`
      : `${items.length} Photograph${items.length === 1 ? '' : 's'} loaded`

  return (
    <main className="min-h-[100vh]">
      <CollectionHeader
        productName={productName}
        collectionMeta={collectionMeta}
        imageCount={loading || error ? undefined : items.length}
      />
      {/* Full-bleed measure node — layout engine applies its own padding from breakpoints */}
      <div ref={ref} className="w-full">
        <section
          aria-live="polite"
          className="px-[var(--page-inset)] pb-[var(--space-8)] text-[length:var(--text-body-lg)] text-[color:var(--text-muted)]"
        >
          <p>{statusLine}</p>
          {error ? (
            <button
              type="button"
              onClick={reload}
              className="mt-[var(--space-4)] text-[color:var(--accent)] underline-offset-4 hover:underline"
            >
              Retry
            </button>
          ) : null}
          {layoutSummary ? (
            <ul className="mt-[var(--space-5)] list-none space-y-[var(--space-2)] p-0 text-[length:var(--text-body)] text-[color:var(--text-faint)]">
              <li>
                {layoutSummary.photographs} photograph
                {layoutSummary.photographs === 1 ? '' : 's'}
              </li>
              <li>
                {layoutSummary.rows} row{layoutSummary.rows === 1 ? '' : 's'}
              </li>
              <li>Average row height {layoutSummary.averageRowHeight}px</li>
              <li>Target row height {layoutSummary.targetRowHeight}px</li>
              <li>Content width {Math.round(layoutSummary.contentWidth)}px</li>
              <li>Total layout height {Math.round(layoutSummary.totalHeight)}px</li>
              <li>
                Layout validation:{' '}
                {layoutSummary.valid ? 'ok' : `${layoutSummary.issueCount} issue(s)`}
              </li>
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  )
}
