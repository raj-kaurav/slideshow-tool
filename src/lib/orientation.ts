import type { Orientation } from '../types/gallery.ts'

/** Panorama threshold: width / height */
export const PANORAMA_ASPECT_THRESHOLD = 2.4

export function aspectRatio(width: number, height: number): number {
  if (height <= 0) return 0
  return width / height
}

export function orientationFromDimensions(width: number, height: number): Orientation {
  if (width <= 0 || height <= 0) return 'square'

  const ratio = aspectRatio(width, height)

  if (Math.abs(width - height) / Math.max(width, height) < 0.02) {
    return 'square'
  }

  if (ratio >= PANORAMA_ASPECT_THRESHOLD) {
    return 'panorama'
  }

  if (width > height) return 'landscape'
  return 'portrait'
}
