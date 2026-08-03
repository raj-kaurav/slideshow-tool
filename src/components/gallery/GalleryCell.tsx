import { memo, useState } from 'react'

import { ImageCard } from '@/components/gallery/ImageCard'
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
 * Reserved geometry shell for one photograph.
 * Loading, hover, and reveal participation live in ImageCard.
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

  return (
    <div
      role="listitem"
      className="absolute m-0 p-0 hover:z-10 focus-within:z-10"
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
