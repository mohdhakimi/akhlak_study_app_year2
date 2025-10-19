/**
 * =============================================================================
 * CONTAINER COMPONENT
 * =============================================================================
 * A reusable container component for consistent content wrapping.
 * 
 * Features:
 * - Multiple size variants
 * - Responsive design
 * - Custom styling support
 * - Consistent padding and margins
 */

import React from 'react'
import { cn } from '../../utils/cn'

export interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'md',
  padding = 'md',
  className,
  as: Component = 'div'
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }

  return (
    <Component
      className={cn(
        'mx-auto',
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Component>
  )
}

export default Container
