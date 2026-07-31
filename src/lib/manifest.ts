import { isValidImageFilename } from '@/lib/path'
import type {
  CollectionMeta,
  GalleryItem,
  GalleryManifest,
  ManifestWarning,
} from '@/types/gallery'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOrientation(value: unknown): value is GalleryItem['orientation'] {
  return (
    value === 'landscape' ||
    value === 'portrait' ||
    value === 'square' ||
    value === 'panorama'
  )
}

function parseCollection(raw: unknown): CollectionMeta {
  if (!isRecord(raw)) return {}

  const pick = (key: string): string | undefined => {
    const value = raw[key]
    return typeof value === 'string' && value.trim() ? value.trim() : undefined
  }

  return {
    title: pick('title'),
    description: pick('description'),
    location: pick('location'),
    dateRange: pick('dateRange'),
    photographer: pick('photographer'),
    coverImage: pick('coverImage'),
  }
}

function parseItem(raw: unknown, index: number, warnings: ManifestWarning[]): GalleryItem | null {
  if (!isRecord(raw)) {
    warnings.push({
      code: 'invalid-manifest',
      message: `Item at index ${index} is not an object`,
    })
    return null
  }

  const id = raw.id
  const src = raw.src
  const filename = raw.filename
  const relativePath = raw.relativePath
  const width = raw.width
  const height = raw.height
  const orientation = raw.orientation
  const aspectRatio = raw.aspectRatio
  const bytes = raw.bytes
  const mtime = raw.mtime

  if (typeof id !== 'string' || !id) {
    warnings.push({
      code: 'invalid-manifest',
      message: `Item at index ${index} missing id`,
    })
    return null
  }

  if (
    typeof src !== 'string' ||
    typeof filename !== 'string' ||
    typeof relativePath !== 'string' ||
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !isOrientation(orientation) ||
    typeof aspectRatio !== 'number' ||
    typeof bytes !== 'number' ||
    typeof mtime !== 'number'
  ) {
    warnings.push({
      code: 'invalid-manifest',
      message: `Item "${id}" has invalid or missing fields`,
      path: typeof relativePath === 'string' ? relativePath : undefined,
    })
    return null
  }

  if (width <= 0 || height <= 0) {
    warnings.push({
      code: 'invalid-dimensions',
      message: `Item "${id}" has invalid dimensions ${width}×${height}`,
      path: relativePath,
    })
    return null
  }

  if (!isValidImageFilename(filename)) {
    warnings.push({
      code: 'invalid-filename',
      message: `Item "${id}" has invalid filename "${filename}"`,
      path: relativePath,
    })
  }

  return {
    id,
    src,
    filename,
    relativePath,
    width,
    height,
    orientation,
    aspectRatio,
    bytes,
    mtime,
  }
}

export type ParsedManifest = {
  manifest: GalleryManifest
  warnings: ManifestWarning[]
}

/**
 * Validate and normalize unknown JSON into a GalleryManifest.
 * Never throws — returns an empty collection on total failure.
 */
export function parseGalleryManifest(data: unknown): ParsedManifest {
  const warnings: ManifestWarning[] = []

  if (!isRecord(data)) {
    warnings.push({
      code: 'invalid-manifest',
      message: 'Manifest root must be an object',
    })
    return {
      manifest: emptyManifest(),
      warnings,
    }
  }

  const collection = parseCollection(data.collection)
  const rawItems = Array.isArray(data.items) ? data.items : null

  if (!rawItems) {
    warnings.push({
      code: 'invalid-manifest',
      message: 'Manifest items must be an array',
    })
  }

  const items: GalleryItem[] = []
  const seenIds = new Set<string>()

  for (const [index, raw] of (rawItems ?? []).entries()) {
    const item = parseItem(raw, index, warnings)
    if (!item) continue

    if (seenIds.has(item.id)) {
      warnings.push({
        code: 'duplicate-id',
        message: `Duplicate id "${item.id}" — keeping first occurrence`,
        path: item.relativePath,
      })
      continue
    }

    seenIds.add(item.id)
    items.push(item)
  }

  const metaRecord = isRecord(data.meta) ? data.meta : {}
  const generatedAt =
    typeof metaRecord.generatedAt === 'string'
      ? metaRecord.generatedAt
      : new Date().toISOString()

  const manifest: GalleryManifest = {
    meta: {
      version: 1,
      generatedAt,
      itemCount: items.length,
    },
    collection,
    items,
  }

  return { manifest, warnings }
}

export function emptyManifest(): GalleryManifest {
  return {
    meta: {
      version: 1,
      generatedAt: new Date(0).toISOString(),
      itemCount: 0,
    },
    collection: {},
    items: [],
  }
}

export function logManifestWarnings(warnings: ManifestWarning[], label = '[gallery]'): void {
  if (warnings.length === 0) return
  for (const warning of warnings) {
    const suffix = warning.path ? ` (${warning.path})` : ''
    console.warn(`${label} ${warning.code}: ${warning.message}${suffix}`)
  }
}
