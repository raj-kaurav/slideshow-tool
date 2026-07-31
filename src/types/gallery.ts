export type Orientation = 'landscape' | 'portrait' | 'square' | 'panorama'

export type CollectionMeta = {
  title?: string
  location?: string
  dateRange?: string
  photographer?: string
}

/** Populated in Phase 2+ from the gallery manifest. */
export type GalleryItem = {
  id: string
  src: string
  filename: string
  width: number
  height: number
  orientation: Orientation
  mtime?: number
  bytes?: number
}
