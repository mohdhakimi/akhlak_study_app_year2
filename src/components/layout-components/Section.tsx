/**
 * =============================================================================
 * SECTION COMPONENT
 * =============================================================================
 * A reusable section wrapper component for organizing content.
 * 
 * Features:
 * - Consistent spacing and layout
 * - Multiple variants
 * - Responsive design
 * - Custom styling support
 */

import React from 'react'
import { cn } from '../../utils/cn'

export interface SectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  variant?: 'default' | 'centered' | 'narrow' | 'wide'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  spacing = 'md',
  className,
  titleClassName,
  subtitleClassName
}) => {
  const variantClasses = {
    default: 'max-w-4xl mx-auto',
    centered: 'max-w-2xl mx-auto text-center',
    narrow: 'max-w-2xl mx-auto',
    wide: 'max-w-6xl mx-auto'
  }

  const spacingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16'
  }

  return (
    <section
      className={cn(
        variantClasses[variant],
        spacingClasses[spacing],
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2
              className={cn(
                'text-3xl font-bold text-gray-900',
                titleClassName
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                'mt-2 text-lg text-gray-600',
                subtitleClassName
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </section>
  )
}

export default Section
