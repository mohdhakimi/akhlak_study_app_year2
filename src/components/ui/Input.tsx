/**
 * =============================================================================
 * INPUT COMPONENT
 * =============================================================================
 * A reusable input component with consistent styling and behavior.
 * 
 * Features:
 * - Multiple variants and sizes
 * - Error states and validation
 * - Bilingual support
 * - Accessibility features
 * - Custom styling support
 */

import React from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  enableBilingual?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  enableBilingual = false,
  className,
  ...props
}) => {
  const { formatText } = useBilingual()

  const baseClasses = 'block w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0'
  
  const variantClasses = {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    outlined: 'border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  }

  const inputClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    fullWidth && 'w-full',
    className
  )

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {enableBilingual ? formatText(label) : label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">
          {enableBilingual ? formatText(error) : error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {enableBilingual ? formatText(helperText) : helperText}
        </p>
      )}
    </div>
  )
}

export default Input
