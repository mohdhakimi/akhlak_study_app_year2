/**
 * =============================================================================
 * BUTTON COMPONENT
 * =============================================================================
 * This component provides a reusable button with multiple variants, sizes,
 * and interactive features including sound effects and loading states.
 *
 * Features:
 * - Multiple visual variants (primary, secondary, success, danger, outline, ghost)
 * - Three size options (sm, md, lg)
 * - Loading state with spinner
 * - Sound effects on click and hover
 * - Full width option
 * - Accessibility support
 * - Custom styling support
 */

import React from 'react'
import { cn } from '../utils/cn'
import { useButtonSound } from '../hooks/useAudio'

/**
 * Props for the Button component
 * @interface ButtonProps
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'  // Visual style variant
  size?: 'sm' | 'md' | 'lg'                                                      // Button size
  loading?: boolean                                                               // Whether button is in loading state
  fullWidth?: boolean                                                             // Whether button should take full width
  enableSound?: boolean                                                           // Whether to play sound effects
  children: React.ReactNode                                                      // Button content
}

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and interactive features.
 * Supports sound effects, loading states, and full accessibility compliance.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      enableSound = true,
      children,
      onClick,
      onMouseEnter,
      ...props
    },
    ref
  ) => {
    // Audio hooks for button sound effects
    const { playClickSound, playHoverSound } = useButtonSound()

    /**
     * Handle button click with sound effect
     * @param e - Mouse event
     */
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableSound && !disabled && !loading) {
        playClickSound()
      }
      onClick?.(e)
    }

    /**
     * Handle mouse enter with hover sound effect
     * @param e - Mouse event
     */
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableSound && !disabled && !loading) {
        playHoverSound()
      }
      onMouseEnter?.(e)
    }
    const baseClasses =
      'btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
      success:
        'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:bg-success-800',
      danger:
        'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 active:bg-danger-800',
      outline:
        'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 active:bg-primary-700',
      ghost:
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
    }

    const widthClasses = fullWidth ? 'w-full' : ''

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClasses,
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
