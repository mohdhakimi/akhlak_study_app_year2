/**
 * =============================================================================
 * USE LOCAL STATE HOOK
 * =============================================================================
 * A custom hook for managing local component state with persistence.
 * 
 * Features:
 * - Local state management
 * - Optional persistence
 * - Type safety
 * - Reset functionality
 */

import { useState, useCallback, useEffect } from 'react'

export interface UseLocalStateOptions<T> {
  key?: string
  defaultValue: T
  persist?: boolean
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

export interface UseLocalStateReturn<T> {
  state: T
  setState: (value: T | ((prev: T) => T)) => void
  reset: () => void
  isLoading: boolean
}

export const useLocalState = <T>({
  key,
  defaultValue,
  persist = false,
  serialize = JSON.stringify,
  deserialize = JSON.parse
}: UseLocalStateOptions<T>): UseLocalStateReturn<T> => {
  const [state, setState] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(persist && !!key)

  // Load persisted state on mount
  useEffect(() => {
    if (persist && key) {
      try {
        const stored = localStorage.getItem(key)
        if (stored) {
          const parsed = deserialize(stored)
          setState(parsed)
        }
      } catch (error) {
        console.warn(`Failed to load state for key "${key}":`, error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [key, persist, deserialize])

  // Save state when it changes
  useEffect(() => {
    if (persist && key && !isLoading) {
      try {
        localStorage.setItem(key, serialize(state))
      } catch (error) {
        console.warn(`Failed to save state for key "${key}":`, error)
      }
    }
  }, [state, key, persist, serialize, isLoading])

  const handleSetState = useCallback((value: T | ((prev: T) => T)) => {
    setState(value)
  }, [])

  const reset = useCallback(() => {
    setState(defaultValue)
  }, [defaultValue])

  return {
    state,
    setState: handleSetState,
    reset,
    isLoading
  }
}
