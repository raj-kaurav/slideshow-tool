import { CollectionHeader } from '@/components/brand/CollectionHeader'
import { useGallery } from '@/context/GalleryContext'

/**
 * Phase 2 home shell — proves manifest loading via GalleryContext.
 * Gallery wall arrives in Phase 3.
 */
export function HomePage() {
  const { productName, collectionMeta, items, loading, error, reload } = useGallery()

  const statusLine = loading
    ? 'Loading collection…'
    : error
      ? `Unable to load collection — ${error}`
      : `${items.length} Photograph${items.length === 1 ? '' : 's'} loaded`

  return (
    <main className="min-h-[200vh]">
      <CollectionHeader
        productName={productName}
        collectionMeta={collectionMeta}
        imageCount={loading || error ? undefined : items.length}
      />
      <section
        aria-live="polite"
        className="px-[var(--page-inset)] pb-[var(--space-8)] text-[length:var(--text-body-lg)] text-[color:var(--text-muted)]"
      >
        <p>{statusLine}</p>
        {error ? (
          <button
            type="button"
            onClick={reload}
            className="mt-[var(--space-4)] text-[color:var(--accent)] underline-offset-4 hover:underline"
          >
            Retry
          </button>
        ) : null}
        {collectionMeta.description && !loading && !error ? (
          <p className="mt-[var(--space-3)] max-w-2xl text-[length:var(--text-body)] text-[color:var(--text-faint)]">
            {collectionMeta.description}
          </p>
        ) : null}
      </section>
    </main>
  )
}
