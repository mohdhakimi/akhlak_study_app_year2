/**
 * =============================================================================
 * ALERT COMPONENT
 * =============================================================================
 * A reusable alert component for displaying messages and notifications.
 * 
 * Features:
 * - Multiple variants (success, error, warning, info)
 * - Dismissible alerts
 * - Bilingual support
 * - Custom icons
 * - Accessibility features
 */

import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'

export interface AlertProps {
  title?: string
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  enableBilingual?: boolean
  className?: string
}

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  dismissible = false,
  onDismiss,
  icon,
  enableBilingual = false,
  className
}) => {
  const { formatText } = useBilingual()
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const variantStyles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      title: 'text-green-800',
      message: 'text-green-700'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-700'
    }
  }

  const defaultIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const styles = variantStyles[variant]
  const defaultIcon = defaultIcons[variant]

  return (
    <div
      className={cn(
        'border rounded-lg p-4',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={cn('text-xl', styles.icon)}>
            {icon || defaultIcon}
          </span>
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', styles.title)}>
              {enableBilingual ? formatText(title) : title}
            </h3>
          )}
          
          <div className={cn('text-sm mt-1', styles.message)}>
            {enableBilingual ? formatText(message) : message}
          </div>
        </div>
        
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  styles.container,
                  'hover:opacity-75'
                )}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert
