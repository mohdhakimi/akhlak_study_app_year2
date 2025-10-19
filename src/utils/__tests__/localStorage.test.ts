import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getUsers,
  saveUser,
  deleteUser,
  getCurrentUser,
  setCurrentUser,
  getScores,
  saveScore,
  getScoresByUser,
  getScoresByQuiz,
  getTopScores,
  getSettings,
  updateSettings,
  clearAllData,
  getStorageUsage,
  isValidUser,
  isValidScore,
} from '../localStorage'
import { User, ScoreRecord, AppSettings, STORAGE_KEYS } from '../../types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('User management', () => {
    const mockUser: User = {
      id: 'user1',
      name: 'Test User',
      createdAt: '2025-10-18T10:00:00Z',
    }

    it('should get empty users array when no users exist', () => {
      const users = getUsers()
      expect(users).toEqual([])
    })

    it('should save and retrieve a user', () => {
      const success = saveUser(mockUser)
      expect(success).toBe(true)

      const users = getUsers()
      expect(users).toHaveLength(1)
      expect(users[0]).toEqual(mockUser)
    })

    it('should update existing user', () => {
      saveUser(mockUser)

      const updatedUser = { ...mockUser, name: 'Updated User' }
      const success = saveUser(updatedUser)

      expect(success).toBe(true)

      const users = getUsers()
      expect(users).toHaveLength(1)
      expect(users[0].name).toBe('Updated User')
    })

    it('should delete a user', () => {
      saveUser(mockUser)
      const success = deleteUser(mockUser.id)

      expect(success).toBe(true)

      const users = getUsers()
      expect(users).toHaveLength(0)
    })

    it('should handle current user operations', () => {
      expect(getCurrentUser()).toBeNull()

      const success = setCurrentUser(mockUser)
      expect(success).toBe(true)

      const currentUser = getCurrentUser()
      expect(currentUser).toEqual(mockUser)

      const clearSuccess = setCurrentUser(null)
      expect(clearSuccess).toBe(true)
      expect(getCurrentUser()).toBeNull()
    })
  })

  describe('Score management', () => {
    const mockScore: ScoreRecord = {
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
          isCorrect: true,
        },
      ],
    }

    it('should get empty scores array when no scores exist', () => {
      const scores = getScores()
      expect(scores).toEqual([])
    })

    it('should save and retrieve a score', () => {
      const success = saveScore(mockScore)
      expect(success).toBe(true)

      const scores = getScores()
      expect(scores).toHaveLength(1)
      expect(scores[0]).toEqual(mockScore)
    })

    it('should filter scores by user', () => {
      const score1 = { ...mockScore, userName: 'User1' }
      const score2 = { ...mockScore, id: 'score2', userName: 'User2' }

      saveScore(score1)
      saveScore(score2)

      const user1Scores = getScoresByUser('User1')
      expect(user1Scores).toHaveLength(1)
      expect(user1Scores[0].userName).toBe('User1')
    })

    it('should filter scores by quiz', () => {
      const score1 = { ...mockScore, quizId: 'quiz1' }
      const score2 = { ...mockScore, id: 'score2', quizId: 'quiz2' }

      saveScore(score1)
      saveScore(score2)

      const quiz1Scores = getScoresByQuiz('quiz1')
      expect(quiz1Scores).toHaveLength(1)
      expect(quiz1Scores[0].quizId).toBe('quiz1')
    })

    it('should get top scores sorted by percentage', () => {
      const score1 = { ...mockScore, id: 'score1', percentage: 60 }
      const score2 = { ...mockScore, id: 'score2', percentage: 90 }
      const score3 = { ...mockScore, id: 'score3', percentage: 70 }

      saveScore(score1)
      saveScore(score2)
      saveScore(score3)

      const topScores = getTopScores('quiz1', 2)
      expect(topScores).toHaveLength(2)
      expect(topScores[0].percentage).toBe(90)
      expect(topScores[1].percentage).toBe(70)
    })
  })

  describe('Settings management', () => {
    it('should get default settings', () => {
      const settings = getSettings()
      expect(settings).toEqual({
        soundEnabled: true,
        animationsEnabled: true,
        language: 'ms',
      })
    })

    it('should update settings', () => {
      const updates: Partial<AppSettings> = {
        soundEnabled: false,
        language: 'en',
      }

      const success = updateSettings(updates)
      expect(success).toBe(true)

      const settings = getSettings()
      expect(settings.soundEnabled).toBe(false)
      expect(settings.animationsEnabled).toBe(true) // unchanged
      expect(settings.language).toBe('en')
    })
  })

  describe('Utility functions', () => {
    it('should clear all data', () => {
      // Add some data
      saveUser({ id: 'user1', name: 'Test', createdAt: '2025-10-18T10:00:00Z' })
      saveScore({
        id: 'score1',
        userName: 'Test',
        quizId: 'quiz1',
        score: 5,
        totalQuestions: 10,
        percentage: 50,
        timestamp: '2025-10-18T10:00:00Z',
        answers: [],
      })

      const success = clearAllData()
      expect(success).toBe(true)

      expect(getUsers()).toHaveLength(0)
      expect(getScores()).toHaveLength(0)
      expect(getCurrentUser()).toBeNull()
    })

    it('should calculate storage usage', () => {
      const usage = getStorageUsage()
      expect(usage).toHaveProperty('used')
      expect(usage).toHaveProperty('available')
      expect(usage).toHaveProperty('percentage')
      expect(typeof usage.used).toBe('number')
      expect(typeof usage.available).toBe('number')
      expect(typeof usage.percentage).toBe('number')
    })
  })

  describe('Data validation', () => {
    it('should validate user objects', () => {
      const validUser: User = {
        id: 'user1',
        name: 'Test User',
        createdAt: '2025-10-18T10:00:00Z',
      }

      const invalidUser = {
        id: 'user1',
        name: '', // empty name
        createdAt: '2025-10-18T10:00:00Z',
      }

      expect(isValidUser(validUser)).toBe(true)
      expect(isValidUser(invalidUser)).toBe(false)
      expect(isValidUser(null)).toBe(false)
      expect(isValidUser(undefined)).toBe(false)
    })

    it('should validate score objects', () => {
      const validScore: ScoreRecord = {
        id: 'score1',
        userName: 'Test User',
        quizId: 'quiz1',
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        timestamp: '2025-10-18T10:00:00Z',
        answers: [],
      }

      const invalidScore = {
        id: 'score1',
        userName: 'Test User',
        quizId: 'quiz1',
        score: -1, // negative score
        totalQuestions: 10,
        percentage: 80,
        timestamp: '2025-10-18T10:00:00Z',
        answers: [],
      }

      expect(isValidScore(validScore)).toBe(true)
      expect(isValidScore(invalidScore)).toBe(false)
      expect(isValidScore(null)).toBe(false)
      expect(isValidScore(undefined)).toBe(false)
    })
  })

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalGetItem = localStorageMock.getItem
      localStorageMock.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      const users = getUsers()
      expect(users).toEqual([])

      // Restore original function
      localStorageMock.getItem = originalGetItem
    })

    it('should handle JSON parsing errors', () => {
      // Mock localStorage to return invalid JSON
      const originalGetItem = localStorageMock.getItem
      localStorageMock.getItem = vi.fn(key => {
        if (key === STORAGE_KEYS.USERS) return 'invalid json'
        return null
      })

      const users = getUsers()
      expect(users).toEqual([])

      // Restore original function
      localStorageMock.getItem = originalGetItem
    })
  })
})
