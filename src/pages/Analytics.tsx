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
import { useBilingual } from '../contexts/BilingualContext'
import Layout from '../components/Layout'
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard'
import BackToMenuButton from '../components/BackToMenuButton'
import { TEXT } from '../constants/text'

const Analytics: React.FC = () => {
  const navigate = useNavigate()
  const { formatText } = useBilingual()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView('analytics', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })
  }, [trackPageView])

  const handleBackToMenu = () => {
    navigate('/')
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
