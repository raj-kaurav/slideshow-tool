import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { BackgroundLayer } from '@/components/viewer/BackgroundLayer'
import { ExpandingImage } from '@/components/viewer/ExpandingImage'
import { ViewerChrome } from '@/components/viewer/ViewerChrome'
import { useGallery } from '@/context/GalleryContext'
import { useViewer } from '@/context/ViewerContext'
import { useAutoHideUI } from '@/hooks/useAutoHideUI'
import { useDominantColor } from '@/hooks/useDominantColor'
import { useImagePreload } from '@/hooks/useImagePreload'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useViewerNav } from '@/hooks/useViewerNav'
import { motion as motionTokens, motionLimits } from '@/lib/motion'

/**
 * Premium dark-room viewer — navigation, tint, chrome, shared-element open/close.
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

  const {
    index,
    current,
    total,
    canPrev,
    canNext,
    direction,
    hasNavigated,
    goPrev,
    goNext,
  } = useViewerNav(items)

  useImagePreload(items, index, visible)

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

  // Chrome ready on open settle — do not flash-reset on every nav
  useEffect(() => {
    if (!visible) {
      setChromeReady(false)
      setChromeFocused(false)
      return
    }

    if (chromeReady) return

    if (reducedMotion) {
      const t = window.setTimeout(() => setChromeReady(true), motionTokens.fast)
      return () => window.clearTimeout(t)
    }

    const fallback = window.setTimeout(() => setChromeReady(true), motionTokens.viewerExpand + 80)
    return () => window.clearTimeout(fallback)
  }, [visible, reducedMotion, chromeReady])

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

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
        return
      }

      if (event.key === 'd' || event.key === 'D') {
        if (event.metaKey || event.ctrlKey || event.altKey) return
        event.preventDefault()
        downloadRef.current?.click()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, close, onActivity, goPrev, goNext])

  useEffect(() => {
    if (!visible) return
    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [visible])

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
  }, [visible, chromeReady])

  const onChromeFocus = useCallback(() => setChromeFocused(true), [])
  const onChromeBlur = useCallback((event: FocusEvent) => {
    const next = event.relatedTarget as Node | null
    if (event.currentTarget.contains(next)) return
    setChromeFocused(false)
  }, [])

  const onPrev = useCallback(() => {
    onActivity()
    goPrev()
  }, [goPrev, onActivity])

  const onNext = useCallback(() => {
    onActivity()
    goNext()
  }, [goNext, onActivity])

  const onInfo = useCallback(() => {
    onActivity()
  }, [onActivity])

  if (typeof document === 'undefined') return null

  const exitMs = (reducedMotion ? motionTokens.fast : motionTokens.viewerClose) / 1000
  const imageMode = hasNavigated ? 'nav' : 'shared'

  return createPortal(
    <>
      <AnimatePresence>
        {visible && item ? (
          <BackgroundLayer
            key="viewer-bg"
            src={item.src}
            reducedMotion={reducedMotion}
            tintColor={tintColor}
            tintStrength={motionLimits.dominantTintDefault}
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
                  mode={imageMode}
                  direction={direction}
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
              canPrev={canPrev}
              canNext={canNext}
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
