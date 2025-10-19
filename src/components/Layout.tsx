/**
 * =============================================================================
 * LAYOUT COMPONENT
 * =============================================================================
 * This component provides the main layout structure for all pages in the
 * application. It includes a header with navigation controls and a main content
 * area with optional bilingual toggle.
 *
 * Features:
 * - Consistent page layout across the application
 * - Configurable header with user info and controls
 * - Optional bilingual toggle for language switching
 * - Flexible content area for page-specific content
 * - Responsive design support
 * - Customizable styling through props
 */

import React from 'react'
import { cn } from '../utils/cn'
import Header from './Header'
import BilingualToggle from './BilingualToggle'

/**
 * Props for the Layout component
 * @interface LayoutProps
 */
export interface LayoutProps {
  children: React.ReactNode        // Main content to display
  title?: string                   // Page title for header
  subtitle?: string                // Page subtitle for header
  currentUser?: string             // Current user name for display
  onUserClick?: () => void         // Callback when user info is clicked
  onSoundSettingsClick?: () => void // Callback when sound settings is clicked
  onKeluarClick?: () => void       // Callback when exit button is clicked
  showUser?: boolean               // Whether to show user information
  showSoundSettings?: boolean      // Whether to show sound settings button
  showBilingualToggle?: boolean    // Whether to show bilingual toggle
  showKeluarButton?: boolean       // Whether to show exit button
  className?: string               // Additional CSS classes for container
  headerClassName?: string         // Additional CSS classes for header
  mainClassName?: string           // Additional CSS classes for main content
}

/**
 * Layout Component
 * 
 * Provides the main layout structure with header and content area.
 * All pages in the application use this component for consistency.
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
  currentUser,
  onUserClick,
  onSoundSettingsClick,
  onKeluarClick,
  showUser = true,
  showSoundSettings = false,
  showBilingualToggle = false,
  showKeluarButton = false,
  className,
  headerClassName,
  mainClassName,
}) => {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <Header
        title={title}
        subtitle={subtitle}
        currentUser={currentUser}
        onUserClick={onUserClick}
        onSoundSettingsClick={onSoundSettingsClick}
        showUser={showUser}
        showSoundSettings={showSoundSettings}
        className={headerClassName}
      />

      <main className={cn('flex-1', mainClassName)}>
        {/* Bilingual Toggle and Keluar Button */}
        {(showBilingualToggle || showKeluarButton) && (
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {showBilingualToggle && <BilingualToggle />}
              </div>
              {showKeluarButton && onKeluarClick && (
                <button
                  onClick={onKeluarClick}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <span className="mr-2">🚪</span>
                  <span>كلوار | Keluar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              © 2025 Akhlak Tahun Dua KSRI. Dibangunkan untuk pembelajaran
              interaktif.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
