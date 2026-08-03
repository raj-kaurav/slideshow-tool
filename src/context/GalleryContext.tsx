import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { emptyManifest, logManifestWarnings, parseGalleryManifest } from '@/lib/manifest'
import type { CollectionMeta, GalleryItem, GalleryManifest, ManifestWarning } from '@/types/gallery'

const MANIFEST_URL = '/gallery-manifest.json'
const PRODUCT_NAME = 'Gallery Experience'

type GalleryContextValue = {
  /** Photographs from the generated manifest (Architecture: `items`). */
  items: GalleryItem[]
  collectionMeta: CollectionMeta
  productName: string
  manifest: GalleryManifest | null
  loading: boolean
  error: string | null
  warnings: ManifestWarning[]
  reload: () => void
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

type GalleryProviderProps = {
  children: ReactNode
}

async function fetchManifest(): Promise<{
  manifest: GalleryManifest
  warnings: ManifestWarning[]
  error: string | null
}> {
  try {
    const response = await fetch(MANIFEST_URL, { cache: 'no-cache' })
    if (!response.ok) {
      return {
        manifest: emptyManifest(),
        warnings: [],
        error: `Failed to load gallery manifest (${response.status})`,
      }
    }

    const data: unknown = await response.json()
    const { manifest, warnings } = parseGalleryManifest(data)
    return { manifest, warnings, error: null }
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Unknown manifest load error'
    return {
      manifest: emptyManifest(),
      warnings: [],
      error: message,
    }
  }
}

/**
 * Loads `public/gallery-manifest.json` produced by the Vite gallery plugin.
 */
export function GalleryProvider({ children }: GalleryProviderProps) {
  const [manifest, setManifest] = useState<GalleryManifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<ManifestWarning[]>([])
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    void fetchManifest().then((result) => {
      if (cancelled) return

      logManifestWarnings(result.warnings)
      setManifest(result.manifest)
      setWarnings(result.warnings)
      setError(result.error)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const value = useMemo<GalleryContextValue>(() => {
    const items = manifest?.items ?? []
    const collectionMeta = manifest?.collection ?? {}

    return {
      items,
      collectionMeta,
      productName: PRODUCT_NAME,
      manifest,
      loading,
      error,
      warnings,
      reload,
    }
  }, [manifest, loading, error, warnings, reload])

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext)
  if (!ctx) {
    throw new Error('useGallery must be used within GalleryProvider')
  }
  return ctx
}
