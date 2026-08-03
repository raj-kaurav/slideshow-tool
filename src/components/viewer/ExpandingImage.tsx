import { AnimatePresence, motion } from 'framer-motion'

import { photoLayoutId } from '@/context/ViewerContext'
import type { ViewerNavDirection } from '@/hooks/useViewerNav'
import { ease, motion as motionTokens, motionLimits, spring } from '@/lib/motion'
import type { GalleryItem } from '@/types/gallery'

type ExpandingImageProps = {
  item: GalleryItem
  reducedMotion?: boolean
  onSettle?: () => void
  /**
   * `shared` — open FLIP from the gallery cell.
   * `nav` — in-viewer ±8% slide-fade (Animation Spec).
   */
  mode?: 'shared' | 'nav'
  direction?: ViewerNavDirection
}

/**
 * Dark-room photograph — shared-element on open; slide-fade while navigating.
 * Keeps layoutId while open so close can reverse to the cell.
 */
export function ExpandingImage({
  item,
  reducedMotion = false,
  onSettle,
  mode = 'shared',
  direction = 0,
}: ExpandingImageProps) {
  const slide = motionLimits.navSlidePercent * 100
  const navDuration = (reducedMotion ? motionTokens.fast : motionTokens.normal) / 1000
  const useShared = mode === 'shared' && !reducedMotion

  return (
    <div className="relative z-[1] flex h-full w-full items-center justify-center overflow-hidden p-[var(--space-5)] md:p-[var(--space-7)]">
      <AnimatePresence mode="sync" custom={direction} initial={false}>
        <motion.img
          key={item.id}
          layoutId={reducedMotion ? undefined : photoLayoutId(item.id)}
          src={item.src}
          alt={item.filename}
          decoding="async"
          draggable={false}
          className="max-h-full max-w-full object-contain select-none"
          style={{
            borderRadius: 'var(--radius-image)',
            willChange: 'transform, opacity',
            boxShadow: 'var(--shadow-viewer-photo)',
            position: mode === 'nav' ? 'absolute' : undefined,
          }}
          custom={direction}
          initial={
            mode === 'nav'
              ? reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: `${direction * slide}%` }
              : reducedMotion
                ? { opacity: 0 }
                : false
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            mode === 'nav'
              ? reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: `${direction * -slide}%` }
              : reducedMotion
                ? { opacity: 0 }
                : undefined
          }
          transition={
            useShared
              ? spring.shared
              : { duration: navDuration, ease: ease.standard }
          }
          onLayoutAnimationComplete={mode === 'shared' ? onSettle : undefined}
          onAnimationComplete={() => {
            onSettle?.()
          }}
        />
      </AnimatePresence>
    </div>
  )
}
