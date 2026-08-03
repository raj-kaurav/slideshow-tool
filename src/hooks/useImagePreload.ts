import { useEffect } from 'react'

import type { GalleryItem } from '@/types/gallery'

/**
 * Preload only N−1 and N+1 full images while the viewer is open.
 * Uses the browser decoder via Image() — never the whole album.
 */
export function useImagePreload(
  items: readonly GalleryItem[],
  index: number,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled || index < 0) return

    const urls: string[] = []
    const prev = items[index - 1]
    const next = items[index + 1]
    if (prev?.src) urls.push(prev.src)
    if (next?.src) urls.push(next.src)

    const loaders = urls.map((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      return img
    })

    return () => {
      // Drop references so GC can reclaim; abort in-flight where possible
      for (const img of loaders) {
        img.src = ''
      }
    }
  }, [enabled, index, items])
}
