import { memo, useCallback } from 'react'

import { GalleryCellFallback } from '@/components/gallery/GalleryCellFallback'
import { Skeleton } from '@/components/ui/Skeleton'
import { useImageLoad } from '@/hooks/useImageLoad'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { motion, ease } from '@/lib/motion'
import { objectFitForOrientation, objectPositionForOrientation } from '@/lib/objectFit'
import type { GalleryItem } from '@/types/gallery'
import type { GalleryCell as GalleryCellGeometry } from '@/types/layout'

type GalleryCellProps = {
  cell: GalleryCellGeometry
  item: GalleryItem | undefined
  /**
   * Optional low-quality / blurred placeholder URL (LQIP).
   * When omitted, the skeleton remains until the full image loads.
   * Designed so blur-up can be wired later without refactoring this component.
   */
  placeholderSrc?: string
}

/**
 * Production gallery cell: reserved geometry + progressive image loading.
 * No hover, no viewer open, no layout shift.
 */
function GalleryCellComponent({ cell, item, placeholderSrc }: GalleryCellProps) {
  const label = item?.filename ?? 'Photograph'
  const src = item?.src
  const orientation = item?.orientation ?? 'landscape'
  const preferReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const { status, imgKey, onLoad, onError, retry, syncFromElement } = useImageLoad(src)

  const objectFit = objectFitForOrientation(orientation)
  const objectPosition = objectPositionForOrientation(orientation)

  const width = Math.max(1, Math.round(cell.width))
  const height = Math.max(1, Math.round(cell.height))
  const sizes = `${width}px`

  const showSkeleton = Boolean(src) && status !== 'loaded' && status !== 'error'
  const showPlaceholder = Boolean(placeholderSrc) && status !== 'loaded' && status !== 'error'
  const showError = status === 'error'
  const imageOpacity = status === 'loaded' ? 1 : 0

  const fadeTransition = preferReducedMotion
    ? undefined
    : `opacity ${motion.fast}ms cubic-bezier(${ease.entrance.join(', ')})`

  const handleRef = useCallback(
    (node: HTMLImageElement | null) => {
      syncFromElement(node)
    },
    [syncFromElement],
  )

  return (
    <div
      role="listitem"
      className="absolute m-0 overflow-hidden p-0"
      style={{
        left: cell.x,
        top: 0,
        width: cell.width,
        height: cell.height,
      }}
    >
      <figure
        className="relative m-0 h-full w-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus)]"
        tabIndex={0}
        aria-label={label}
        aria-busy={showSkeleton || undefined}
      >
        {/* Reserved surface — always present, locks geometry */}
        <div aria-hidden className="absolute inset-0 bg-[color:var(--bg-elevated)]" />

        {showSkeleton ? (
          <Skeleton className="absolute inset-0 z-[1] h-full w-full" />
        ) : null}

        {showPlaceholder && placeholderSrc ? (
          <img
            src={placeholderSrc}
            alt=""
            aria-hidden
            width={width}
            height={height}
            decoding="async"
            draggable={false}
            className="absolute inset-0 z-[1] h-full w-full scale-105 blur-md"
            style={{
              objectFit,
              objectPosition,
            }}
          />
        ) : null}

        {src && !showError ? (
          <img
            key={imgKey}
            ref={handleRef}
            src={src}
            alt={label}
            width={width}
            height={height}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={onLoad}
            onError={onError}
            className="absolute inset-0 z-[2] block h-full w-full"
            style={{
              objectFit,
              objectPosition,
              opacity: imageOpacity,
              transition: fadeTransition,
            }}
          />
        ) : null}

        {showError ? <GalleryCellFallback label={label} onRetry={retry} /> : null}
      </figure>
    </div>
  )
}

export const GalleryCell = memo(GalleryCellComponent)
