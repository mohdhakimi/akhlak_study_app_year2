/**
 * =============================================================================
 * TEST MODE CUSTOM HOOK
 * =============================================================================
 * This hook manages the comprehensive test experience with 30 questions selected
 * randomly from all categories. It provides complete test functionality including
 * question navigation, answer selection, scoring, and result generation.
 *
 * Features:
 * - 30-question comprehensive test across all topics
 * - Random question selection with no duplicates
 * - Question navigation (next/previous)
 * - Answer selection and validation
 * - Real-time scoring calculation
 * - Option shuffling for fair presentation
 * - Progress tracking and completion detection
 * - Time tracking for performance metrics
 */

import { useState, useCallback, useRef } from 'react'
import { Question, QuizCategory, QuizResult } from '../types'
import {
  shuffleArray,
  randomSelect,
  selectQuizOptions,
} from '../utils/shuffleOptions'

/**
 * Internal state structure for test management
 * @interface TestState
 */
export interface TestState {
  currentQuestionIndex: number    // Current question index (0-based)
  selectedAnswers: (number | null)[]  // Array of selected answers for each question
  isAnswered: boolean             // Whether the current question has been answered
  isRevealed: boolean             // Whether the correct answer has been revealed
  startTime: number | null        // Timestamp when test started
  endTime: number | null          // Timestamp when test ended
}

/**
 * Return type for the useTestMode hook
 * Provides all necessary state and functions for test management
 * @interface UseTestModeReturn
 */
export interface UseTestModeReturn {
  // State
  currentQuestion: Question | null        // Current question being displayed
  currentQuestionIndex: number           // Index of current question (0-based)
  totalQuestions: number                 // Total number of questions in test (30)
  selectedAnswers: (number | null)[]     // Array of user's selected answers
  isAnswered: boolean                    // Whether current question is answered
  isRevealed: boolean                    // Whether correct answer is revealed
  score: number                          // Current score (correct answers)
  timeSpent: number | null               // Time spent on test in milliseconds
  isComplete: boolean                    // Whether test is completed
  currentCorrectAnswer: number           // Index of correct answer for current question
  currentShuffledOptions: string[]       // Shuffled answer options for current question

  // Actions
  startTest: (allCategories: QuizCategory[]) => void  // Initialize test with random questions
  selectAnswer: (answerIndex: number) => void         // Select an answer for current question
  goToNext: () => void                               // Navigate to next question
  goToPrevious: () => void                           // Navigate to previous question
  finishTest: () => QuizResult[]                     // Complete test and return results
  resetTest: () => void                              // Reset test to initial state

  // Navigation
  canGoNext: boolean                    // Whether user can navigate to next question
  canGoPrevious: boolean               // Whether user can navigate to previous question
  progress: number                     // Progress percentage (0-100)
}

export function useTestMode(): UseTestModeReturn {
  const [testState, setTestState] = useState<TestState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    isAnswered: false,
    isRevealed: false,
    startTime: null,
    endTime: null,
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([])
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([])

  const startTimeRef = useRef<number | null>(null)

  const startTest = useCallback((allCategories: QuizCategory[]) => {
    // Collect all questions from all categories
    const allQuestions: Question[] = []
    allCategories.forEach(category => {
      if (category.questions && category.questions.length > 0) {
        allQuestions.push(...category.questions)
      }
    })

    if (allQuestions.length === 0) {
      throw new Error('No questions available for test')
    }

    // Select 30 random questions without duplicates
    const selectedQuestions = randomSelect(allQuestions, 30)

    // Questions selected successfully

    // All questions are MCQ
    const mixedQuestions = selectedQuestions.map(question => ({
      ...question,
      type: 'mcq' as const,
    }))

    // Prepare 4 selected options and correct answers for all MCQ questions
    const optionsData = mixedQuestions.map(question => {
      const options = [...question.options]
      const correctIndex = question.correctAnswer

      // Select 4 options (1 correct + 3 random distractors)
      const { selectedOptions, newCorrectIndex } = selectQuizOptions(
        options,
        correctIndex
      )

      return { selectedOptions, newCorrectIndex }
    })

    setQuestions(mixedQuestions)
    setShuffledOptions(optionsData.map(data => data.selectedOptions))
    setCorrectAnswers(optionsData.map(data => data.newCorrectIndex))

    setTestState({
      currentQuestionIndex: 0,
      selectedAnswers: new Array(mixedQuestions.length).fill(null),
      isAnswered: false,
      isRevealed: false,
      startTime: Date.now(),
      endTime: null,
    })

    startTimeRef.current = Date.now()
  }, [])

  const selectAnswer = useCallback(
    (answerIndex: number) => {
      if (testState.isAnswered) return

      setTestState(prev => ({
        ...prev,
        selectedAnswers: prev.selectedAnswers.map((answer, index) =>
          index === prev.currentQuestionIndex ? answerIndex : answer
        ),
        isAnswered: true,
        isRevealed: true,
      }))
    },
    [testState.isAnswered, testState.currentQuestionIndex]
  )

  const goToNext = useCallback(() => {
    setTestState(prev => {
      // Check if we can go to next
      if (prev.currentQuestionIndex >= questions.length - 1) return prev

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        isAnswered:
          prev.selectedAnswers[prev.currentQuestionIndex + 1] !== null,
        isRevealed:
          prev.selectedAnswers[prev.currentQuestionIndex + 1] !== null,
      }
    })
  }, [questions.length])

  const goToPrevious = useCallback(() => {
    setTestState(prev => {
      // Check if we can go to previous
      if (prev.currentQuestionIndex <= 0) return prev

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        isAnswered:
          prev.selectedAnswers[prev.currentQuestionIndex - 1] !== null,
        isRevealed:
          prev.selectedAnswers[prev.currentQuestionIndex - 1] !== null,
      }
    })
  }, [])

  const finishTest = useCallback((): QuizResult[] => {
    if (!questions.length) {
      throw new Error('No test in progress')
    }

    const endTime = Date.now()
    setTestState(prev => ({ ...prev, endTime }))

    // Calculate results
    const results: QuizResult[] = questions.map((question, index) => {
      const userAnswer = testState.selectedAnswers[index]
      const correctAnswer = correctAnswers[index]

      // All questions are MCQ, so compare indices
      const isCorrect = userAnswer === correctAnswer
      const processedUserAnswer =
        userAnswer !== null && userAnswer !== undefined ? userAnswer : -1

      return {
        question,
        userAnswer: processedUserAnswer,
        correctAnswer,
        isCorrect,
        shuffledOptions: shuffledOptions[index] || [],
        newCorrectIndex: correctAnswer,
      }
    })

    return results
  }, [questions, testState.selectedAnswers, correctAnswers, shuffledOptions])

  const resetTest = useCallback(() => {
    setTestState({
      currentQuestionIndex: 0,
      selectedAnswers: [],
      isAnswered: false,
      isRevealed: false,
      startTime: null,
      endTime: null,
    })
    setQuestions([])
    setShuffledOptions([])
    setCorrectAnswers([])
    startTimeRef.current = null
  }, [])

  // Computed values
  const currentQuestion = questions[testState.currentQuestionIndex] || null
  const totalQuestions = questions.length
  const isComplete =
    testState.currentQuestionIndex >= totalQuestions - 1 && testState.isAnswered

  const canGoNext = testState.currentQuestionIndex < totalQuestions - 1
  const canGoPrevious = testState.currentQuestionIndex > 0

  const progress =
    totalQuestions > 0
      ? (testState.currentQuestionIndex + 1) / totalQuestions
      : 0

  const currentCorrectAnswer =
    correctAnswers[testState.currentQuestionIndex] || 0
  const currentShuffledOptions =
    shuffledOptions[testState.currentQuestionIndex] || []

  const score = testState.selectedAnswers.reduce(
    (acc: number, answer, index) => {
      // All questions are MCQ, so compare indices
      if (answer !== null && answer === correctAnswers[index]) {
        return acc + 1
      }
      return acc
    },
    0
  )

  const timeSpent = startTimeRef.current
    ? Math.floor((Date.now() - startTimeRef.current) / 1000)
    : null

  return {
    // State
    currentQuestion,
    currentQuestionIndex: testState.currentQuestionIndex,
    totalQuestions,
    selectedAnswers: testState.selectedAnswers,
    isAnswered: testState.isAnswered,
    isRevealed: testState.isRevealed,
    score,
    timeSpent: timeSpent || 0,
    isComplete,
    currentCorrectAnswer,
    currentShuffledOptions,

    // Actions
    startTest,
    selectAnswer,
    goToNext,
    goToPrevious,
    finishTest,
    resetTest,

    // Navigation
    canGoNext,
    canGoPrevious,
    progress,
  }
}
