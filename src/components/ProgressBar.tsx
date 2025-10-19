import React from 'react'
import { cn } from '../utils/cn'

export interface ProgressBarProps {
  current: number
  total: number
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showText = true,
  size = 'md',
  variant = 'default',
  className,
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const variantClasses = {
    default: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn('w-full', className)}>
      {showText && (
        <div className="flex justify-between items-center mb-2">
          <span
            className={cn('font-medium text-gray-700', textSizeClasses[size])}
          >
            {current} dari {total}
          </span>
          <span
            className={cn('font-medium text-gray-500', textSizeClasses[size])}
          >
            {clampedPercentage}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            variantClasses[variant]
          )}
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Kemajuan: ${current} dari ${total} (${clampedPercentage}%)`}
        />
      </div>
    </div>
  )
}

export default ProgressBar
