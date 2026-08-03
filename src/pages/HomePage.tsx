import { CollectionHeader } from '@/components/brand/CollectionHeader'
import { JustifiedGallery } from '@/components/gallery/JustifiedGallery'
import { useGallery } from '@/context/GalleryContext'

/**
 * Home — collection header + premium gallery experience (Phase 3D).
 * Viewer / toolbar / search arrive in later phases.
 */
export function HomePage() {
  const { productName, collectionMeta, items, loading, error } = useGallery()

  return (
    <main className="min-h-dvh">
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
