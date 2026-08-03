import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCloseOutline } from 'react-icons/io5'

import { BackgroundLayer } from '@/components/viewer/BackgroundLayer'
import { ExpandingImage } from '@/components/viewer/ExpandingImage'
import { IconButton } from '@/components/ui/IconButton'
import { useGallery } from '@/context/GalleryContext'
import { useViewer } from '@/context/ViewerContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { motion as motionTokens } from '@/lib/motion'

/**
 * Dark-room viewer shell — entry/exit only (Phase 4A).
 * No nav, zoom, chrome auto-hide, counter, or slideshow.
 */
export function FullscreenViewer() {
  const { items } = useGallery()
  const { isOpen, currentId, close, completeClose } = useViewer()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const item = currentId ? items.find((entry) => entry.id === currentId) : undefined
  const visible = isOpen && item != null

  useEffect(() => {
    if (!isOpen) return
    if (item) return
    // Invalid id — release lock immediately
    close()
    completeClose()
  }, [isOpen, item, close, completeClose])

  useEffect(() => {
    if (!visible) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, close])

  useEffect(() => {
    if (!visible) return
    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [visible, item?.id])

  useEffect(() => {
    if (!visible) return
    const dialog = dialogRef.current
    if (!dialog) return

    const onFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener('keydown', onFocusTrap)
    return () => dialog.removeEventListener('keydown', onFocusTrap)
  }, [visible, item?.id])

  if (typeof document === 'undefined') return null

  const exitMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerClose) / 1000

  return createPortal(
    <>
      <AnimatePresence>
        {visible ? <BackgroundLayer key="viewer-bg" reducedMotion={reducedMotion} /> : null}
      </AnimatePresence>

      <AnimatePresence onExitComplete={completeClose}>
        {visible && item ? (
          <motion.div
            key="viewer-shell"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-[100]"
            initial={false}
            exit={{ transition: { duration: exitMs } }}
          >
            <button
              type="button"
              aria-label="Close viewer"
              className="absolute inset-0 z-[1] cursor-default bg-transparent"
              onClick={close}
              tabIndex={-1}
            />

            <h2 id={titleId} className="sr-only">
              {item.filename}
            </h2>

            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
              <div className="pointer-events-auto h-full w-full">
                <ExpandingImage item={item} reducedMotion={reducedMotion} />
              </div>
            </div>

            <div className="absolute top-[var(--space-4)] right-[var(--space-4)] z-[3]">
              <IconButton
                ref={closeRef}
                aria-label="Close viewer"
                onClick={close}
                className="bg-[color:var(--toolbar)] text-[color:var(--text)] backdrop-blur-sm"
              >
                <IoCloseOutline size={24} aria-hidden />
              </IconButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>,
    document.body,
  )
}
