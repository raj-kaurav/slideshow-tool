const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'avif',
  'gif',
  'tif',
  'tiff',
])

export function normalizeRelativePath(relativePath: string): string {
  return relativePath.replace(/\\/g, '/').replace(/^\/+/, '')
}

export function getExtension(filename: string): string {
  const base = filename.split('/').pop() ?? filename
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return ''
  return base.slice(dot + 1).toLowerCase()
}

export function isSupportedImageExtension(ext: string): boolean {
  return IMAGE_EXTENSIONS.has(ext.toLowerCase())
}

export function isHiddenPathSegment(segment: string): boolean {
  return segment.startsWith('.')
}

export function isHiddenRelativePath(relativePath: string): boolean {
  return normalizeRelativePath(relativePath)
    .split('/')
    .filter(Boolean)
    .some(isHiddenPathSegment)
}

/** Stable non-cryptographic id from a relative gallery path. */
export function createItemId(relativePath: string): string {
  const normalized = normalizeRelativePath(relativePath)
  let hash = 2166136261
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return `img_${(hash >>> 0).toString(16).padStart(8, '0')}`
}

/** Public URL for a file under `public/gallery/`. */
export function toPublicSrc(relativePath: string): string {
  return `/gallery/${normalizeRelativePath(relativePath)}`
}

export function filenameFromRelativePath(relativePath: string): string {
  const normalized = normalizeRelativePath(relativePath)
  const parts = normalized.split('/')
  return parts[parts.length - 1] ?? normalized
}

export function isValidImageFilename(filename: string): boolean {
  if (!filename || filename.trim() !== filename) return false
  if (filename.includes('..')) return false
  if (filename.includes('\u0000')) return false
  if (/[<>:"|?*]/.test(filename)) return false
  const ext = getExtension(filename)
  return isSupportedImageExtension(ext)
}

export const SUPPORTED_IMAGE_EXTENSIONS = IMAGE_EXTENSIONS
