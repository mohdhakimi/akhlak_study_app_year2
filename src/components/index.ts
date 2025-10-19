/**
 * =============================================================================
 * COMPONENTS INDEX
 * =============================================================================
 * Centralized export for all components.
 */

// UI Components
export * from './ui'

// Layout Components
export * from './layout-components'

// Navigation Components
export * from './navigation'

// Content Components
export * from './content'

// Feedback Components
export * from './feedback'

// Form Components
export { default as CategorySelector } from './CategorySelector'
export { default as TopicSelector } from './TopicSelector'
export { default as UserSelectionModal } from './UserSelectionModal'

// Results Components
export { default as QuizResults } from './QuizResults'
export { default as TestResults } from './TestResults'
export { default as LeaderboardTable } from './LeaderboardTable'

// Question Types
export { default as AnswerOption } from './AnswerOption'
export { default as FillBlankQuestion } from './FillBlankQuestion'
export { default as TrueFalseQuestion } from './TrueFalseQuestion'

// Utility Components
export { default as Mascot } from './Mascot'
export { default as PageTransition } from './PageTransition'
export { default as SoundSettings } from './SoundSettings'

// Re-export types
export type { CategorySelectorProps } from './CategorySelector'
export type { TopicSelectorProps } from './TopicSelector'
export type { UserSelectionModalProps } from './UserSelectionModal'
export type { QuizResultsProps, QuizResult } from './QuizResults'
export type { TestResultsProps, TestResult } from './TestResults'
export type { LeaderboardTableProps } from './LeaderboardTable'
export type { AnswerOptionProps } from './AnswerOption'
// Note: FillBlankQuestionProps and TrueFalseQuestionProps are not exported from their respective components
