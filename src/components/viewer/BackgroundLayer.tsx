import { motion } from 'framer-motion'

import { motion as motionTokens, ease } from '@/lib/motion'

type BackgroundLayerProps = {
  reducedMotion?: boolean
}

/**
 * Dark-room charcoal scrim behind the expanding photograph.
 * No dominant tint in Phase 4A.
 */
export function BackgroundLayer({ reducedMotion = false }: BackgroundLayerProps) {
  const duration =
    (reducedMotion ? motionTokens.fast : motionTokens.viewerExpand) / 1000

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[99] bg-[color:var(--viewer)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: (reducedMotion ? motionTokens.fast : motionTokens.viewerClose) / 1000,
          ease: ease.standard,
        },
      }}
      transition={{ duration, ease: ease.standard }}
    />
  )
}
