import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { FitMode, SlideshowSettings, ViewerBackgroundMode } from '@/types/viewer'

type ViewerContextValue = {
  isOpen: boolean
  currentId: string | null
  fitMode: FitMode
  backgroundMode: ViewerBackgroundMode
  slideshow: SlideshowSettings
  open: (id: string) => void
  close: () => void
  setFitMode: (mode: FitMode) => void
  setBackgroundMode: (mode: ViewerBackgroundMode) => void
  setSlideshow: (settings: SlideshowSettings) => void
}

const ViewerContext = createContext<ViewerContextValue | null>(null)

const DEFAULT_SLIDESHOW: SlideshowSettings = {
  intervalSec: 5,
  loop: true,
  shuffle: false,
  kenBurns: true,
}

type ViewerProviderProps = {
  children: ReactNode
}

/**
 * Phase 1 shell — viewer remains closed; open/close API is stable for later phases.
 */
export function ViewerProvider({ children }: ViewerProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [fitMode, setFitMode] = useState<FitMode>('fit')
  const [backgroundMode, setBackgroundMode] = useState<ViewerBackgroundMode>('charcoal')
  const [slideshow, setSlideshow] = useState<SlideshowSettings>(DEFAULT_SLIDESHOW)

  const open = useCallback((id: string) => {
    setCurrentId(id)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setCurrentId(null)
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      currentId,
      fitMode,
      backgroundMode,
      slideshow,
      open,
      close,
      setFitMode,
      setBackgroundMode,
      setSlideshow,
    }),
    [isOpen, currentId, fitMode, backgroundMode, slideshow, open, close],
  )

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
}

export function useViewer(): ViewerContextValue {
  const ctx = useContext(ViewerContext)
  if (!ctx) {
    throw new Error('useViewer must be used within ViewerProvider')
  }
  return ctx
}
