import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScores } from '../useScores'
import * as localStorageUtils from '../../utils/localStorage'

// Mock the localStorage utilities
vi.mock('../../utils/localStorage', () => ({
  getScores: vi.fn(),
  saveScore: vi.fn(),
  getScoresByUser: vi.fn(),
  getScoresByQuiz: vi.fn(),
  getTopScores: vi.fn(),
  isValidScore: vi.fn()
}))

const mockScore: localStorageUtils.ScoreRecord = {
  id: 'score1',
  userName: 'Test User',
  quizId: 'quiz1',
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  timestamp: '2025-10-18T10:00:00Z',
  answers: [
    {
      questionId: 'q1',
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true
    }
  ]
}

describe('useScores', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(localStorageUtils.getScores).mockReturnValue([])
    vi.mocked(localStorageUtils.isValidScore).mockReturnValue(true)
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useScores())
    
    expect(result.current.scores).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should load scores on mount', () => {
    const mockScores = [mockScore]
    vi.mocked(localStorageUtils.getScores).mockReturnValue(mockScores)
    
    const { result } = renderHook(() => useScores())
    
    expect(result.current.scores).toEqual(mockScores)
  })

  it('should add a new score successfully', async () => {
    vi.mocked(localStorageUtils.saveScore).mockReturnValue(true)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const success = result.current.addScore(mockScore)
      expect(success).toBe(true)
    })
    
    expect(localStorageUtils.saveScore).toHaveBeenCalledWith(mockScore)
    expect(result.current.scores).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('should handle invalid score data', async () => {
    vi.mocked(localStorageUtils.isValidScore).mockReturnValue(false)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const success = result.current.addScore(mockScore)
      expect(success).toBe(false)
    })
    
    expect(result.current.error).toBe('Data skor tidak sah')
  })

  it('should get user scores', async () => {
    const mockUserScores = [mockScore]
    vi.mocked(localStorageUtils.getScoresByUser).mockReturnValue(mockUserScores)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const userScores = result.current.getUserScores('Test User')
      expect(userScores).toEqual(mockUserScores)
    })
    
    expect(localStorageUtils.getScoresByUser).toHaveBeenCalledWith('Test User')
  })

  it('should get quiz scores', async () => {
    const mockQuizScores = [mockScore]
    vi.mocked(localStorageUtils.getScoresByQuiz).mockReturnValue(mockQuizScores)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const quizScores = result.current.getQuizScores('quiz1')
      expect(quizScores).toEqual(mockQuizScores)
    })
    
    expect(localStorageUtils.getScoresByQuiz).toHaveBeenCalledWith('quiz1')
  })

  it('should get leaderboard', async () => {
    const mockLeaderboard = [
      {
        rank: 1,
        userName: 'User1',
        score: 9,
        percentage: 90,
        date: '18/10/2025',
        quizId: 'quiz1'
      },
      {
        rank: 2,
        userName: 'User2',
        score: 8,
        percentage: 80,
        date: '18/10/2025',
        quizId: 'quiz1'
      }
    ]
    
    vi.mocked(localStorageUtils.getTopScores).mockReturnValue([
      { ...mockScore, userName: 'User1', percentage: 90 },
      { ...mockScore, userName: 'User2', percentage: 80 }
    ])
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const leaderboard = result.current.getLeaderboard('quiz1', 2)
      expect(leaderboard).toHaveLength(2)
      expect(leaderboard[0].rank).toBe(1)
      expect(leaderboard[0].userName).toBe('User1')
      expect(leaderboard[0].percentage).toBe(90)
    })
  })

  it('should get user best score', async () => {
    const mockScores = [
      { ...mockScore, percentage: 60 },
      { ...mockScore, percentage: 80 },
      { ...mockScore, percentage: 70 }
    ]
    
    vi.mocked(localStorageUtils.getScoresByUser).mockReturnValue(mockScores)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const bestScore = result.current.getUserBestScore('Test User', 'quiz1')
      expect(bestScore?.percentage).toBe(80)
    })
  })

  it('should return null for user best score when no scores exist', async () => {
    vi.mocked(localStorageUtils.getScoresByUser).mockReturnValue([])
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const bestScore = result.current.getUserBestScore('Test User', 'quiz1')
      expect(bestScore).toBeNull()
    })
  })

  it('should get user average score', async () => {
    const mockScores = [
      { ...mockScore, percentage: 60 },
      { ...mockScore, percentage: 80 },
      { ...mockScore, percentage: 70 }
    ]
    
    vi.mocked(localStorageUtils.getScoresByUser).mockReturnValue(mockScores)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const averageScore = result.current.getUserAverageScore('Test User', 'quiz1')
      expect(averageScore).toBe(70) // (60 + 80 + 70) / 3 = 70
    })
  })

  it('should return 0 for user average score when no scores exist', async () => {
    vi.mocked(localStorageUtils.getScoresByUser).mockReturnValue([])
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const averageScore = result.current.getUserAverageScore('Test User', 'quiz1')
      expect(averageScore).toBe(0)
    })
  })

  it('should get quiz statistics', async () => {
    const mockScores = [
      { ...mockScore, percentage: 60 },
      { ...mockScore, percentage: 80 },
      { ...mockScore, percentage: 70 }
    ]
    
    vi.mocked(localStorageUtils.getScoresByQuiz).mockReturnValue(mockScores)
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const stats = result.current.getQuizStats('quiz1')
      expect(stats.totalAttempts).toBe(3)
      expect(stats.averageScore).toBe(70)
      expect(stats.highestScore).toBe(80)
      expect(stats.lowestScore).toBe(60)
    })
  })

  it('should return zero stats when no scores exist', async () => {
    vi.mocked(localStorageUtils.getScoresByQuiz).mockReturnValue([])
    
    const { result } = renderHook(() => useScores())
    
    await act(async () => {
      const stats = result.current.getQuizStats('quiz1')
      expect(stats.totalAttempts).toBe(0)
      expect(stats.averageScore).toBe(0)
      expect(stats.highestScore).toBe(0)
      expect(stats.lowestScore).toBe(0)
    })
  })

  it('should clear error', async () => {
    const { result } = renderHook(() => useScores())
    
    // First set an error by adding invalid score
    vi.mocked(localStorageUtils.isValidScore).mockReturnValue(false)
    
    await act(async () => {
      result.current.addScore(mockScore)
    })
    
    expect(result.current.error).toBe('Data skor tidak sah')
    
    // Then clear it
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('should handle localStorage errors', async () => {
    vi.mocked(localStorageUtils.getScores).mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    const { result } = renderHook(() => useScores())
    
    expect(result.current.error).toBe('Failed to load scores data')
    expect(result.current.loading).toBe(false)
  })
})
