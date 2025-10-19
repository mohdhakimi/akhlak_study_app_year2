/**
 * =============================================================================
 * ANALYTICS PAGE
 * =============================================================================
 * A page for viewing application analytics and usage monitoring.
 * 
 * Features:
 * - Analytics dashboard
 * - Data export functionality
 * - Real-time monitoring
 * - User activity tracking
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalytics } from '../hooks/useAnalytics'
import { useAnalyticsAuth } from '../hooks/useAnalyticsAuth'
import { useBilingual } from '../contexts/BilingualContext'
import Layout from '../components/Layout'
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard'
import AnalyticsLogin from '../components/analytics/AnalyticsLogin'
import BackToMenuButton from '../components/BackToMenuButton'
import { TEXT } from '../constants/text'

const Analytics: React.FC = () => {
  const navigate = useNavigate()
  const { formatText } = useBilingual()
  const { trackPageView } = useAnalytics()
  const { isAuthenticated, isLoading, login, logout, timeUntilExpiry } = useAnalyticsAuth()

  useEffect(() => {
    if (isAuthenticated) {
      trackPageView('analytics', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    }
  }, [trackPageView, isAuthenticated])

  const handleLogin = (password: string) => {
    return login(password)
  }

  const handleLogout = () => {
    logout()
  }

  const handleBackToMenu = () => {
    navigate('/')
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            {formatText('Loading... | جاري التحميل...')}
          </p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <AnalyticsLogin
        onLogin={handleLogin}
        onCancel={handleBackToMenu}
      />
    )
  }

  return (
    <Layout
      title={formatText('Analytics Dashboard | داشبورد التحليلات')}
      subtitle={formatText('Monitor application usage and performance | مراقبة استخدام التطبيق والأداء')}
      showBilingualToggle={true}
      showKeluarButton={true}
      onKeluarClick={handleBackToMenu}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnalyticsDashboard />
          
          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <BackToMenuButton
              onClick={handleBackToMenu}
              variant="outline"
              size="lg"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Analytics
