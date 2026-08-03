import { useEffect, useRef, useState } from 'react'

/**
 * Dominant-color sampling for viewer tint.
 * Downscales to a tiny canvas and averages mid-tone pixels (skips near-black/white).
 * Results are cached in-memory per src.
 */
export type DominantColorResult = {
  /** CSS color string, e.g. `rgb(12, 40, 55)` */
  color: string | null
  ready: boolean
}

const colorCache = new Map<string, string>()

function averageMidtones(data: Uint8ClampedArray): string | null {
  let r = 0
  let g = 0
  let b = 0
  let n = 0

  for (let i = 0; i < data.length; i += 4) {
    const pr = data[i] ?? 0
    const pg = data[i + 1] ?? 0
    const pb = data[i + 2] ?? 0
    const pa = data[i + 3] ?? 0
    if (pa < 128) continue

    const max = Math.max(pr, pg, pb)
    const min = Math.min(pr, pg, pb)
    // Skip crushed blacks / blown whites — they wash the tint toward neutral
    if (max < 24 || min > 232) continue

    r += pr
    g += pg
    b += pb
    n += 1
  }

  if (n === 0) return null
  return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`
}

async function sampleDominantColor(src: string): Promise<string | null> {
  const img = new Image()
  img.decoding = 'async'
  img.src = src

  try {
    await img.decode()
  } catch {
    return null
  }

  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  try {
    ctx.drawImage(img, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)
    return averageMidtones(data)
  } catch {
    // Tainted canvas / decode edge case — fail quietly
    return null
  }
}

export function useDominantColor(src: string | undefined): DominantColorResult {
  const [color, setColor] = useState<string | null>(() =>
    src ? (colorCache.get(src) ?? null) : null,
  )
  const requestRef = useRef(0)

  useEffect(() => {
    if (!src) {
      setColor(null)
      return
    }

    const cached = colorCache.get(src)
    if (cached) {
      setColor(cached)
      return
    }

    const requestId = ++requestRef.current
    setColor(null)

    void sampleDominantColor(src).then((sampled) => {
      if (requestId !== requestRef.current) return
      if (sampled) colorCache.set(src, sampled)
      setColor(sampled)
    })
  }, [src])

  return { color, ready: color != null }
}
