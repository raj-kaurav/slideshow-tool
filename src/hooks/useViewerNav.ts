import { useCallback, useEffect, useMemo, useState } from 'react'

import { useViewer } from '@/context/ViewerContext'
import type { GalleryItem } from '@/types/gallery'

export type ViewerNavDirection = -1 | 0 | 1

export type UseViewerNavResult = {
  index: number
  current: number
  total: number
  canPrev: boolean
  canNext: boolean
  direction: ViewerNavDirection
  /** True after the first in-viewer prev/next (shared-element only on initial open). */
  hasNavigated: boolean
  goPrev: () => void
  goNext: () => void
}

/**
 * In-viewer prev/next — clamps at collection edges (no wrap).
 * Does not close the viewer.
 */
export function useViewerNav(items: readonly GalleryItem[]): UseViewerNavResult {
  const { currentId, goTo, isOpen } = useViewer()
  const [direction, setDirection] = useState<ViewerNavDirection>(0)
  const [hasNavigated, setHasNavigated] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setHasNavigated(false)
      setDirection(0)
    }
  }, [isOpen])

  const index = useMemo(() => {
    if (!currentId) return -1
    return items.findIndex((entry) => entry.id === currentId)
  }, [currentId, items])

  const total = items.length
  const canPrev = index > 0
  const canNext = index >= 0 && index < total - 1

  const goPrev = useCallback(() => {
    if (index <= 0) return
    const prev = items[index - 1]
    if (!prev) return
    setDirection(-1)
    setHasNavigated(true)
    goTo(prev.id)
  }, [goTo, index, items])

  const goNext = useCallback(() => {
    if (index < 0 || index >= items.length - 1) return
    const next = items[index + 1]
    if (!next) return
    setDirection(1)
    setHasNavigated(true)
    goTo(next.id)
  }, [goTo, index, items])

  return {
    index,
    current: index >= 0 ? index + 1 : 1,
    total: Math.max(1, total),
    canPrev,
    canNext,
    direction,
    hasNavigated,
    goPrev,
    goNext,
  }
}
