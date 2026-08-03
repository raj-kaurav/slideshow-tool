import { useCallback, useEffect, useState } from 'react'

export type ImageLoadStatus = 'idle' | 'loading' | 'loaded' | 'error'

type UseImageLoadResult = {
  status: ImageLoadStatus
  /** Bump to remount the image after an error. */
  attempt: number
  imgKey: string
  onLoad: () => void
  onError: () => void
  retry: () => void
  /**
   * Call when the img element may already be complete (browser cache).
   * Safe to invoke from a ref callback or layout effect.
   */
  syncFromElement: (img: HTMLImageElement | null) => void
}

/**
 * Track progressive image load state with retry-safe remounts.
 * Does not fetch — binds to an <img> via onLoad / onError.
 */
export function useImageLoad(src: string | undefined): UseImageLoadResult {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<ImageLoadStatus>(() => (src ? 'loading' : 'idle'))

  useEffect(() => {
    setStatus(src ? 'loading' : 'idle')
  }, [src, attempt])

  const onLoad = useCallback(() => {
    setStatus('loaded')
  }, [])

  const onError = useCallback(() => {
    setStatus('error')
  }, [])

  const retry = useCallback(() => {
    setAttempt((n) => n + 1)
  }, [])

  const syncFromElement = useCallback((img: HTMLImageElement | null) => {
    if (!img || !src) return
    if (img.complete && img.naturalWidth > 0) {
      setStatus('loaded')
    }
  }, [src])

  const imgKey = src ? `${src}::${attempt}` : `empty::${attempt}`

  return { status, attempt, imgKey, onLoad, onError, retry, syncFromElement }
}
