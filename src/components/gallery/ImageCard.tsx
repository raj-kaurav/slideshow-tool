import { memo, useCallback, useState } from 'react'
import { motion as fm } from 'framer-motion'

import { GalleryCellFallback } from '@/components/gallery/GalleryCellFallback'
import { Skeleton } from '@/components/ui/Skeleton'
import { photoLayoutId, useViewer } from '@/context/ViewerContext'
import { useImageLoad } from '@/hooks/useImageLoad'
import { REVEAL_ID_ATTR, REVEAL_SURFACE_ATTR, REVEALED_ATTR } from '@/lib/galleryReveal'
import { ease, motion, motionLimits, spring } from '@/lib/motion'
import { objectFitForOrientation, objectPositionForOrientation } from '@/lib/objectFit'
import type { GalleryItem } from '@/types/gallery'
import type { GalleryCell as GalleryCellGeometry } from '@/types/layout'

export type ImageCardProps = {
  cell: GalleryCellGeometry
  item: GalleryItem | undefined
  placeholderSrc?: string
  hideUntilRevealed?: boolean
  reducedMotion?: boolean
  focusElevated?: boolean
}

/**
 * Photograph inside a reserved cell — load, hover, reveal, shared-element handoff.
 */
function ImageCardComponent({
  cell,
  item,
  placeholderSrc,
  hideUntilRevealed = false,
  reducedMotion = false,
  focusElevated = false,
}: ImageCardProps) {
  const label = item?.filename ?? 'Photograph'
  const src = item?.src
  const orientation = item?.orientation ?? 'landscape'
  const [hovered, setHovered] = useState(false)
  const { isOpen, currentId } = useViewer()

  const sharedAway = Boolean(item && isOpen && currentId === item.id)
  const elevated = (hovered || focusElevated) && !sharedAway

  const { status, imgKey, onLoad, onError, retry, syncFromElement } = useImageLoad(src)

  const objectFit = objectFitForOrientation(orientation)
  const objectPosition = objectPositionForOrientation(orientation)

  const width = Math.max(1, Math.round(cell.width))
  const height = Math.max(1, Math.round(cell.height))
  const sizes = `${width}px`

  const showSkeleton = Boolean(src) && status !== 'loaded' && status !== 'error' && !sharedAway
  const showPlaceholder = Boolean(placeholderSrc) && status !== 'loaded' && status !== 'error' && !sharedAway
  const showError = status === 'error'
  const imageOpacity = status === 'loaded' ? 1 : 0
  const showSharedImage = Boolean(src) && !showError && !sharedAway

  const fadeTransition = reducedMotion
    ? undefined
    : `opacity ${motion.fast}ms cubic-bezier(${ease.entrance.join(', ')})`

  const handleRef = useCallback(
    (node: HTMLImageElement | null) => {
      syncFromElement(node)
    },
    [syncFromElement],
  )

  const hoverTransition = reducedMotion
    ? { duration: motion.hover / 1000, ease: ease.standard }
    : spring.hover

  const hoverRest = { scale: 1, filter: 'brightness(1)' }
  const hoverActive = reducedMotion
    ? { scale: 1, filter: `brightness(${motionLimits.hoverBrightness})` }
    : {
        scale: motionLimits.maxHoverScale,
        filter: `brightness(${motionLimits.hoverBrightness})`,
      }

  const layoutId =
    item && !reducedMotion && status === 'loaded' && !isOpen
      ? photoLayoutId(item.id)
      : undefined

  return (
    <div
      {...{
        [REVEAL_SURFACE_ATTR]: '',
        [REVEAL_ID_ATTR]: cell.id,
        ...(hideUntilRevealed ? {} : { [REVEALED_ATTR]: '' }),
      }}
      className="h-full w-full will-change-transform"
      aria-busy={showSkeleton || undefined}
    >
      <div data-parallax-cell="" className="h-full w-full">
        <fm.div
          className={[
            'relative h-full w-full overflow-hidden rounded-[var(--radius-image)]',
            elevated && !reducedMotion ? 'shadow-[var(--shadow-hover)]' : '',
          ].join(' ')}
          initial={false}
          animate={elevated ? hoverActive : hoverRest}
          transition={hoverTransition}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
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
              style={{ objectFit, objectPosition }}
            />
          ) : null}

          {showSharedImage ? (
            <fm.img
              key={imgKey}
              ref={handleRef}
              layoutId={layoutId}
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
                transition: layoutId ? undefined : fadeTransition,
              }}
              transition={layoutId ? spring.shared : undefined}
            />
          ) : null}

          {showError ? <GalleryCellFallback label={label} onRetry={retry} /> : null}

          <span
            aria-hidden
            className={[
              'pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-[var(--space-2)] py-[var(--space-2)]',
              'bg-gradient-to-t from-black/40 to-transparent',
              'text-[length:var(--text-caption)] text-[color:var(--text)]',
              'transition-opacity duration-[var(--motion-hover)] ease-[var(--ease-standard)]',
              elevated ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          >
            <span className="line-clamp-1">{label}</span>
          </span>
        </fm.div>
      </div>
    </div>
  )
}

export const ImageCard = memo(ImageCardComponent)
