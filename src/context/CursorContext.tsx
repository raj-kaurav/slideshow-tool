import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'

type CursorContextValue = {
  /** Fine pointer (mouse/trackpad) — custom cursor affordances may apply later. */
  isFinePointer: boolean
  /** Prefer reduced motion — cursor motion should stay minimal. */
  prefersReducedMotion: boolean
}

const CursorContext = createContext<CursorContextValue | null>(null)

type CursorProviderProps = {
  children: ReactNode
}

export function CursorProvider({ children }: CursorProviderProps) {
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const value = useMemo(
    () => ({ isFinePointer, prefersReducedMotion }),
    [isFinePointer, prefersReducedMotion],
  )

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext)
  if (!ctx) {
    throw new Error('useCursor must be used within CursorProvider')
  }
  return ctx
}
