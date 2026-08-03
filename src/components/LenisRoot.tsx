import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

import { useMediaQuery } from '@/hooks/useMediaQuery'

type LenisRootProps = {
  children: ReactNode
}

/**
 * Smooth scrolling via Lenis. Disabled when the user prefers reduced motion.
 */
export function LenisRoot({ children }: LenisRootProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
    })

    document.documentElement.classList.add('lenis', 'lenis-smooth')

    return () => {
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return children
}
