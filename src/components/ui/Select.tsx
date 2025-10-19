/**
 * =============================================================================
 * SELECT COMPONENT
 * =============================================================================
 * A reusable select dropdown component with consistent styling and behavior.
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

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  options: SelectOption[]
  placeholder?: string
  enableBilingual?: boolean
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  options,
  placeholder,
  enableBilingual = false,
  className,
  ...props
}) => {
  const { formatText } = useBilingual()

  const baseClasses = 'block w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-white'
  
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

  const selectClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
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
        <select
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {enableBilingual ? formatText(placeholder) : placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {enableBilingual ? formatText(option.label) : option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
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

export default Select
