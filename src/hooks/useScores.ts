import { useState, useEffect, useCallback } from 'react'
import { ScoreRecord, LeaderboardEntry } from '../types'
import { 
  getScores, 
  saveScore, 
  getScoresByUser, 
  getScoresByQuiz, 
  getTopScores, 
  isValidScore 
} from '../utils/localStorage'

export function useScores() {
  const [scores, setScores] = useState<ScoreRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load scores from localStorage
  useEffect(() => {
    try {
      const loadedScores = getScores()
      
      // Validate scores data
      const validScores = loadedScores.filter(isValidScore)
      setScores(validScores)
      setError(null)
    } catch (err) {
      setError('Failed to load scores data')
      console.error('Error loading scores:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add a new score
  const addScore = useCallback((score: ScoreRecord): boolean => {
    if (!isValidScore(score)) {
      setError('Data skor tidak sah')
      return false
    }

    try {
      const success = saveScore(score)
      if (success) {
        setScores(prev => [...prev, score])
        setError(null)
        return true
      } else {
        setError('Gagal menyimpan skor')
        return false
      }
    } catch (err) {
      setError('Gagal menyimpan skor')
      console.error('Error adding score:', err)
      return false
    }
  }, [])

  // Get scores by user
  const getUserScores = useCallback((userName: string): ScoreRecord[] => {
    return getScoresByUser(userName)
  }, [])

  // Get scores by quiz
  const getQuizScores = useCallback((quizId: string): ScoreRecord[] => {
    return getScoresByQuiz(quizId)
  }, [])

  // Get top scores for leaderboard
  const getLeaderboard = useCallback((quizId: string, limit: number = 10): LeaderboardEntry[] => {
    const topScores = getTopScores(quizId, limit)
    
    return topScores.map((score, index) => ({
      rank: index + 1,
      userName: score.userName,
      score: score.score,
      percentage: score.percentage,
      date: new Date(score.timestamp).toLocaleDateString('ms-MY'),
      quizId: score.quizId
    }))
  }, [])

  // Get user's best score for a quiz
  const getUserBestScore = useCallback((userName: string, quizId: string): ScoreRecord | null => {
    const userScores = getUserScores(userName)
    const quizScores = userScores.filter(score => score.quizId === quizId)
    
    if (quizScores.length === 0) return null
    
    return quizScores.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    )
  }, [getUserScores])

  // Get user's average score for a quiz
  const getUserAverageScore = useCallback((userName: string, quizId: string): number => {
    const userScores = getUserScores(userName)
    const quizScores = userScores.filter(score => score.quizId === quizId)
    
    if (quizScores.length === 0) return 0
    
    const totalPercentage = quizScores.reduce((sum, score) => sum + score.percentage, 0)
    return Math.round(totalPercentage / quizScores.length)
  }, [getUserScores])

  // Get statistics for a quiz
  const getQuizStats = useCallback((quizId: string) => {
    const quizScores = getScoresByQuiz(quizId)
    
    if (quizScores.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      }
    }

    const percentages = quizScores.map(score => score.percentage)
    const totalAttempts = quizScores.length
    const averageScore = Math.round(percentages.reduce((sum, p) => sum + p, 0) / totalAttempts)
    const highestScore = Math.max(...percentages)
    const lowestScore = Math.min(...percentages)

    return {
      totalAttempts,
      averageScore,
      highestScore,
      lowestScore
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    scores,
    loading,
    error,
    addScore,
    getUserScores,
    getQuizScores,
    getLeaderboard,
    getUserBestScore,
    getUserAverageScore,
    getQuizStats,
    clearError
  }
}
