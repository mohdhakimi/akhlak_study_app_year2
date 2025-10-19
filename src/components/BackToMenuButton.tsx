/**
 * =============================================================================
 * BACK TO MENU BUTTON COMPONENT
 * =============================================================================
 * A standardized button component for navigating back to the main menu.
 * This ensures consistent design and behavior across all pages.
 *
 * Features:
 * - Consistent styling and positioning
 * - Bilingual text support
 * - Standardized icon and layout
 * - Responsive design
 * - Accessibility support
 */

import React from 'react'
import { useBilingual } from '../contexts/BilingualContext'
import { TEXT } from '../constants/text'
import Button from './Button'
import { cn } from '../utils/cn'

/**
 * Props for the BackToMenuButton component
 * @interface BackToMenuButtonProps
 */
export interface BackToMenuButtonProps {
  onClick: () => void                    // Callback when button is clicked
  variant?: 'primary' | 'secondary' | 'outline'  // Button variant
  size?: 'sm' | 'md' | 'lg'             // Button size
  className?: string                     // Additional CSS classes
  disabled?: boolean                     // Whether button is disabled
  showIcon?: boolean                     // Whether to show the back icon
  fullWidth?: boolean                    // Whether button should take full width
  position?: 'left' | 'center' | 'right' // Button alignment
}

/**
 * BackToMenuButton Component
 * 
 * A standardized button for navigating back to the main menu.
 * Provides consistent design and behavior across all pages.
 */
const BackToMenuButton: React.FC<BackToMenuButtonProps> = ({
  onClick,
  variant = 'outline',
  size = 'md',
  className,
  disabled = false,
  showIcon = true,
  fullWidth = false,
  position = 'center'
}) => {
  const { formatText } = useBilingual()

  // Size-based classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-w-[120px]',
    md: 'px-6 py-3 text-base min-w-[160px]',
    lg: 'px-8 py-4 text-lg min-w-[200px]'
  }

  // Position-based classes
  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div className={cn(
      'flex',
      positionClasses[position],
      fullWidth && 'w-full'
    )}>
      <Button
        onClick={onClick}
        variant={variant}
        disabled={disabled}
        className={cn(
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
      >
        {showIcon && (
          <svg
            className={cn(
              'mr-2',
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        )}
        {formatText('کمبالي ک منو | Kembali ke Menu')}
      </Button>
    </div>
  )
}

export default BackToMenuButton
