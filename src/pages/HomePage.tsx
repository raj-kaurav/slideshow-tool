import { CollectionHeader } from '@/components/brand/CollectionHeader'
import { JustifiedGallery } from '@/components/gallery/JustifiedGallery'
import { useGallery } from '@/context/GalleryContext'
import { useViewer } from '@/context/ViewerContext'

/**
 * Home — collection header + gallery wall.
 * Dark-room viewer mounts at App level (Phase 4A).
 */
export function HomePage() {
  const { productName, collectionMeta, items, loading, error } = useGallery()
  const { isOpen, currentId } = useViewer()
  /** Keep the wall inert until exit animation finishes and currentId clears. */
  const wallInactive = isOpen || currentId != null

  return (
    <main className="min-h-dvh" aria-hidden={wallInactive || undefined}>
      <CollectionHeader
        productName={productName}
        collectionMeta={collectionMeta}
        imageCount={loading || error ? undefined : items.length}
      />
      <h2 className="sr-only">Gallery</h2>
      <JustifiedGallery />
    </main>
  )
}
