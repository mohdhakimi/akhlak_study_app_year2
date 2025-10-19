import React from 'react'
import { cn } from '../utils/cn'
import { TEXT } from '../constants/text'
import Button from './Button'

export interface HeaderProps {
  title?: string
  subtitle?: string
  currentUser?: string
  onUserClick?: () => void
  onSoundSettingsClick?: () => void
  showUser?: boolean
  showSoundSettings?: boolean
  className?: string
}

const Header: React.FC<HeaderProps> = ({
  title = TEXT.APP_TITLE,
  subtitle = TEXT.APP_SUBTITLE,
  currentUser,
  onUserClick,
  onSoundSettingsClick,
  showUser = true,
  showSoundSettings = true,
  className,
}) => {
  return (
    <header
      className={cn('bg-white shadow-sm border-b border-gray-200', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* User info and settings */}
          <div className="flex items-center space-x-4">
            {/* Sound Settings Button */}
            {showSoundSettings && onSoundSettingsClick && (
              <Button
                onClick={onSoundSettingsClick}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Tetapan Audio"
              >
                🔊
              </Button>
            )}

            {/* User info */}
            {showUser &&
              (currentUser ? (
                <button
                  onClick={onUserClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors group"
                  aria-label={`Pengguna semasa: ${currentUser}`}
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {currentUser.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-primary-900 group-hover:text-primary-800">
                      {currentUser}
                    </p>
                    <p className="text-xs text-primary-600 group-hover:text-primary-700">
                      {TEXT.SWITCH_USER}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-primary-600 group-hover:text-primary-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={onUserClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {TEXT.SELECT_USER}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
