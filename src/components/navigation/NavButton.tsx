/**
 * =============================================================================
 * NAV BUTTON COMPONENT
 * =============================================================================
 * A reusable navigation button component with consistent styling and behavior.
 * 
 * Features:
 * - Multiple variants and sizes
 * - Active state support
 * - Bilingual support
 * - Icon support
 * - Accessibility features
 */

import React from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'
import Button from '../Button'

export interface NavButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  enableBilingual?: boolean
  className?: string
  disabled?: boolean
}

const NavButton: React.FC<NavButtonProps> = ({
  children,
  href,
  onClick,
  active = false,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  enableBilingual = false,
  className,
  disabled = false
}) => {
  const { formatText } = useBilingual()

  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      <span>
        {enableBilingual ? formatText(children as string) : children}
      </span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  )

  const buttonClasses = cn(
    'transition-colors',
    active && 'bg-primary-100 text-primary-700 border-primary-300',
    className
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          variant === 'default' && 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
          variant === 'primary' && 'text-white bg-primary-600 hover:bg-primary-700',
          variant === 'secondary' && 'text-gray-700 bg-gray-200 hover:bg-gray-300',
          variant === 'outline' && 'text-gray-700 border border-gray-300 hover:bg-gray-50',
          variant === 'ghost' && 'text-gray-700 hover:bg-gray-100',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'lg' && 'px-6 py-3 text-base',
          active && 'bg-primary-100 text-primary-700',
          disabled && 'opacity-50 cursor-not-allowed',
          buttonClasses
        )}
        onClick={handleClick}
      >
        {buttonContent}
      </a>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant as any}
      size={size}
      disabled={disabled}
      className={buttonClasses}
    >
      {buttonContent}
    </Button>
  )
}

export default NavButton
