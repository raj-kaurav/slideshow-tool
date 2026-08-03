import { motion } from 'framer-motion'

import { photoLayoutId } from '@/context/ViewerContext'
import { motion as motionTokens, spring } from '@/lib/motion'
import type { GalleryItem } from '@/types/gallery'

type ExpandingImageProps = {
  item: GalleryItem
  reducedMotion?: boolean
  onSettle?: () => void
}

/**
 * Shared-element photograph in the dark room — elevated print, never cropped.
 */
export function ExpandingImage({
  item,
  reducedMotion = false,
  onSettle,
}: ExpandingImageProps) {
  return (
    <div className="relative z-[1] flex h-full w-full items-center justify-center p-[var(--space-5)] md:p-[var(--space-7)]">
      <motion.img
        layoutId={reducedMotion ? undefined : photoLayoutId(item.id)}
        src={item.src}
        alt={item.filename}
        decoding="async"
        draggable={false}
        className="max-h-full max-w-full object-contain select-none"
        style={{
          borderRadius: 'var(--radius-image)',
          willChange: 'transform',
          boxShadow: 'var(--shadow-viewer-photo)',
        }}
        transition={
          reducedMotion
            ? { duration: motionTokens.fast / 1000 }
            : spring.shared
        }
        initial={reducedMotion ? { opacity: 0 } : false}
        animate={reducedMotion ? { opacity: 1 } : undefined}
        exit={reducedMotion ? { opacity: 0 } : undefined}
        onLayoutAnimationComplete={onSettle}
        onAnimationComplete={reducedMotion ? onSettle : undefined}
      />
    </div>
  )
}
