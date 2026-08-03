import type { CollectionMeta } from '@/types/gallery'

type CollectionHeaderProps = {
  productName: string
  collectionMeta?: CollectionMeta
  imageCount?: number
}

function buildMetaLine(meta: CollectionMeta, imageCount?: number): string | null {
  const parts: string[] = []
  if (typeof imageCount === 'number') {
    parts.push(`${imageCount} Photograph${imageCount === 1 ? '' : 's'}`)
  }
  if (meta.dateRange) parts.push(`Captured ${meta.dateRange}`)
  if (meta.location) parts.push(meta.location)
  if (meta.photographer) parts.push(meta.photographer)
  return parts.length > 0 ? parts.join(' · ') : null
}

export function CollectionHeader({
  productName,
  collectionMeta = {},
  imageCount,
}: CollectionHeaderProps) {
  const metaLine = buildMetaLine(collectionMeta, imageCount)

  return (
    <header className="px-[var(--page-inset)] pt-[var(--space-8)] pb-[var(--space-7)]">
      <h1 className="font-display text-[length:var(--text-display)] leading-[1.1] tracking-[-0.02em] text-[color:var(--text)]">
        {productName}
      </h1>
      {collectionMeta.title ? (
        <h2 className="mt-[var(--space-3)] font-display text-[length:var(--text-heading)] leading-[1.2] text-[color:var(--text)]">
          {collectionMeta.title}
        </h2>
      ) : null}
      {metaLine ? (
        <p className="mt-[var(--space-4)] text-[length:var(--text-body-lg)] text-[color:var(--text-muted)]">
          {metaLine}
        </p>
      ) : null}
    </header>
  )
}
