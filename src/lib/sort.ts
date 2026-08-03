import type { GalleryItem } from '@/types/gallery'

export type GallerySortMode =
  | 'filename-asc'
  | 'filename-desc'
  | 'newest'
  | 'oldest'
  | 'portrait-first'
  | 'landscape-first'

function compareFilename(a: GalleryItem, b: GalleryItem): number {
  return a.filename.localeCompare(b.filename, undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

/**
 * Pure sort helpers for gallery items.
 * Not wired to UI in Phase 2 — used by later toolbar/sort work.
 */
export function sortGalleryItems(items: GalleryItem[], mode: GallerySortMode): GalleryItem[] {
  const copy = [...items]

  switch (mode) {
    case 'filename-asc':
      return copy.sort(compareFilename)
    case 'filename-desc':
      return copy.sort((a, b) => compareFilename(b, a))
    case 'newest':
      return copy.sort((a, b) => b.mtime - a.mtime || compareFilename(a, b))
    case 'oldest':
      return copy.sort((a, b) => a.mtime - b.mtime || compareFilename(a, b))
    case 'portrait-first':
      return copy.sort((a, b) => {
        const ap = a.orientation === 'portrait' ? 0 : 1
        const bp = b.orientation === 'portrait' ? 0 : 1
        return ap - bp || compareFilename(a, b)
      })
    case 'landscape-first':
      return copy.sort((a, b) => {
        const al = a.orientation === 'landscape' || a.orientation === 'panorama' ? 0 : 1
        const bl = b.orientation === 'landscape' || b.orientation === 'panorama' ? 0 : 1
        return al - bl || compareFilename(a, b)
      })
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}
