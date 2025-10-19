import React from 'react'
import { cn } from '../utils/cn'
import Header from './Header'
import BilingualToggle from './BilingualToggle'

export interface LayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  currentUser?: string
  onUserClick?: () => void
  onSoundSettingsClick?: () => void
  onKeluarClick?: () => void
  showUser?: boolean
  showSoundSettings?: boolean
  showBilingualToggle?: boolean
  showKeluarButton?: boolean
  className?: string
  headerClassName?: string
  mainClassName?: string
}

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
