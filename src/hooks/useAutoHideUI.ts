import { useCallback, useEffect, useRef, useState } from 'react'

import { motion } from '@/lib/motion'

type UseAutoHideUIOptions = {
  enabled: boolean
  /** Idle delay before chrome hides — defaults to motion.chromeHideDelay */
  delayMs?: number
  /** When false, chrome stays visible (e.g. while focused in controls) */
  allowHide?: boolean
}

type UseAutoHideUIResult = {
  chromeVisible: boolean
  revealChrome: () => void
  onActivity: () => void
}

/**
 * Viewer chrome auto-hide — fade away after idle, return on pointer/keyboard activity.
 */
export function useAutoHideUI({
  enabled,
  delayMs = motion.chromeHideDelay,
  allowHide = true,
}: UseAutoHideUIOptions): UseAutoHideUIResult {
  const [chromeVisible, setChromeVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleHide = useCallback(() => {
    clearTimer()
    if (!enabled || !allowHide) return
    timerRef.current = setTimeout(() => {
      setChromeVisible(false)
    }, delayMs)
  }, [allowHide, clearTimer, delayMs, enabled])

  const revealChrome = useCallback(() => {
    setChromeVisible(true)
    scheduleHide()
  }, [scheduleHide])

  const onActivity = useCallback(() => {
    setChromeVisible(true)
    scheduleHide()
  }, [scheduleHide])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      setChromeVisible(true)
      return
    }
    setChromeVisible(true)
    scheduleHide()
    return clearTimer
  }, [clearTimer, enabled, scheduleHide])

  useEffect(() => {
    if (!enabled) return
    if (!allowHide) {
      clearTimer()
      setChromeVisible(true)
      return
    }
    scheduleHide()
  }, [allowHide, clearTimer, enabled, scheduleHide])

  return { chromeVisible, revealChrome, onActivity }
}
