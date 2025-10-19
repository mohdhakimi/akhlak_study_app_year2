/**
 * =============================================================================
 * CHECKBOX COMPONENT
 * =============================================================================
 * A reusable checkbox component with consistent styling and behavior.
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

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  enableBilingual?: boolean
  children?: React.ReactNode
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  enableBilingual = false,
  children,
  className,
  id,
  ...props
}) => {
  const { formatText } = useBilingual()

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const variantClasses = {
    default: 'text-primary-600 focus:ring-primary-500',
    primary: 'text-primary-600 focus:ring-primary-500',
    success: 'text-green-600 focus:ring-green-500',
    warning: 'text-yellow-600 focus:ring-yellow-500',
    danger: 'text-red-600 focus:ring-red-500'
  }

  const checkboxClasses = cn(
    'rounded border-gray-300 focus:ring-2 focus:ring-offset-0',
    sizeClasses[size],
    variantClasses[variant],
    error && 'border-red-500 text-red-600 focus:ring-red-500',
    className
  )

  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={checkboxId}
            type="checkbox"
            className={checkboxClasses}
            {...props}
          />
        </div>
        
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={checkboxId}
              className="font-medium text-gray-700 cursor-pointer"
            >
              {enableBilingual ? formatText(label) : label}
            </label>
          )}
          
          {children && (
            <div className="text-gray-500">
              {children}
            </div>
          )}
        </div>
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

export default Checkbox
