import { motion, AnimatePresence } from 'framer-motion'

import { ease, motion as motionTokens } from '@/lib/motion'

type AnimatedCounterProps = {
  current: number
  total: number
  reducedMotion?: boolean
}

function digitWidth(total: number): number {
  return Math.max(2, String(Math.max(1, total)).length)
}

function pad(value: number, width: number): string {
  return String(value).padStart(width, '0')
}

/**
 * Zero-padded `021 / 248` with quiet per-digit motion.
 * Live announcement is owned by the viewer (`aria-live`).
 */
export function AnimatedCounter({
  current,
  total,
  reducedMotion = false,
}: AnimatedCounterProps) {
  const width = digitWidth(total)
  const currentLabel = pad(current, width)
  const totalLabel = pad(total, width)
  const duration = motionTokens.counter / 1000

  return (
    <div
      aria-hidden
      className="flex items-baseline gap-[0.35em] font-ui text-[length:var(--text-caption)] tabular-nums tracking-wide text-[color:var(--text)]"
    >
      <span className="inline-flex">
        {currentLabel.split('').map((digit, index) => (
          <span key={`c-${index}`} className="relative inline-block w-[0.65em] overflow-hidden text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${index}-${digit}`}
                className="inline-block"
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration, ease: ease.standard }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
      <span className="text-[color:var(--text-muted)]">/</span>
      <span className="inline-flex text-[color:var(--text-muted)]">
        {totalLabel.split('').map((digit, index) => (
          <span key={`t-${index}`} className="inline-block w-[0.65em] text-center">
            {digit}
          </span>
        ))}
      </span>
    </div>
  )
}
