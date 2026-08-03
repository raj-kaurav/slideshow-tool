import type { FocusEvent, Ref } from 'react'
import { motion } from 'framer-motion'
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
  IoDownloadOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5'

import { AnimatedCounter } from '@/components/viewer/AnimatedCounter'
import { IconButton, IconLink } from '@/components/ui/IconButton'
import { ease, motion as motionTokens } from '@/lib/motion'

type ViewerChromeProps = {
  visible: boolean
  ready: boolean
  filename: string
  src: string
  current: number
  total: number
  canPrev: boolean
  canNext: boolean
  reducedMotion?: boolean
  closeRef?: Ref<HTMLButtonElement>
  downloadRef?: Ref<HTMLAnchorElement>
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  /** Reserved — metadata panel ships later */
  onInfo?: () => void
  onChromeFocus: () => void
  onChromeBlur: (event: FocusEvent<HTMLDivElement>) => void
}

/**
 * Minimal icon chrome — top-right actions, bottom-center nav cluster.
 */
export function ViewerChrome({
  visible,
  ready,
  filename,
  src,
  current,
  total,
  canPrev,
  canNext,
  reducedMotion = false,
  closeRef,
  downloadRef,
  onClose,
  onPrev,
  onNext,
  onInfo,
  onChromeFocus,
  onChromeBlur,
}: ViewerChromeProps) {
  const show = ready && visible
  const duration = (reducedMotion ? motionTokens.fast : motionTokens.chromeFade) / 1000

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[3]"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration, ease: ease.standard }}
      style={{ pointerEvents: show ? 'auto' : 'none' }}
      aria-hidden={!show}
    >
      <div
        className="pointer-events-auto absolute top-[var(--space-4)] right-[var(--space-4)] flex items-center gap-[var(--space-1)]"
        onFocus={onChromeFocus}
        onBlur={onChromeBlur}
      >
        <IconLink
          ref={downloadRef}
          aria-label={`Download original ${filename}`}
          href={src}
          download={filename}
          className="bg-[color:var(--toolbar)] text-[color:var(--text)] backdrop-blur-sm"
        >
          <IoDownloadOutline size={22} aria-hidden />
        </IconLink>
        <IconButton
          aria-label="Photograph information"
          onClick={onInfo}
          className="bg-[color:var(--toolbar)] text-[color:var(--text)] backdrop-blur-sm"
        >
          <IoInformationCircleOutline size={22} aria-hidden />
        </IconButton>
        <IconButton
          ref={closeRef}
          aria-label="Close viewer"
          onClick={onClose}
          className="bg-[color:var(--toolbar)] text-[color:var(--text)] backdrop-blur-sm"
        >
          <IoCloseOutline size={24} aria-hidden />
        </IconButton>
      </div>

      <div
        className="pointer-events-auto absolute bottom-[var(--space-5)] left-1/2 flex -translate-x-1/2 items-center gap-[var(--space-3)] rounded-sm bg-[color:var(--toolbar)] px-[var(--space-2)] py-[var(--space-1)] backdrop-blur-sm"
        onFocus={onChromeFocus}
        onBlur={onChromeBlur}
      >
        <IconButton
          aria-label="Previous photograph"
          onClick={onPrev}
          disabled={!canPrev}
          className="text-[color:var(--text)]"
        >
          <IoChevronBackOutline size={22} aria-hidden />
        </IconButton>
        <AnimatedCounter current={current} total={total} reducedMotion={reducedMotion} />
        <IconButton
          aria-label="Next photograph"
          onClick={onNext}
          disabled={!canNext}
          className="text-[color:var(--text)]"
        >
          <IoChevronForwardOutline size={22} aria-hidden />
        </IconButton>
      </div>
    </motion.div>
  )
}
