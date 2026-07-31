import { CollectionHeader } from '@/components/brand/CollectionHeader'
import { useGallery } from '@/context/GalleryContext'

/**
 * Phase 1 home shell — Collection Header only.
 * Gallery wall and toolbar arrive in later phases.
 */
export function HomePage() {
  const { productName, collectionMeta, items } = useGallery()

  return (
    <main className="min-h-[200vh]">
      <CollectionHeader
        productName={productName}
        collectionMeta={collectionMeta}
        imageCount={items.length > 0 ? items.length : undefined}
      />
    </main>
  )
}
