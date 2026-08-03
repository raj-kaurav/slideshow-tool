import { useCallback, useEffect, useId, useMemo, useRef, useState, type FocusEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { BackgroundLayer } from '@/components/viewer/BackgroundLayer'
import { ExpandingImage } from '@/components/viewer/ExpandingImage'
import { ViewerChrome } from '@/components/viewer/ViewerChrome'
import { useGallery } from '@/context/GalleryContext'
import { useViewer } from '@/context/ViewerContext'
import { useAutoHideUI } from '@/hooks/useAutoHideUI'
import { useDominantColor } from '@/hooks/useDominantColor'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { motion as motionTokens } from '@/lib/motion'

/**
 * Premium dark-room viewer — visual quality + chrome (no nav/zoom/slideshow/metadata).
 */
export function FullscreenViewer() {
  const { items } = useGallery()
  const { isOpen, currentId, close, completeClose } = useViewer()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const titleId = useId()
  const liveId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const downloadRef = useRef<HTMLAnchorElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [chromeReady, setChromeReady] = useState(false)
  const [chromeFocused, setChromeFocused] = useState(false)

  const item = currentId ? items.find((entry) => entry.id === currentId) : undefined
  const visible = isOpen && item != null

  const index = useMemo(() => {
    if (!item) return 0
    return items.findIndex((entry) => entry.id === item.id)
  }, [item, items])

  const current = index >= 0 ? index + 1 : 1
  const total = Math.max(1, items.length)

  const { color: tintColor } = useDominantColor(item?.src)
  const { chromeVisible, onActivity } = useAutoHideUI({
    enabled: visible && chromeReady,
    allowHide: !chromeFocused,
  })

  useEffect(() => {
    if (!isOpen) return
    if (item) return
    close()
    completeClose()
  }, [isOpen, item, close, completeClose])

  useEffect(() => {
    if (!visible) {
      setChromeReady(false)
      setChromeFocused(false)
      return
    }

    // Reduced motion: show chrome promptly. Otherwise wait for photograph settle.
    if (reducedMotion) {
      const t = window.setTimeout(() => setChromeReady(true), motionTokens.fast)
      return () => window.clearTimeout(t)
    }

    // Fallback if layout animation callback never fires
    const fallback = window.setTimeout(() => setChromeReady(true), motionTokens.viewerExpand + 80)
    return () => window.clearTimeout(fallback)
  }, [visible, item?.id, reducedMotion])

  const onPhotoSettle = useCallback(() => {
    setChromeReady(true)
  }, [])

  useEffect(() => {
    if (!visible) return

    const onKeyDown = (event: KeyboardEvent) => {
      onActivity()

      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close()
        return
      }

      // Reserved — navigation logic arrives in a later phase
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        return
      }

      // Reserved download shortcut — triggers the download control
      if (event.key === 'd' || event.key === 'D') {
        if (event.metaKey || event.ctrlKey || event.altKey) return
        event.preventDefault()
        downloadRef.current?.click()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, close, onActivity])

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
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }, [visible, item?.id, chromeReady])

  const onChromeFocus = useCallback(() => setChromeFocused(true), [])
  const onChromeBlur = useCallback((event: FocusEvent) => {
    const next = event.relatedTarget as Node | null
    if (event.currentTarget.contains(next)) return
    setChromeFocused(false)
  }, [])

  // Reserved stubs — wired for chrome affordances; logic later
  const onPrev = useCallback(() => {
    onActivity()
  }, [onActivity])
  const onNext = useCallback(() => {
    onActivity()
  }, [onActivity])
  const onInfo = useCallback(() => {
    onActivity()
  }, [onActivity])

  if (typeof document === 'undefined') return null

  const exitMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerClose) / 1000

  return createPortal(
    <>
      <AnimatePresence>
        {visible && item ? (
          <BackgroundLayer
            key="viewer-bg"
            src={item.src}
            reducedMotion={reducedMotion}
            tintColor={tintColor}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence onExitComplete={completeClose}>
        {visible && item ? (
          <motion.div
            key="viewer-shell"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={liveId}
            className="fixed inset-0 z-[100]"
            initial={false}
            exit={{ transition: { duration: exitMs } }}
            onPointerMove={onActivity}
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
            <p id={liveId} className="sr-only" aria-live="polite">
              Image {current} of {total}
            </p>

            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
              <div className="pointer-events-auto h-full w-full">
                <ExpandingImage
                  item={item}
                  reducedMotion={reducedMotion}
                  onSettle={onPhotoSettle}
                />
              </div>
            </div>

            <ViewerChrome
              visible={chromeVisible}
              ready={chromeReady}
              filename={item.filename}
              src={item.src}
              current={current}
              total={total}
              reducedMotion={reducedMotion}
              closeRef={closeRef}
              downloadRef={downloadRef}
              onClose={close}
              onPrev={onPrev}
              onNext={onNext}
              onInfo={onInfo}
              onChromeFocus={onChromeFocus}
              onChromeBlur={onChromeBlur}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>,
    document.body,
  )
}
