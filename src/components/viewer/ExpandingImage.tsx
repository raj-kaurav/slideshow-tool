import { motion } from 'framer-motion'

import { photoLayoutId } from '@/context/ViewerContext'
import { motion as motionTokens, spring } from '@/lib/motion'
import type { GalleryItem } from '@/types/gallery'

type ExpandingImageProps = {
  item: GalleryItem
  reducedMotion?: boolean
}

/**
 * Shared-element photograph in the dark room — FLIP from the gallery cell.
 */
export function ExpandingImage({ item, reducedMotion = false }: ExpandingImageProps) {
  return (
    <div className="relative z-[1] flex h-full w-full items-center justify-center p-[var(--space-4)]">
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
        }}
        transition={
          reducedMotion
            ? { duration: motionTokens.fast / 1000 }
            : spring.shared
        }
        initial={reducedMotion ? { opacity: 0 } : false}
        animate={reducedMotion ? { opacity: 1 } : undefined}
        exit={reducedMotion ? { opacity: 0 } : undefined}
      />
    </div>
  )
}
