/**
 * =============================================================================
 * BREADCRUMB COMPONENT
 * =============================================================================
 * A reusable breadcrumb navigation component.
 * 
 * Features:
 * - Hierarchical navigation
 * - Bilingual support
 * - Custom separators
 * - Accessibility features
 */

import React from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  current?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  enableBilingual?: boolean
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '>',
  enableBilingual = false,
  className
}) => {
  const { formatText } = useBilingual()

  return (
    <nav
      className={cn('flex', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">
                {separator}
              </span>
            )}
            
            {item.current ? (
              <span className="text-sm font-medium text-gray-500">
                {enableBilingual ? formatText(item.label) : item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                onClick={item.onClick}
              >
                {enableBilingual ? formatText(item.label) : item.label}
              </a>
            ) : (
              <button
                onClick={item.onClick}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {enableBilingual ? formatText(item.label) : item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
