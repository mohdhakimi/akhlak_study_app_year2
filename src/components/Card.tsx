import React from 'react'
import { cn } from '../utils/cn'
import { useHaptic } from '../hooks/useHaptic'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  enableHaptic?: boolean
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', padding = 'md', enableHaptic = true, children, onClick, ...props },
    ref
  ) => {
    // Haptic feedback hook
    const { buttonPress } = useHaptic()

    /**
     * Handle card click with haptic feedback
     * @param e - Mouse event
     */
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (enableHaptic && onClick) {
        buttonPress()
      }
      onClick?.(e)
    }
    const baseClasses = 'rounded-xl transition-all duration-200'

    const variantClasses = {
      default: 'bg-white shadow-sm border border-gray-200',
      elevated: 'bg-white shadow-lg border border-gray-200',
      outlined: 'bg-transparent border-2 border-gray-300',
      filled: 'bg-gray-50 border border-gray-200',
    }

    const paddingClasses = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
