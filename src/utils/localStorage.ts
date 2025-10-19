/**
 * =============================================================================
 * LOCAL STORAGE UTILITY FUNCTIONS
 * =============================================================================
 * This module provides comprehensive localStorage management for the Akhlak
 * Flashcard application. It handles data persistence, validation, and error
 * recovery for all application data stored in the browser's localStorage.
 *
 * Features:
 * - Type-safe data serialization/deserialization
 * - Error handling and fallback values
 * - Data validation and integrity checks
 * - Storage usage monitoring
 * - Bulk data operations
 */

import { User, ScoreRecord, AppSettings, STORAGE_KEYS } from '../types'

// =============================================================================
// CORE STORAGE FUNCTIONS
// =============================================================================

/**
 * Generic function to safely retrieve data from localStorage
 * @param key - The localStorage key to retrieve
 * @param defaultValue - Default value to return if key doesn't exist or parsing fails
 * @returns The parsed data or default value
 * @template T - Type of data being retrieved
 */
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Generic function to safely save data to localStorage
 * @param key - The localStorage key to save to
 * @param value - The data to save
 * @returns True if save was successful, false otherwise
 * @template T - Type of data being saved
 */
const saveToStorage = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
    return false
  }
}

// User management functions
export const getUsers = (): User[] => {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
}

export const saveUser = (user: User): boolean => {
  const users = getUsers()
  const existingUserIndex = users.findIndex(u => u.id === user.id)

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user
  } else {
    users.push(user)
  }

  return saveToStorage(STORAGE_KEYS.USERS, users)
}

export const deleteUser = (userId: string): boolean => {
  const users = getUsers()
  const filteredUsers = users.filter(u => u.id !== userId)
  return saveToStorage(STORAGE_KEYS.USERS, filteredUsers)
}

export const getCurrentUser = (): User | null => {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export const setCurrentUser = (user: User | null): boolean => {
  return saveToStorage(STORAGE_KEYS.CURRENT_USER, user)
}

// Score management functions
export const getScores = (): ScoreRecord[] => {
  return getFromStorage<ScoreRecord[]>(STORAGE_KEYS.SCORES, [])
}

export const saveScore = (score: ScoreRecord): boolean => {
  const scores = getScores()
  scores.push(score)
  return saveToStorage(STORAGE_KEYS.SCORES, scores)
}

export const getScoresByUser = (userName: string): ScoreRecord[] => {
  const scores = getScores()
  return scores.filter(score => score.userName === userName)
}

export const getScoresByQuiz = (quizId: string): ScoreRecord[] => {
  const scores = getScores()
  return scores.filter(score => score.quizId === quizId)
}

export const getTopScores = (
  quizId: string,
  limit: number = 10
): ScoreRecord[] => {
  const scores = getScoresByQuiz(quizId)
  return scores.sort((a, b) => b.percentage - a.percentage).slice(0, limit)
}

// Settings management functions
export const getSettings = (): AppSettings => {
  return getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, {
    soundEnabled: true,
    animationsEnabled: true,
    language: 'ms',
  })
}

export const updateSettings = (settings: Partial<AppSettings>): boolean => {
  const currentSettings = getSettings()
  const newSettings = { ...currentSettings, ...settings }
  return saveToStorage(STORAGE_KEYS.SETTINGS, newSettings)
}

// Utility functions
export const clearAllData = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

export const getStorageUsage = (): {
  used: number
  available: number
  percentage: number
} => {
  try {
    let used = 0
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        used += item.length
      }
    })

    // Estimate available space (most browsers have 5-10MB limit)
    const estimatedLimit = 5 * 1024 * 1024 // 5MB
    const available = Math.max(0, estimatedLimit - used)
    const percentage = (used / estimatedLimit) * 100

    return { used, available, percentage }
  } catch (error) {
    console.error('Error calculating storage usage:', error)
    return { used: 0, available: 0, percentage: 0 }
  }
}

// Data validation functions
export const isValidUser = (user: any): user is User => {
  return (
    user != null &&
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.createdAt === 'string' &&
    user.name.trim().length > 0
  )
}

export const isValidScore = (score: any): score is ScoreRecord => {
  return (
    score != null &&
    typeof score === 'object' &&
    typeof score.id === 'string' &&
    typeof score.userName === 'string' &&
    typeof score.quizId === 'string' &&
    typeof score.score === 'number' &&
    typeof score.totalQuestions === 'number' &&
    typeof score.percentage === 'number' &&
    typeof score.timestamp === 'string' &&
    Array.isArray(score.answers) &&
    score.score >= 0 &&
    score.totalQuestions > 0 &&
    score.percentage >= 0 &&
    score.percentage <= 100
  )
}
