/**
 * =============================================================================
 * CORE APPLICATION TYPES
 * =============================================================================
 * This file contains all TypeScript type definitions for the Akhlak Flashcard
 * application. Types are organized by functional area for better maintainability.
 */

// =============================================================================
// USER MANAGEMENT TYPES
// =============================================================================

/**
 * Represents a user in the application
 * @interface User
 */
export interface User {
  /** Unique identifier for the user */
  id: string
  /** Display name of the user */
  name: string
  /** ISO timestamp when the user was created */
  createdAt: string
}

// =============================================================================
// QUESTION AND QUIZ TYPES
// =============================================================================

/**
 * Supported question types in the application
 * @type QuestionType
 */
export type QuestionType = 'mcq' | 'true_false' | 'fill_blank'

/**
 * Represents a single question in the quiz system
 * @interface Question
 */
export interface Question {
  /** Unique identifier for the question */
  id: string
  /** The question text (supports bilingual format) */
  question: string
  /** Array of answer options (for MCQ and True/False questions) */
  options: string[]
  /** Index of the correct answer in the options array (0-based) */
  correctAnswer: number
  /** Optional explanation for the correct answer */
  explanation?: string
  /** Type of question (defaults to 'mcq' for backward compatibility) */
  type?: QuestionType
  /** Correct text for fill-in-the-blank questions */
  correctText?: string
}

/**
 * Represents a category of quiz questions
 * @interface QuizCategory
 */
export interface QuizCategory {
  /** Unique identifier for the category */
  id: string
  /** Display name of the category */
  name: string
  /** Description of the category content */
  description: string
  /** Array of questions belonging to this category */
  questions: Question[]
}

// =============================================================================
// STUDY CONTENT TYPES
// =============================================================================

/**
 * Represents a study note within a topic
 * @interface StudyNote
 */
export interface StudyNote {
  /** Unique identifier for the note */
  id: string
  /** Title of the study note */
  title: string
  /** Content of the study note (supports bilingual format) */
  content: string
  /** Order of the note within the topic */
  order: number
}

/**
 * Represents a study topic containing notes and questions
 * @interface StudyTopic
 */
export interface StudyTopic {
  /** Unique identifier for the topic */
  id: string
  /** Display name of the topic */
  name: string
  /** Description of the topic content */
  description: string
  /** Array of study notes for this topic */
  notes: StudyNote[]
  /** Array of questions for this topic (required for quiz functionality) */
  questions: Question[]
}

// =============================================================================
// SCORING AND LEADERBOARD TYPES
// =============================================================================

/**
 * Represents a user's answer to a specific question
 * @interface AnswerRecord
 */
export interface AnswerRecord {
  /** ID of the question that was answered */
  questionId: string
  /** User's selected answer (index for MCQ, text for fill-in-blank) */
  userAnswer: number | string
  /** Index of the correct answer */
  correctAnswer: number
  /** Whether the user's answer was correct */
  isCorrect: boolean
}

/**
 * Represents a complete quiz or test result
 * @interface QuizResult
 */
export interface QuizResult {
  /** The question that was answered */
  question: Question
  /** User's selected answer */
  userAnswer: number | string
  /** Index of the correct answer */
  correctAnswer: number
  /** Whether the user's answer was correct */
  isCorrect: boolean
  /** Shuffled options that were presented to the user */
  shuffledOptions: string[]
  /** New index of correct answer after shuffling */
  newCorrectIndex: number
}

/**
 * Represents a test result (alias for QuizResult for consistency)
 * @interface TestResult
 */
export interface TestResult {
  /** The question that was answered */
  question: Question
  /** User's selected answer */
  userAnswer: number | string
  /** Index of the correct answer */
  correctAnswer: number
  /** Whether the user's answer was correct */
  isCorrect: boolean
  /** Shuffled options that were presented to the user */
  shuffledOptions: string[]
  /** New index of correct answer after shuffling */
  newCorrectIndex: number
}

/**
 * Represents a user's score record for a completed quiz or test
 * @interface ScoreRecord
 */
export interface ScoreRecord {
  /** Unique identifier for the score record */
  id: string
  /** ID of the user who took the quiz/test */
  userId: string
  /** Name of the user who took the quiz/test */
  userName: string
  /** ID of the quiz/test ('test' for test mode, category id for quiz mode) */
  quizId: string
  /** Display name of the quiz/test */
  quizName: string
  /** Number of correct answers */
  score: number
  /** Total number of questions */
  totalQuestions: number
  /** Percentage score (0-100) */
  percentage: number
  /** ISO timestamp when the quiz/test was completed */
  timestamp: string
  /** Type of assessment ('quiz' or 'test') */
  type: 'quiz' | 'test'
  /** Detailed record of all answers */
  answers: AnswerRecord[]
}

/**
 * Represents an entry in the leaderboard
 * @interface LeaderboardEntry
 */
export interface LeaderboardEntry {
  /** Rank position in the leaderboard */
  rank: number
  /** Name of the user */
  userName: string
  /** Score achieved */
  score: number
  /** Percentage score */
  percentage: number
  /** Date when the score was achieved */
  date: string
  /** ID of the quiz/test */
  quizId: string
}

// =============================================================================
// APPLICATION STATE TYPES
// =============================================================================

/**
 * Represents the global application state
 * @interface AppState
 */
export interface AppState {
  /** Currently logged in user (null if no user is selected) */
  currentUser: User | null
  /** List of all registered users */
  users: User[]
  /** List of all score records */
  scores: ScoreRecord[]
}

/**
 * Represents the content data structure loaded from JSON files
 * @interface ContentData
 */
export interface ContentData {
  /** Array of study topics */
  topics: StudyTopic[]
  /** Version of the content data */
  version: string
  /** ISO timestamp when the content was last updated */
  lastUpdated: string
}

// =============================================================================
// APPLICATION SETTINGS TYPES
// =============================================================================

/**
 * Represents user preferences and application settings
 * @interface AppSettings
 */
export interface AppSettings {
  /** Whether sound effects are enabled */
  soundEnabled: boolean
  /** Whether animations are enabled */
  animationsEnabled: boolean
  /** Preferred language ('ms' for Malay, 'en' for English) */
  language: 'ms' | 'en'
}

// =============================================================================
// LOCAL STORAGE CONSTANTS
// =============================================================================

/**
 * Constants for localStorage keys used throughout the application
 * @constant STORAGE_KEYS
 */
export const STORAGE_KEYS = {
  /** Key for storing user data */
  USERS: 'akhlak_users',
  /** Key for storing current user ID */
  CURRENT_USER: 'akhlak_current_user',
  /** Key for storing score records */
  SCORES: 'akhlak_scores',
  /** Key for storing application settings */
  SETTINGS: 'akhlak_settings',
} as const

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Utility type for creating a partial update of an object
 * @type PartialUpdate
 */
export type PartialUpdate<T> = Partial<
  Omit<T, 'id' | 'createdAt' | 'timestamp'>
>

/**
 * Utility type for API response wrapper
 * @type ApiResponse
 */
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Utility type for pagination parameters
 * @type PaginationParams
 */
export type PaginationParams = {
  page: number
  limit: number
  offset?: number
}

/**
 * Utility type for sorting parameters
 * @type SortParams
 */
export type SortParams = {
  field: string
  direction: 'asc' | 'desc'
}
