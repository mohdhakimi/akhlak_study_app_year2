import { useState, useEffect, useCallback } from 'react'
import { ContentData, StudyTopic, QuizCategory } from '../types'
// Statically import content to avoid runtime dynamic import fetch issues on some CDNs
import akhlakData from '../data/akhlak_db.json'
import feqahData from '../data/feqah_db.json'

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

      // Select pre-bundled data based on subject (no runtime network fetch)
      const data = subject === 'feqah' ? feqahData : akhlakData

      // Validate the data structure
      if (!data || !(data as any).topics || !Array.isArray((data as any).topics)) {
        throw new Error('Invalid content data structure')
      }

      // Data loaded successfully

      setContentData(data as unknown as ContentData)
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
