import { memo } from 'react'

import type { GalleryItem } from '@/types/gallery'
import type { GalleryCell as GalleryCellGeometry } from '@/types/layout'

type GalleryCellProps = {
  cell: GalleryCellGeometry
  item: GalleryItem | undefined
}

/**
 * Reserved geometry cell for the justified wall.
 * Phase 3B: no hover, no transitions, no viewer open.
 */
function GalleryCellComponent({ cell, item }: GalleryCellProps) {
  const label = item?.filename ?? 'Photograph'

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
      >
        {/* Reserved box — static, no pulse animation */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[color:var(--bg-elevated)]"
        />
        {item ? (
          <img
            src={item.src}
            alt={label}
            width={Math.max(1, Math.round(cell.width))}
            height={Math.max(1, Math.round(cell.height))}
            decoding="async"
            draggable={false}
            className="relative z-[1] block h-full w-full object-cover"
          />
        ) : null}
      </figure>
    </div>
  )
}

export const GalleryCell = memo(GalleryCellComponent)
