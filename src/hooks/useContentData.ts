import { useState, useEffect, useCallback } from 'react'
import { ContentData, StudyTopic, QuizCategory } from '../types'

export interface UseContentDataReturn {
  contentData: ContentData | null
  topics: StudyTopic[]
  quizCategories: QuizCategory[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useContentData(): UseContentDataReturn {
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadContentData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Import the JSON data directly
      const data = await import('../data/content-structure.json')
      
      // Validate the data structure
      if (!data.default || !data.default.topics || !Array.isArray(data.default.topics)) {
        throw new Error('Invalid content data structure')
      }
      
      setContentData(data.default)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content data'
      setError(errorMessage)
      console.error('Error loading content data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContentData()
  }, [loadContentData])

  const refetch = useCallback(() => {
    loadContentData()
  }, [loadContentData])

  return {
    contentData,
    topics: contentData?.topics || [],
    quizCategories: contentData?.quizCategories || [],
    loading,
    error,
    refetch
  }
}
