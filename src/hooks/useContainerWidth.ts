import { useEffect, useState } from 'react'

/**
 * Observe an element's content box width. Returns 0 until measured.
 * Used to drive layout from container width (not window APIs in the engine).
 */
export function useContainerWidth<T extends HTMLElement>(): {
  ref: (node: T | null) => void
  width: number
} {
  const [node, setNode] = useState<T | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!node) return

    const update = (next: number) => {
      setWidth((prev) => (Math.abs(prev - next) < 0.5 ? prev : next))
    }

    update(node.getBoundingClientRect().width)

    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => update(node.getBoundingClientRect().width)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      update(entry.contentRect.width)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return { ref: setNode, width }
}
