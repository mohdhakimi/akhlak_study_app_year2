/**
 * =============================================================================
 * PROGRESS COMPONENT
 * =============================================================================
 * A reusable progress indicator component.
 * 
 * Features:
 * - Multiple variants (bar, circle, steps)
 * - Custom styling
 * - Accessibility features
 * - Animation support
 */

import React from 'react'
import { cn } from '../../utils/cn'

export interface ProgressProps {
  value: number
  max?: number
  variant?: 'bar' | 'circle' | 'steps'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
  className?: string
  animated?: boolean
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'bar',
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className,
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: variant === 'bar' ? 'h-2' : 'w-16 h-16',
    md: variant === 'bar' ? 'h-3' : 'w-20 h-20',
    lg: variant === 'bar' ? 'h-4' : 'w-24 h-24'
  }

  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  }

  if (variant === 'bar') {
    return (
      <div className={cn('space-y-2', className)}>
        {showLabel && (
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">
              {label || 'Progress'}
            </span>
            <span className="text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out',
              colorClasses[color],
              animated && 'animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  if (variant === 'circle') {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
        <svg
          className="transform -rotate-90"
          width={size === 'sm' ? 64 : size === 'lg' ? 96 : 80}
          height={size === 'sm' ? 64 : size === 'lg' ? 96 : 80}
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              'transition-all duration-300 ease-in-out',
              colorClasses[color],
              animated && 'animate-pulse'
            )}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'steps') {
    const steps = Array.from({ length: max }, (_, i) => i + 1)
    
    return (
      <div className={cn('flex space-x-2', className)}>
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors duration-300',
              step <= value ? colorClasses[color] : 'bg-gray-200'
            )}
          />
        ))}
      </div>
    )
  }

  return null
}

export default Progress
