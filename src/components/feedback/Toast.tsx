/**
 * =============================================================================
 * TOAST COMPONENT
 * =============================================================================
 * A reusable toast notification component.
 * 
 * Features:
 * - Multiple variants and positions
 * - Auto-dismiss functionality
 * - Bilingual support
 * - Animation support
 * - Queue management
 */

import React, { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'

export interface ToastProps {
  id?: string
  title?: string
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  duration?: number
  dismissible?: boolean
  onDismiss?: (id: string) => void
  enableBilingual?: boolean
  className?: string
}

const Toast: React.FC<ToastProps> = ({
  id = Math.random().toString(36).substr(2, 9),
  title,
  message,
  variant = 'info',
  position = 'top-right',
  duration = 5000,
  dismissible = true,
  onDismiss,
  enableBilingual = false,
  className
}) => {
  const { formatText } = useBilingual()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.(id)
    }, 300) // Wait for animation to complete
  }

  if (!isVisible) return null

  const variantStyles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      title: 'text-green-800'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      title: 'text-red-800'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      title: 'text-yellow-800'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800'
    }
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out',
        styles.container,
        positionClasses[position],
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className={cn('text-lg', styles.icon)}>
            {icons[variant]}
          </span>
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h4 className={cn('text-sm font-medium', styles.title)}>
              {enableBilingual ? formatText(title) : title}
            </h4>
          )}
          
          <p className="text-sm text-gray-700 mt-1">
            {enableBilingual ? formatText(message) : message}
          </p>
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Toast
