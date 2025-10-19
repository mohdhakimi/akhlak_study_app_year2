/**
 * =============================================================================
 * USE ANALYTICS HOOK
 * =============================================================================
 * A custom hook for tracking user interactions and application analytics.
 * 
 * Features:
 * - Event tracking with timestamps
 * - User session management
 * - Performance metrics
 * - Local storage persistence
 * - Data export functionality
 */

import { useState, useEffect, useCallback } from 'react'

export interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'quiz_start' | 'quiz_complete' | 'test_start' | 'test_complete' | 'study_session' | 'user_action' | 'error' | 'performance'
  category: string
  action: string
  label?: string
  value?: number
  timestamp: number
  userId?: string
  sessionId: string
  metadata?: Record<string, any>
}

export interface SessionData {
  id: string
  startTime: number
  endTime?: number
  userId?: string
  pageViews: number
  events: AnalyticsEvent[]
  userAgent: string
  screenResolution: string
  language: string
}

export interface AnalyticsData {
  sessions: SessionData[]
  events: AnalyticsEvent[]
  totalUsers: number
  totalSessions: number
  totalPageViews: number
  averageSessionDuration: number
  mostActiveUsers: Array<{ userId: string; sessionCount: number; totalTime: number }>
  popularPages: Array<{ page: string; views: number }>
  quizStats: {
    totalQuizzes: number
    averageScore: number
    completionRate: number
  }
  testStats: {
    totalTests: number
    averageScore: number
    completionRate: number
  }
  studyStats: {
    totalSessions: number
    averageDuration: number
    topicsViewed: string[]
  }
}

export interface UseAnalyticsReturn {
  trackEvent: (type: AnalyticsEvent['type'], category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>) => void
  trackPageView: (page: string, metadata?: Record<string, any>) => void
  trackQuizStart: (category: string, metadata?: Record<string, any>) => void
  trackQuizComplete: (category: string, score: number, totalQuestions: number, metadata?: Record<string, any>) => void
  trackTestStart: (metadata?: Record<string, any>) => void
  trackTestComplete: (score: number, totalQuestions: number, metadata?: Record<string, any>) => void
  trackStudySession: (topic: string, duration: number, metadata?: Record<string, any>) => void
  trackError: (error: string, context: string, metadata?: Record<string, any>) => void
  trackPerformance: (metric: string, value: number, metadata?: Record<string, any>) => void
  getAnalyticsData: () => AnalyticsData
  exportData: () => string
  clearData: () => void
  currentSession: SessionData | null
  isTracking: boolean
}

export const useAnalytics = (userId?: string): UseAnalyticsReturn => {
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null)
  const [isTracking, setIsTracking] = useState(true)

  // Initialize session
  useEffect(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newSession: SessionData = {
      id: sessionId,
      startTime: Date.now(),
      userId,
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    }

    setCurrentSession(newSession)
    
    // Load existing analytics data
    const existingData = localStorage.getItem('analytics_data')
    if (existingData) {
      try {
        const data = JSON.parse(existingData)
        data.sessions.push(newSession)
        localStorage.setItem('analytics_data', JSON.stringify(data))
      } catch (error) {
        console.warn('Failed to load existing analytics data:', error)
      }
    } else {
      // Initialize new analytics data
      const initialData: AnalyticsData = {
        sessions: [newSession],
        events: [],
        totalUsers: 0,
        totalSessions: 1,
        totalPageViews: 0,
        averageSessionDuration: 0,
        mostActiveUsers: [],
        popularPages: [],
        quizStats: {
          totalQuizzes: 0,
          averageScore: 0,
          completionRate: 0
        },
        testStats: {
          totalTests: 0,
          averageScore: 0,
          completionRate: 0
        },
        studyStats: {
          totalSessions: 0,
          averageDuration: 0,
          topicsViewed: []
        }
      }
      localStorage.setItem('analytics_data', JSON.stringify(initialData))
    }

    // Track page unload
    const handleBeforeUnload = () => {
      if (currentSession) {
        trackEvent('user_action', 'session', 'page_unload')
        endSession()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (currentSession) {
        endSession()
      }
    }
  }, [userId])

  const endSession = useCallback(() => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: Date.now()
      }
      
      const existingData = localStorage.getItem('analytics_data')
      if (existingData) {
        try {
          const data = JSON.parse(existingData)
          const sessionIndex = data.sessions.findIndex((s: SessionData) => s.id === currentSession.id)
          if (sessionIndex !== -1) {
            data.sessions[sessionIndex] = updatedSession
            localStorage.setItem('analytics_data', JSON.stringify(data))
          }
        } catch (error) {
          console.warn('Failed to update session data:', error)
        }
      }
    }
  }, [currentSession])

  const trackEvent = useCallback((
    type: AnalyticsEvent['type'],
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    if (!isTracking || !currentSession) return

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      userId,
      sessionId: currentSession.id,
      metadata
    }

    // Update current session
    const updatedSession = {
      ...currentSession,
      events: [...currentSession.events, event]
    }
    setCurrentSession(updatedSession)

    // Update stored data
    const existingData = localStorage.getItem('analytics_data')
    if (existingData) {
      try {
        const data = JSON.parse(existingData)
        data.events.push(event)
        
        // Update session
        const sessionIndex = data.sessions.findIndex((s: SessionData) => s.id === currentSession.id)
        if (sessionIndex !== -1) {
          data.sessions[sessionIndex] = updatedSession
        }
        
        localStorage.setItem('analytics_data', JSON.stringify(data))
      } catch (error) {
        console.warn('Failed to track event:', error)
      }
    }
  }, [isTracking, currentSession, userId])

  const trackPageView = useCallback((page: string, metadata?: Record<string, any>) => {
    trackEvent('page_view', 'navigation', 'page_view', page, undefined, metadata)
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        pageViews: currentSession.pageViews + 1
      }
      setCurrentSession(updatedSession)
    }
  }, [trackEvent, currentSession])

  const trackQuizStart = useCallback((category: string, metadata?: Record<string, any>) => {
    trackEvent('quiz_start', 'quiz', 'start', category, undefined, metadata)
  }, [trackEvent])

  const trackQuizComplete = useCallback((category: string, score: number, totalQuestions: number, metadata?: Record<string, any>) => {
    const percentage = Math.round((score / totalQuestions) * 100)
    trackEvent('quiz_complete', 'quiz', 'complete', category, percentage, {
      ...metadata,
      score,
      totalQuestions,
      percentage
    })
  }, [trackEvent])

  const trackTestStart = useCallback((metadata?: Record<string, any>) => {
    trackEvent('test_start', 'test', 'start', 'comprehensive_test', undefined, metadata)
  }, [trackEvent])

  const trackTestComplete = useCallback((score: number, totalQuestions: number, metadata?: Record<string, any>) => {
    const percentage = Math.round((score / totalQuestions) * 100)
    trackEvent('test_complete', 'test', 'complete', 'comprehensive_test', percentage, {
      ...metadata,
      score,
      totalQuestions,
      percentage
    })
  }, [trackEvent])

  const trackStudySession = useCallback((topic: string, duration: number, metadata?: Record<string, any>) => {
    trackEvent('study_session', 'study', 'session', topic, duration, {
      ...metadata,
      topic,
      duration
    })
  }, [trackEvent])

  const trackError = useCallback((error: string, context: string, metadata?: Record<string, any>) => {
    trackEvent('error', 'error', 'occurred', context, undefined, {
      ...metadata,
      error,
      context
    })
  }, [trackEvent])

  const trackPerformance = useCallback((metric: string, value: number, metadata?: Record<string, any>) => {
    trackEvent('performance', 'performance', metric, undefined, value, {
      ...metadata,
      metric,
      value
    })
  }, [trackEvent])

  const getAnalyticsData = useCallback((): AnalyticsData => {
    const existingData = localStorage.getItem('analytics_data')
    if (!existingData) {
      return {
        sessions: [],
        events: [],
        totalUsers: 0,
        totalSessions: 0,
        totalPageViews: 0,
        averageSessionDuration: 0,
        mostActiveUsers: [],
        popularPages: [],
        quizStats: {
          totalQuizzes: 0,
          averageScore: 0,
          completionRate: 0
        },
        testStats: {
          totalTests: 0,
          averageScore: 0,
          completionRate: 0
        },
        studyStats: {
          totalSessions: 0,
          averageDuration: 0,
          topicsViewed: []
        }
      }
    }

    try {
      const data = JSON.parse(existingData)
      
      // Calculate analytics
      const sessions = data.sessions || []
      const events = data.events || []
      
      // Calculate total users
      const uniqueUsers = new Set(sessions.map((s: SessionData) => s.userId).filter(Boolean))
      
      // Calculate total page views
      const totalPageViews = sessions.reduce((sum: number, s: SessionData) => sum + s.pageViews, 0)
      
      // Calculate average session duration
      const completedSessions = sessions.filter((s: SessionData) => s.endTime)
      const totalDuration = completedSessions.reduce((sum: number, s: SessionData) => 
        sum + (s.endTime! - s.startTime), 0)
      const averageSessionDuration = completedSessions.length > 0 ? totalDuration / completedSessions.length : 0
      
      // Calculate most active users
      const userStats = new Map<string, { sessionCount: number; totalTime: number }>()
      sessions.forEach((s: SessionData) => {
        if (s.userId) {
          const existing = userStats.get(s.userId) || { sessionCount: 0, totalTime: 0 }
          userStats.set(s.userId, {
            sessionCount: existing.sessionCount + 1,
            totalTime: existing.totalTime + (s.endTime ? s.endTime - s.startTime : 0)
          })
        }
      })
      const mostActiveUsers = Array.from(userStats.entries()).map(([userId, stats]) => ({
        userId,
        ...stats
      })).sort((a, b) => b.sessionCount - a.sessionCount)
      
      // Calculate popular pages
      const pageViews = new Map<string, number>()
      events.filter((e: AnalyticsEvent) => e.type === 'page_view').forEach((e: AnalyticsEvent) => {
        const page = e.label || 'unknown'
        pageViews.set(page, (pageViews.get(page) || 0) + 1)
      })
      const popularPages = Array.from(pageViews.entries()).map(([page, views]) => ({
        page,
        views
      })).sort((a, b) => b.views - a.views)
      
      // Calculate quiz stats
      const quizEvents = events.filter((e: AnalyticsEvent) => e.type === 'quiz_complete')
      const quizScores = quizEvents.map((e: AnalyticsEvent) => e.value || 0)
      const quizStats = {
        totalQuizzes: quizEvents.length,
        averageScore: quizScores.length > 0 ? quizScores.reduce((sum: number, score: number) => sum + score, 0) / quizScores.length : 0,
        completionRate: events.filter((e: AnalyticsEvent) => e.type === 'quiz_start').length > 0 ? 
          (quizEvents.length / events.filter((e: AnalyticsEvent) => e.type === 'quiz_start').length) * 100 : 0
      }
      
      // Calculate test stats
      const testEvents = events.filter((e: AnalyticsEvent) => e.type === 'test_complete')
      const testScores = testEvents.map((e: AnalyticsEvent) => e.value || 0)
      const testStats = {
        totalTests: testEvents.length,
        averageScore: testScores.length > 0 ? testScores.reduce((sum: number, score: number) => sum + score, 0) / testScores.length : 0,
        completionRate: events.filter((e: AnalyticsEvent) => e.type === 'test_start').length > 0 ? 
          (testEvents.length / events.filter((e: AnalyticsEvent) => e.type === 'test_start').length) * 100 : 0
      }
      
      // Calculate study stats
      const studyEvents = events.filter((e: AnalyticsEvent) => e.type === 'study_session')
      const studyDurations = studyEvents.map((e: AnalyticsEvent) => e.value || 0)
      const studyTopics = studyEvents.map((e: AnalyticsEvent) => e.label || '').filter(Boolean)
      const studyStats = {
        totalSessions: studyEvents.length,
        averageDuration: studyDurations.length > 0 ? studyDurations.reduce((sum: number, duration: number) => sum + duration, 0) / studyDurations.length : 0,
        topicsViewed: [...new Set(studyTopics)] as string[]
      }
      
      return {
        sessions,
        events,
        totalUsers: uniqueUsers.size,
        totalSessions: sessions.length,
        totalPageViews,
        averageSessionDuration,
        mostActiveUsers,
        popularPages,
        quizStats,
        testStats,
        studyStats
      }
    } catch (error) {
      console.warn('Failed to parse analytics data:', error)
      return {
        sessions: [],
        events: [],
        totalUsers: 0,
        totalSessions: 0,
        totalPageViews: 0,
        averageSessionDuration: 0,
        mostActiveUsers: [],
        popularPages: [],
        quizStats: {
          totalQuizzes: 0,
          averageScore: 0,
          completionRate: 0
        },
        testStats: {
          totalTests: 0,
          averageScore: 0,
          completionRate: 0
        },
        studyStats: {
          totalSessions: 0,
          averageDuration: 0,
          topicsViewed: []
        }
      }
    }
  }, [])

  const exportData = useCallback((): string => {
    const data = getAnalyticsData()
    return JSON.stringify(data, null, 2)
  }, [getAnalyticsData])

  const clearData = useCallback(() => {
    localStorage.removeItem('analytics_data')
    setCurrentSession(null)
  }, [])

  return {
    trackEvent,
    trackPageView,
    trackQuizStart,
    trackQuizComplete,
    trackTestStart,
    trackTestComplete,
    trackStudySession,
    trackError,
    trackPerformance,
    getAnalyticsData,
    exportData,
    clearData,
    currentSession,
    isTracking
  }
}
