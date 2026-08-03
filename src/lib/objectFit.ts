import type { Orientation } from '@/types/gallery'

export type ObjectFitMode = 'cover' | 'contain'

/**
 * Object-fit for wall cells. Boxes are already aspect-matched by the layout engine;
 * cover fills sub-pixel gaps. Panoramas keep cover + centered positioning in CSS.
 */
export function objectFitForOrientation(orientation: Orientation): ObjectFitMode {
  switch (orientation) {
    case 'panorama':
      return 'cover'
    case 'landscape':
      return 'cover'
    case 'portrait':
      return 'cover'
    case 'square':
      return 'cover'
    default: {
      const _exhaustive: never = orientation
      return _exhaustive
    }
  }
}

/** CSS object-position hint by orientation. */
export function objectPositionForOrientation(orientation: Orientation): string {
  switch (orientation) {
    case 'portrait':
      return 'center top'
    case 'panorama':
      return 'center center'
    case 'landscape':
    case 'square':
      return 'center center'
    default: {
      const _exhaustive: never = orientation
      return _exhaustive
    }
  }
}
