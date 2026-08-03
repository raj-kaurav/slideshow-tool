import { memo, useCallback, useState, type KeyboardEvent } from 'react'

import { ImageCard } from '@/components/gallery/ImageCard'
import { useViewer } from '@/context/ViewerContext'
import { motion } from '@/lib/motion'
import type { GalleryItem } from '@/types/gallery'
import type { GalleryCell as GalleryCellGeometry } from '@/types/layout'

type GalleryCellProps = {
  cell: GalleryCellGeometry
  item: GalleryItem | undefined
  placeholderSrc?: string
  hideUntilRevealed?: boolean
  reducedMotion?: boolean
}

/**
 * Reserved geometry shell — activates dark-room viewer on click / Enter / Space.
 */
function GalleryCellComponent({
  cell,
  item,
  placeholderSrc,
  hideUntilRevealed,
  reducedMotion,
}: GalleryCellProps) {
  const label = item?.filename ?? 'Photograph'
  const [focusElevated, setFocusElevated] = useState(false)
  const { open, isOpen, currentId } = useViewer()

  const isDimmed = isOpen && currentId !== item?.id
  const isActive = isOpen && currentId === item?.id

  const activate = useCallback(() => {
    if (!item?.id || isOpen) return
    open(item.id)
  }, [item?.id, isOpen, open])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        activate()
      }
    },
    [activate],
  )

  return (
    <div
      role="listitem"
      className={[
        'absolute m-0 p-0 hover:z-10 focus-within:z-10',
        'transition-[filter] ease-[var(--ease-standard)]',
        isDimmed ? 'saturate-50' : 'saturate-100',
      ].join(' ')}
      style={{
        left: cell.x,
        top: 0,
        width: cell.width,
        height: cell.height,
        transitionDuration: `${motion.viewerExpand}ms`,
      }}
    >
      <figure
        data-gallery-item={item?.id}
        className={[
          'relative m-0 h-full w-full cursor-pointer outline-none',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus)]',
        ].join(' ')}
        tabIndex={0}
        role="button"
        aria-label={`Open ${label}`}
        aria-haspopup="dialog"
        aria-current={isActive ? 'true' : undefined}
        onClick={activate}
        onKeyDown={onKeyDown}
        onFocus={() => setFocusElevated(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocusElevated(false)
          }
        }}
      >
        <ImageCard
          cell={cell}
          item={item}
          placeholderSrc={placeholderSrc}
          hideUntilRevealed={hideUntilRevealed}
          reducedMotion={reducedMotion}
          focusElevated={focusElevated}
        />
      </figure>
    </div>
  )
}

export const GalleryCell = memo(GalleryCellComponent)
