/**
 * =============================================================================
 * USE ANALYTICS AUTH HOOK
 * =============================================================================
 * A custom hook for managing analytics authentication and session management.
 * 
 * Features:
 * - Password verification
 * - Session management with expiration
 * - Local storage persistence
 * - Automatic logout on session expiry
 */

import { useState, useEffect, useCallback } from 'react'

export interface AnalyticsAuthState {
  isAuthenticated: boolean
  isLoading: boolean
  sessionExpiry: number | null
}

export interface UseAnalyticsAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  sessionExpiry: number | null
  login: (password: string) => boolean
  logout: () => void
  checkSession: () => boolean
  timeUntilExpiry: number
}

const ANALYTICS_SESSION_KEY = 'analytics_session'
const SESSION_DURATION = parseInt(import.meta.env.VITE_ANALYTICS_SESSION_DURATION || '60') * 60 * 1000 // Convert to milliseconds
const ANALYTICS_PASSWORD = import.meta.env.VITE_ANALYTICS_PASSWORD || 'admin123'

export const useAnalyticsAuth = (): UseAnalyticsAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null)

  // Check if session is valid
  const checkSession = useCallback((): boolean => {
    try {
      const sessionData = localStorage.getItem(ANALYTICS_SESSION_KEY)
      if (!sessionData) return false

      const { expiry } = JSON.parse(sessionData)
      const now = Date.now()

      if (now > expiry) {
        // Session expired
        localStorage.removeItem(ANALYTICS_SESSION_KEY)
        setIsAuthenticated(false)
        setSessionExpiry(null)
        return false
      }

      // Session is valid
      setIsAuthenticated(true)
      setSessionExpiry(expiry)
      return true
    } catch (error) {
      console.warn('Failed to check analytics session:', error)
      localStorage.removeItem(ANALYTICS_SESSION_KEY)
      setIsAuthenticated(false)
      setSessionExpiry(null)
      return false
    }
  }, [])

  // Login with password
  const login = useCallback((password: string): boolean => {
    if (password === ANALYTICS_PASSWORD) {
      const now = Date.now()
      const expiry = now + SESSION_DURATION
      
      const sessionData = {
        authenticated: true,
        expiry,
        timestamp: now
      }

      try {
        localStorage.setItem(ANALYTICS_SESSION_KEY, JSON.stringify(sessionData))
        setIsAuthenticated(true)
        setSessionExpiry(expiry)
        return true
      } catch (error) {
        console.error('Failed to save analytics session:', error)
        return false
      }
    }
    return false
  }, [])

  // Logout and clear session
  const logout = useCallback(() => {
    localStorage.removeItem(ANALYTICS_SESSION_KEY)
    setIsAuthenticated(false)
    setSessionExpiry(null)
  }, [])

  // Calculate time until session expiry
  const timeUntilExpiry = sessionExpiry ? Math.max(0, sessionExpiry - Date.now()) : 0

  // Check session on mount
  useEffect(() => {
    setIsLoading(true)
    checkSession()
    setIsLoading(false)
  }, [checkSession])

  // Set up session expiry check
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return

    const interval = setInterval(() => {
      if (Date.now() >= sessionExpiry) {
        logout()
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [isAuthenticated, sessionExpiry, logout])

  // Auto-logout on page unload if session is about to expire
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timeUntilExpiry < 60000) { // Less than 1 minute remaining
        logout()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [timeUntilExpiry, logout])

  return {
    isAuthenticated,
    isLoading,
    sessionExpiry,
    login,
    logout,
    checkSession,
    timeUntilExpiry
  }
}
