/**
 * =============================================================================
 * ANALYTICS DASHBOARD COMPONENT
 * =============================================================================
 * A comprehensive analytics dashboard for viewing application usage and performance.
 * 
 * Features:
 * - Real-time analytics display
 * - Multiple chart types
 * - Data export functionality
 * - User activity tracking
 * - Performance metrics
 */

import React, { useState, useEffect } from 'react'
import { useAnalytics } from '../../hooks/useAnalytics'
import { useBilingual } from '../../contexts/BilingualContext'
import SimpleChart from './SimpleChart'
import Card from '../Card'
import Button from '../Button'
import { formatDate, formatNumber } from '../../utils/format'

export interface AnalyticsDashboardProps {
  className?: string
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const { getAnalyticsData, exportData, clearData, isTracking } = useAnalytics()
  const { formatText } = useBilingual()
  const [analyticsData, setAnalyticsData] = useState(getAnalyticsData())
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | 'all'>('30d')

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(getAnalyticsData())
    }, 30000)

    return () => clearInterval(interval)
  }, [getAnalyticsData])

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      clearData()
      setAnalyticsData(getAnalyticsData())
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getRecentEvents = () => {
    return analyticsData.events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
  }

  const getPopularPagesData = () => {
    return analyticsData.popularPages.slice(0, 5).map(page => ({
      label: page.page,
      value: page.views,
      color: '#3B82F6'
    }))
  }

  const getMostActiveUsersData = () => {
    return analyticsData.mostActiveUsers.slice(0, 5).map(user => ({
      label: user.userId,
      value: user.sessionCount,
      color: '#10B981'
    }))
  }

  const getQuizScoresData = () => {
    const scoreRanges = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 }
    ]

    analyticsData.events
      .filter(e => e.type === 'quiz_complete' && e.value !== undefined)
      .forEach(event => {
        const score = event.value!
        const range = scoreRanges.find(r => score >= r.min && score <= r.max)
        if (range) range.count++
      })

    return scoreRanges.map(range => ({
      label: range.label,
      value: range.count,
      color: range.count > 0 ? '#8B5CF6' : '#E5E7EB'
    }))
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {formatText('Analytics Dashboard | داشبورد التحليلات')}
            </h1>
            <p className="text-gray-600 mt-1">
              {formatText('Monitor application usage and performance | مراقبة استخدام التطبيق والأداء')}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isTracking 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isTracking ? 'Tracking Active' : 'Tracking Disabled'}
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              Export Data
            </Button>
            <Button onClick={handleClearData} variant="danger" size="sm">
              Clear Data
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.totalPageViews)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Session</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDuration(analyticsData.averageSessionDuration)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleChart
          data={getPopularPagesData()}
          type="bar"
          title="Most Popular Pages"
          height={250}
        />
        <SimpleChart
          data={getMostActiveUsersData()}
          type="bar"
          title="Most Active Users"
          height={250}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleChart
          data={getQuizScoresData()}
          type="bar"
          title="Quiz Score Distribution"
          height={250}
        />
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz & Test Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Quizzes</span>
              <span className="font-semibold">{analyticsData.quizStats.totalQuizzes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Quiz Score</span>
              <span className="font-semibold">{Math.round(analyticsData.quizStats.averageScore)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quiz Completion Rate</span>
              <span className="font-semibold">{Math.round(analyticsData.quizStats.completionRate)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tests</span>
              <span className="font-semibold">{analyticsData.testStats.totalTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Test Score</span>
              <span className="font-semibold">{Math.round(analyticsData.testStats.averageScore)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Test Completion Rate</span>
              <span className="font-semibold">{Math.round(analyticsData.testStats.completionRate)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Study Statistics */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{analyticsData.studyStats.totalSessions}</p>
            <p className="text-sm text-gray-600">Study Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatDuration(analyticsData.studyStats.averageDuration * 1000)}
            </p>
            <p className="text-sm text-gray-600">Avg Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{analyticsData.studyStats.topicsViewed.length}</p>
            <p className="text-sm text-gray-600">Topics Viewed</p>
          </div>
        </div>
        {analyticsData.studyStats.topicsViewed.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Topics Studied:</p>
            <div className="flex flex-wrap gap-2">
              {analyticsData.studyStats.topicsViewed.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {getRecentEvents().map((event, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'quiz_complete' ? 'bg-green-500' :
                  event.type === 'test_complete' ? 'bg-blue-500' :
                  event.type === 'study_session' ? 'bg-purple-500' :
                  event.type === 'error' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.action} {event.label && `- ${event.label}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.category} • {formatDate(new Date(event.timestamp))}
                  </p>
                </div>
              </div>
              {event.value !== undefined && (
                <span className="text-sm font-medium text-gray-600">
                  {event.value}%
                </span>
              )}
            </div>
          ))}
          {getRecentEvents().length === 0 && (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard
