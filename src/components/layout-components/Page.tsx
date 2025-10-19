/**
 * =============================================================================
 * PAGE COMPONENT
 * =============================================================================
 * A reusable page wrapper component that provides consistent page structure.
 * 
 * Features:
 * - Consistent page layout
 * - Background gradients
 * - Responsive design
 * - Custom styling support
 */

import React from 'react'
import { cn } from '../../utils/cn'

export interface PageProps {
  children: React.ReactNode
  background?: 'default' | 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
  className?: string
  containerClassName?: string
  fullHeight?: boolean
}

const Page: React.FC<PageProps> = ({
  children,
  background = 'default',
  className,
  containerClassName,
  fullHeight = true
}) => {
  const backgroundClasses = {
    default: 'bg-gray-50',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'bg-gradient-to-br from-green-50 to-green-100',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    red: 'bg-gradient-to-br from-red-50 to-red-100',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100'
  }

  return (
    <div
      className={cn(
        backgroundClasses[background],
        fullHeight && 'min-h-screen',
        className
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Page
