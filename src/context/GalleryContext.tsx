import { createContext, useContext, useMemo, type ReactNode } from 'react'

import type { CollectionMeta, GalleryItem } from '@/types/gallery'

type GalleryContextValue = {
  items: GalleryItem[]
  collectionMeta: CollectionMeta
  productName: string
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

const EMPTY_ITEMS: GalleryItem[] = []
const EMPTY_META: CollectionMeta = {}

type GalleryProviderProps = {
  children: ReactNode
}

/**
 * Phase 1 shell — provides stable empty collection state.
 * Manifest loading arrives in Phase 2.
 */
export function GalleryProvider({ children }: GalleryProviderProps) {
  const value = useMemo<GalleryContextValue>(
    () => ({
      items: EMPTY_ITEMS,
      collectionMeta: EMPTY_META,
      productName: 'Gallery Experience',
    }),
    [],
  )

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext)
  if (!ctx) {
    throw new Error('useGallery must be used within GalleryProvider')
  }
  return ctx
}
