// User management types
export interface User {
  id: string
  name: string
  createdAt: string
}

// Question and quiz types
export type QuestionType = 'mcq' | 'true_false' | 'fill_blank'

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option (0-3)
  explanation?: string
  type?: QuestionType // defaults to 'mcq' for backward compatibility
  correctText?: string // for fill_blank questions
}

export interface QuizCategory {
  id: string
  name: string
  description: string
  questions: Question[]
}

// Study content types
export interface StudyNote {
  id: string
  title: string
  content: string
  order: number
}

export interface StudyTopic {
  id: string
  name: string
  description: string
  notes: StudyNote[]
}

// Score and leaderboard types
export interface ScoreRecord {
  id: string
  userId: string
  userName: string
  quizId: string // 'test' for test mode, category id for quiz mode
  quizName: string
  score: number
  totalQuestions: number
  percentage: number
  timestamp: string
  type: 'quiz' | 'test'
  answers: AnswerRecord[]
}

export interface QuizResult {
  question: Question
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  shuffledOptions: string[]
  newCorrectIndex: number
}

export interface TestResult {
  question: Question
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  shuffledOptions: string[]
  newCorrectIndex: number
}

export interface AnswerRecord {
  questionId: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
}

export interface LeaderboardEntry {
  rank: number
  userName: string
  score: number
  percentage: number
  date: string
  quizId: string
}

// App state types
export interface AppState {
  currentUser: User | null
  users: User[]
  scores: ScoreRecord[]
}

// Content structure type
export interface ContentData {
  topics: StudyTopic[]
  quizCategories: QuizCategory[]
  version: string
  lastUpdated: string
}

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'akhlak_users',
  CURRENT_USER: 'akhlak_current_user',
  SCORES: 'akhlak_scores',
  SETTINGS: 'akhlak_settings',
} as const

// Settings type
export interface AppSettings {
  soundEnabled: boolean
  animationsEnabled: boolean
  language: 'ms' | 'en'
}
