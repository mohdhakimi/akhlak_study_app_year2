import React from 'react'
import { cn } from '../utils/cn'
import Header from './Header'

export interface LayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  currentUser?: string
  onUserClick?: () => void
  onSoundSettingsClick?: () => void
  showUser?: boolean
  showSoundSettings?: boolean
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
  showUser = true,
  showSoundSettings = false,
  className,
  headerClassName,
  mainClassName
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
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Akhlak Tahun Dua KSRI. Dibangunkan untuk pembelajaran interaktif.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
