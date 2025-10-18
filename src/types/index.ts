// User management types
export interface User {
  id: string
  name: string
  createdAt: string
}

// Question and quiz types
export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option (0-3)
  explanation?: string
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
  userName: string
  quizId: string // 'test' for test mode, category id for quiz mode
  score: number
  totalQuestions: number
  percentage: number
  timestamp: string
  answers: AnswerRecord[]
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
