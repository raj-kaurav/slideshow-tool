import { motion } from 'framer-motion'

import { ease, motion as motionTokens, motionLimits } from '@/lib/motion'

type BackgroundLayerProps = {
  /** Selected photograph — drives the blurred exhibition backdrop */
  src?: string
  reducedMotion?: boolean
  /**
   * Dominant color CSS value for tint architecture.
   * When null, charcoal-only dark room (sampling deferred).
   */
  tintColor?: string | null
  /**
   * Mix strength 0–1. Clamped to motionLimits dominant tint range when applied.
   * Ignored when tintColor is null.
   */
  tintStrength?: number
}

/**
 * Dark-room backdrop: charcoal base + scaled blurred photograph + dark veil.
 * Optional tint layer is wired for dominant-color sampling (not active yet).
 */
export function BackgroundLayer({
  src,
  reducedMotion = false,
  tintColor = null,
  tintStrength = motionLimits.dominantTintMin,
}: BackgroundLayerProps) {
  const enterMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerExpand) / 1000
  const exitMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerClose) / 1000

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

      {/* Blurred, desaturated, oversized photograph — never competes with the hero */}
      {src ? (
        <img
          src={src}
          alt=""
          aria-hidden
          decoding="async"
          draggable={false}
          className={[
            'absolute inset-0 h-full w-full object-cover',
            'scale-[1.18] saturate-[0.45] contrast-[0.92]',
            reducedMotion ? 'blur-[var(--viewer-blur-reduced)]' : 'blur-[var(--viewer-blur)]',
          ].join(' ')}
        />
      ) : null}

      {/* Dark veil — keeps the room quiet */}
      <div
        className="absolute inset-0 bg-[color:var(--viewer)]"
        style={{ opacity: 'var(--viewer-veil)' }}
      />

      {/* Dominant tint slot — dormant until useDominantColor returns a color */}
      {tintColor ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: tintColor,
            opacity: strength,
            mixBlendMode: 'soft-light',
          }}
        />
      ) : null}

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
