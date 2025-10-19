/**
 * =============================================================================
 * QUIZ MODE CUSTOM HOOK
 * =============================================================================
 * This hook manages the complete quiz experience including question navigation,
 * answer selection, scoring, and result generation. It provides a clean API
 * for quiz components to interact with quiz state and logic.
 * 
 * Features:
 * - Question navigation (next/previous)
 * - Answer selection and validation
 * - Real-time scoring calculation
 * - Option shuffling for fair presentation
 * - Progress tracking and completion detection
 * - Time tracking for performance metrics
 */

import { useState, useCallback, useRef } from 'react'
import { Question, QuizCategory, QuizResult } from '../types'
import { shuffleArray, selectQuizOptions, randomSelect } from '../utils/shuffleOptions'

// =============================================================================
// QUIZ STATE INTERFACES
// =============================================================================

/**
 * Internal state structure for quiz management
 * @interface QuizState
 */
export interface QuizState {
  /** Current question index (0-based) */
  currentQuestionIndex: number
  /** Array of selected answers for each question (null if not answered) */
  selectedAnswers: (number | null)[]
  /** Whether the current question has been answered */
  isAnswered: boolean
  /** Whether the correct answer has been revealed */
  isRevealed: boolean
  /** Timestamp when quiz started */
  startTime: number | null
  /** Timestamp when quiz ended */
  endTime: number | null
}

/**
 * Return type for the useQuizMode hook
 * @interface UseQuizModeReturn
 */
export interface UseQuizModeReturn {
  // =============================================================================
  // STATE VALUES
  // =============================================================================
  
  /** Current question being displayed */
  currentQuestion: Question | null
  /** Index of the current question (0-based) */
  currentQuestionIndex: number
  /** Total number of questions in the quiz */
  totalQuestions: number
  /** Array of selected answers for all questions */
  selectedAnswers: (number | null)[]
  /** Whether the current question has been answered */
  isAnswered: boolean
  /** Whether the correct answer has been revealed */
  isRevealed: boolean
  /** Current score (number of correct answers) */
  score: number
  /** Time spent on quiz in seconds */
  timeSpent: number | null
  /** Whether the quiz is complete */
  isComplete: boolean
  /** Correct answer index for current question (after shuffling) */
  currentCorrectAnswer: number
  /** Shuffled options for current question */
  currentShuffledOptions: string[]
  
  // =============================================================================
  // ACTION FUNCTIONS
  // =============================================================================
  
  /** Starts a new quiz with the specified category */
  startQuiz: (category: QuizCategory) => void
  /** Selects an answer for the current question */
  selectAnswer: (answerIndex: number) => void
  /** Navigates to the next question */
  goToNext: () => void
  /** Navigates to the previous question */
  goToPrevious: () => void
  /** Finishes the quiz and returns results */
  finishQuiz: () => QuizResult[]
  /** Resets the quiz to initial state */
  resetQuiz: () => void
  
  // =============================================================================
  // NAVIGATION HELPERS
  // =============================================================================
  
  /** Whether user can navigate to next question */
  canGoNext: boolean
  /** Whether user can navigate to previous question */
  canGoPrevious: boolean
  /** Progress percentage (0-1) */
  progress: number
}

/**
 * Custom hook for managing quiz mode functionality
 * 
 * This hook provides a complete quiz experience with question navigation,
 * answer selection, scoring, and result generation. It handles the complex
 * state management required for a smooth quiz experience.
 * 
 * @returns {UseQuizModeReturn} Object containing quiz state and control functions
 * 
 * @example
 * ```tsx
 * const {
 *   currentQuestion,
 *   selectAnswer,
 *   goToNext,
 *   startQuiz,
 *   score,
 *   isComplete
 * } = useQuizMode()
 * 
 * // Start a quiz
 * startQuiz(selectedCategory)
 * 
 * // Select an answer
 * selectAnswer(2)
 * 
 * // Navigate to next question
 * goToNext()
 * ```
 */
export function useQuizMode(): UseQuizModeReturn {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  /** Core quiz state including navigation and answer tracking */
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    isAnswered: false,
    isRevealed: false,
    startTime: null,
    endTime: null
  })
  
  /** Array of questions for the current quiz */
  const [questions, setQuestions] = useState<Question[]>([])
  /** Currently selected quiz category */
  const [category, setCategory] = useState<QuizCategory | null>(null)
  /** Shuffled options for each question (for fair presentation) */
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([])
  /** Correct answer indices after shuffling */
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([])
  
  /** Reference to track quiz start time for performance metrics */
  const startTimeRef = useRef<number | null>(null)

  const startQuiz = useCallback((selectedCategory: QuizCategory) => {
    if (!selectedCategory.questions || selectedCategory.questions.length === 0) {
      throw new Error('No questions available for this category')
    }

    // Select 10 random questions from the chosen category only
    const maxQuestions = Math.min(selectedCategory.questions.length, 10)
    const selectedQuestions = randomSelect(selectedCategory.questions, maxQuestions)
    
    // Questions selected successfully
    
    // Prepare 4 selected options and correct answers for each question
    const optionsData = selectedQuestions.map(question => {
      const options = [...question.options]
      const correctIndex = question.correctAnswer
      
      // Select 4 options (1 correct + 3 random distractors)
      const { selectedOptions, newCorrectIndex } = selectQuizOptions(options, correctIndex)
      
      return { selectedOptions, newCorrectIndex }
    })

    setQuestions(selectedQuestions)
    setCategory(selectedCategory)
    setShuffledOptions(optionsData.map(data => data.selectedOptions))
    setCorrectAnswers(optionsData.map(data => data.newCorrectIndex))
    
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: new Array(selectedQuestions.length).fill(null),
      isAnswered: false,
      isRevealed: false,
      startTime: Date.now(),
      endTime: null
    })
    
    startTimeRef.current = Date.now()
  }, [])

  const selectAnswer = useCallback((answerIndex: number) => {
    if (quizState.isAnswered) return

    setQuizState(prev => ({
      ...prev,
      selectedAnswers: prev.selectedAnswers.map((answer, index) =>
        index === prev.currentQuestionIndex ? answerIndex : answer
      ),
      isAnswered: true,
      isRevealed: true
    }))
  }, [quizState.isAnswered, quizState.currentQuestionIndex])

  const goToNext = useCallback(() => {
    setQuizState(prev => {
      // Check if we can go to next
      if (prev.currentQuestionIndex >= questions.length - 1) return prev

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        isAnswered: prev.selectedAnswers[prev.currentQuestionIndex + 1] !== null,
        isRevealed: prev.selectedAnswers[prev.currentQuestionIndex + 1] !== null
      }
    })
  }, [questions.length])

  const goToPrevious = useCallback(() => {
    setQuizState(prev => {
      // Check if we can go to previous
      if (prev.currentQuestionIndex <= 0) return prev

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        isAnswered: prev.selectedAnswers[prev.currentQuestionIndex - 1] !== null,
        isRevealed: prev.selectedAnswers[prev.currentQuestionIndex - 1] !== null
      }
    })
  }, [])

  const finishQuiz = useCallback((): QuizResult[] => {
    if (!questions.length || !category) {
      throw new Error('No quiz in progress')
    }

    const endTime = Date.now()
    setQuizState(prev => ({ ...prev, endTime }))

    // Calculate results
    const results: QuizResult[] = questions.map((question, index) => {
      const userAnswer = quizState.selectedAnswers[index]
      const correctAnswer = correctAnswers[index]
      const isCorrect = userAnswer === correctAnswer

      return {
        question,
        userAnswer: userAnswer !== null && userAnswer !== undefined ? userAnswer : -1,
        correctAnswer,
        isCorrect,
        shuffledOptions: shuffledOptions[index] || [],
        newCorrectIndex: correctAnswer
      }
    })

    return results
  }, [questions, category, quizState.selectedAnswers, correctAnswers, shuffledOptions])

  const resetQuiz = useCallback(() => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: [],
      isAnswered: false,
      isRevealed: false,
      startTime: null,
      endTime: null
    })
    setQuestions([])
    setCategory(null)
    setShuffledOptions([])
    setCorrectAnswers([])
    startTimeRef.current = null
  }, [])

  // Computed values
  const currentQuestion = questions[quizState.currentQuestionIndex] || null
  const totalQuestions = questions.length
  const isComplete = quizState.currentQuestionIndex >= totalQuestions - 1 && quizState.isAnswered
  
  const canGoNext = quizState.currentQuestionIndex < totalQuestions - 1
  const canGoPrevious = quizState.currentQuestionIndex > 0
  
  const progress = totalQuestions > 0 ? (quizState.currentQuestionIndex + 1) / totalQuestions : 0
  
  const currentCorrectAnswer = correctAnswers[quizState.currentQuestionIndex] || 0
  const currentShuffledOptions = shuffledOptions[quizState.currentQuestionIndex] || []
  
  const score = quizState.selectedAnswers.reduce((acc: number, answer, index) => {
    if (answer !== null && answer === correctAnswers[index]) {
      return acc + 1
    }
    return acc
  }, 0)
  
  const timeSpent = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : null

  return {
    // State
    currentQuestion,
    currentQuestionIndex: quizState.currentQuestionIndex,
    totalQuestions,
    selectedAnswers: quizState.selectedAnswers,
    isAnswered: quizState.isAnswered,
    isRevealed: quizState.isRevealed,
    score,
    timeSpent: timeSpent || 0,
    isComplete,
    currentCorrectAnswer,
    currentShuffledOptions,
    
    // Actions
    startQuiz,
    selectAnswer,
    goToNext,
    goToPrevious,
    finishQuiz,
    resetQuiz,
    
    // Navigation
    canGoNext,
    canGoPrevious,
    progress
  }
}
