import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { writeJson } from '@/lib/storage'
import type { FitMode, SlideshowSettings, ViewerBackgroundMode } from '@/types/viewer'

type ViewerContextValue = {
  isOpen: boolean
  currentId: string | null
  /** Scroll position captured when the viewer opened — restored after close animation. */
  returnScrollY: number
  fitMode: FitMode
  backgroundMode: ViewerBackgroundMode
  slideshow: SlideshowSettings
  open: (id: string) => void
  close: () => void
  /**
   * Called by FullscreenViewer when the exit transition finishes.
   * Restores scroll + focus and clears the active id.
   */
  completeClose: () => void
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

function lockPageScroll(): void {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

function unlockPageScroll(): void {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

/**
 * Viewer open/close state for dark-room entry & exit (Phase 4A).
 * Keeps `currentId` through the exit animation so shared-element can reverse.
 */
export function ViewerProvider({ children }: ViewerProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [returnScrollY, setReturnScrollY] = useState(0)
  const [fitMode, setFitMode] = useState<FitMode>('fit')
  const [backgroundMode, setBackgroundMode] = useState<ViewerBackgroundMode>('charcoal')
  const [slideshow, setSlideshow] = useState<SlideshowSettings>(DEFAULT_SLIDESHOW)

  const scrollYRef = useRef(0)
  const focusIdRef = useRef<string | null>(null)

  const open = useCallback((id: string) => {
    const y = window.scrollY
    scrollYRef.current = y
    focusIdRef.current = id
    setReturnScrollY(y)
    writeJson('scrollY', y)
    writeJson('lastViewed', id)
    setCurrentId(id)
    setIsOpen(true)
    lockPageScroll()
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const completeClose = useCallback(() => {
    const id = focusIdRef.current
    const y = scrollYRef.current

    unlockPageScroll()
    setCurrentId(null)

    window.scrollTo({ top: y, left: 0, behavior: 'instant' })

    // Wait a frame so virtualization can remount the return cell before focus.
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' })
      const target = id
        ? document.querySelector<HTMLElement>(`[data-gallery-item="${CSS.escape(id)}"]`)
        : null
      target?.focus({ preventScroll: true })
    })
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      currentId,
      returnScrollY,
      fitMode,
      backgroundMode,
      slideshow,
      open,
      close,
      completeClose,
      setFitMode,
      setBackgroundMode,
      setSlideshow,
    }),
    [
      isOpen,
      currentId,
      returnScrollY,
      fitMode,
      backgroundMode,
      slideshow,
      open,
      close,
      completeClose,
    ],
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

/** Shared layout id for gallery cell ↔ expanding viewer image. */
export function photoLayoutId(id: string): string {
  return `photo-${id}`
}
