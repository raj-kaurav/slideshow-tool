import { useCallback, useState } from 'react'

import { readJson, writeJson } from '@/lib/storage'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJson(key, initial))

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
        writeJson(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, setStoredValue] as const
}
