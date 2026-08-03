import { memo } from 'react'

import { GalleryCell } from '@/components/gallery/GalleryCell'
import type { GalleryItem } from '@/types/gallery'
import type { GalleryRow as GalleryRowGeometry } from '@/types/layout'

type GalleryRowProps = {
  row: GalleryRowGeometry
  itemsById: ReadonlyMap<string, GalleryItem>
  hideUntilRevealed?: boolean
  reducedMotion?: boolean
}

/**
 * Positions a single justified row.
 */
function GalleryRowComponent({
  row,
  itemsById,
  hideUntilRevealed,
  reducedMotion,
}: GalleryRowProps) {
  return (
    <div
      role="presentation"
      className="absolute m-0 p-0"
      style={{
        top: row.top,
        left: 0,
        width: '100%',
        height: row.height,
      }}
    >
      {row.cells.map((cell) => (
        <GalleryCell
          key={cell.id}
          cell={cell}
          item={itemsById.get(cell.id)}
          hideUntilRevealed={hideUntilRevealed}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}

export const GalleryRow = memo(GalleryRowComponent)
