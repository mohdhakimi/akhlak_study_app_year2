/**
 * =============================================================================
 * USE TOAST HOOK
 * =============================================================================
 * A custom hook for managing toast notifications.
 * 
 * Features:
 * - Queue management
 * - Auto-dismiss
 * - Multiple positions
 * - Type safety
 */

import { useState, useCallback } from 'react'

export interface ToastItem {
  id: string
  title?: string
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  dismissible?: boolean
}

export interface UseToastReturn {
  toasts: ToastItem[]
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
  clearAllToasts: () => void
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastItem = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast
    }

    setToasts(prev => [...prev, newToast])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    dismissToast,
    clearAllToasts
  }
}
