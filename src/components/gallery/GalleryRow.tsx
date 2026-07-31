import { memo } from 'react'

import { GalleryCell } from '@/components/gallery/GalleryCell'
import type { GalleryItem } from '@/types/gallery'
import type { GalleryRow as GalleryRowGeometry } from '@/types/layout'

type GalleryRowProps = {
  row: GalleryRowGeometry
  itemsById: ReadonlyMap<string, GalleryItem>
}

/**
 * Positions a single justified row. No hover / animation / loading logic.
 */
function GalleryRowComponent({ row, itemsById }: GalleryRowProps) {
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
        <GalleryCell key={cell.id} cell={cell} item={itemsById.get(cell.id)} />
      ))}
    </div>
  )
}

export const GalleryRow = memo(GalleryRowComponent)
