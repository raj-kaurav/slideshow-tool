import { AnimatePresence, motion } from 'framer-motion'

import { ease, motion as motionTokens, motionLimits } from '@/lib/motion'

type BackgroundLayerProps = {
  /** Selected photograph — drives the blurred exhibition backdrop */
  src?: string
  reducedMotion?: boolean
  /**
   * Dominant color CSS value for tint.
   * When null, charcoal-only dark room until sampling resolves.
   */
  tintColor?: string | null
  /**
   * Mix strength 0–1. Clamped to motionLimits dominant tint range when applied.
   */
  tintStrength?: number
}

/**
 * Dark-room backdrop: charcoal + blurred photograph (crossfades on src change) + tint + veil.
 */
export function BackgroundLayer({
  src,
  reducedMotion = false,
  tintColor = null,
  tintStrength = motionLimits.dominantTintDefault,
}: BackgroundLayerProps) {
  const enterMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerExpand) / 1000
  const exitMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerClose) / 1000
  const crossfadeMs = (reducedMotion ? motionTokens.fast : motionTokens.normal) / 1000

  const strength = Math.min(
    motionLimits.dominantTintMax,
    Math.max(motionLimits.dominantTintMin, tintStrength),
  )

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[99] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: exitMs, ease: ease.standard },
      }}
      transition={{ duration: enterMs, ease: ease.standard }}
    >
      {/* Charcoal room base */}
      <div className="absolute inset-0 bg-[color:var(--viewer)]" />

      {/* Blurred photograph — crossfades immediately when the selection changes */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {src ? (
            <motion.img
              key={src}
              src={src}
              alt=""
              aria-hidden
              decoding="async"
              draggable={false}
              className={[
                'absolute inset-0 h-full w-full object-cover',
                'scale-[1.18] saturate-[0.55] contrast-[0.95]',
                reducedMotion
                  ? 'blur-[var(--viewer-blur-reduced)]'
                  : 'blur-[var(--viewer-blur)]',
              ].join(' ')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: crossfadeMs, ease: ease.standard }}
            />
          ) : null}
        </AnimatePresence>
      </div>

      {/* Dominant tint — between blur and veil so it reads at 3–8% without becoming colorful */}
      {tintColor ? (
        <motion.div
          key={tintColor}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: strength }}
          transition={{ duration: crossfadeMs, ease: ease.standard }}
          style={{
            backgroundColor: tintColor,
            mixBlendMode: 'soft-light',
          }}
        />
      ) : null}

      {/* Dark veil — slightly lighter than before so tint remains perceptible */}
      <div
        className="absolute inset-0 bg-[color:var(--viewer)]"
        style={{ opacity: tintColor ? 0.52 : 'var(--viewer-veil)' }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </motion.div>
  )
}
