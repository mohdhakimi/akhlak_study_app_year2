/**
 * =============================================================================
 * USE DEBOUNCE HOOK
 * =============================================================================
 * A custom hook for debouncing values.
 * 
 * Features:
 * - Value debouncing
 * - Configurable delay
 * - Type safety
 * - Cleanup on unmount
 */

import { useState, useEffect } from 'react'

export interface UseDebounceOptions {
  delay?: number
  leading?: boolean
  trailing?: boolean
}

export const useDebounce = <T>(
  value: T,
  options: UseDebounceOptions = {}
): T => {
  const {
    delay = 300,
    leading = false,
    trailing = true
  } = options

  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (leading && debouncedValue !== value) {
      setDebouncedValue(value)
      return
    }

    if (trailing) {
      timeoutId = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [value, delay, leading, trailing])

  return debouncedValue
}
