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

export function useContentData(subject: 'akhlak' | 'feqah' = 'akhlak'): UseContentDataReturn {
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadContentData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Import the JSON data based on subject
      const data = subject === 'feqah'
        ? await import('../data/feqah_db.json')
        : await import('../data/akhlak_db.json')

      // Validate the data structure
      if (
        !data.default ||
        !data.default.topics ||
        !Array.isArray(data.default.topics)
      ) {
        throw new Error('Invalid content data structure')
      }

      // Data loaded successfully

      setContentData(data.default as unknown as ContentData)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load content data'
      setError(errorMessage)
      console.error('Error loading content data:', err)
    } finally {
      setLoading(false)
    }
  }, [subject])

  useEffect(() => {
    loadContentData()
  }, [loadContentData])

  const refetch = useCallback(() => {
    loadContentData()
  }, [loadContentData])

  // Use quizCategories directly from the data, or transform topics if not available
  const quizCategories: QuizCategory[] =
    (contentData as any)?.quizCategories ||
    contentData?.topics?.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      questions: topic.questions || [],
    })) ||
    []

  return {
    contentData,
    topics: contentData?.topics || [],
    quizCategories,
    loading,
    error,
    refetch,
  }
}
