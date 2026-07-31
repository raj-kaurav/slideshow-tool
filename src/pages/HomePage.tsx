import { CollectionHeader } from '@/components/brand/CollectionHeader'
import { JustifiedGallery } from '@/components/gallery/JustifiedGallery'
import { useGallery } from '@/context/GalleryContext'

/**
 * Phase 3B — gallery wall (structure only; no wave / hover / viewer).
 */
export function HomePage() {
  const { productName, collectionMeta, items, loading, error } = useGallery()

  return (
    <main>
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
