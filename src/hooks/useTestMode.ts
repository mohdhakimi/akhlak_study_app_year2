import { useState, useCallback, useRef } from 'react'
import { Question, QuizCategory, QuizResult } from '../types'
import { shuffleArray, randomSelect, selectQuizOptions } from '../utils/shuffleOptions'

export interface TestState {
  currentQuestionIndex: number
  selectedAnswers: (number | null)[]
  isAnswered: boolean
  isRevealed: boolean
  startTime: number | null
  endTime: number | null
}

export interface UseTestModeReturn {
  // State
  currentQuestion: Question | null
  currentQuestionIndex: number
  totalQuestions: number
  selectedAnswers: (number | null)[]
  isAnswered: boolean
  isRevealed: boolean
  score: number
  timeSpent: number | null
  isComplete: boolean
  currentCorrectAnswer: number
  currentShuffledOptions: string[]
  
  // Actions
  startTest: (allCategories: QuizCategory[]) => void
  selectAnswer: (answerIndex: number) => void
  goToNext: () => void
  goToPrevious: () => void
  finishTest: () => QuizResult[]
  resetTest: () => void
  
  // Navigation
  canGoNext: boolean
  canGoPrevious: boolean
  progress: number
}

export function useTestMode(): UseTestModeReturn {
  const [testState, setTestState] = useState<TestState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    isAnswered: false,
    isRevealed: false,
    startTime: null,
    endTime: null
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
    const mixedQuestions = selectedQuestions.map((question) => ({
      ...question,
      type: 'mcq' as const
    }))
    
    // Prepare 4 selected options and correct answers for all MCQ questions
    const optionsData = mixedQuestions.map(question => {
      const options = [...question.options]
      const correctIndex = question.correctAnswer
      
      // Select 4 options (1 correct + 3 random distractors)
      const { selectedOptions, newCorrectIndex } = selectQuizOptions(options, correctIndex)
      
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
      endTime: null
    })
    
    startTimeRef.current = Date.now()
  }, [])

  const selectAnswer = useCallback((answerIndex: number) => {
    if (testState.isAnswered) return

    setTestState(prev => ({
      ...prev,
      selectedAnswers: prev.selectedAnswers.map((answer, index) =>
        index === prev.currentQuestionIndex ? answerIndex : answer
      ),
      isAnswered: true,
      isRevealed: true
    }))
  }, [testState.isAnswered, testState.currentQuestionIndex])


  const goToNext = useCallback(() => {
    setTestState(prev => {
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
    setTestState(prev => {
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
      const processedUserAnswer = userAnswer !== null && userAnswer !== undefined ? userAnswer : -1

      return {
        question,
        userAnswer: processedUserAnswer,
        correctAnswer,
        isCorrect,
        shuffledOptions: shuffledOptions[index] || [],
        newCorrectIndex: correctAnswer
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
      endTime: null
    })
    setQuestions([])
    setShuffledOptions([])
    setCorrectAnswers([])
    startTimeRef.current = null
  }, [])

  // Computed values
  const currentQuestion = questions[testState.currentQuestionIndex] || null
  const totalQuestions = questions.length
  const isComplete = testState.currentQuestionIndex >= totalQuestions - 1 && testState.isAnswered
  
  const canGoNext = testState.currentQuestionIndex < totalQuestions - 1
  const canGoPrevious = testState.currentQuestionIndex > 0
  
  const progress = totalQuestions > 0 ? (testState.currentQuestionIndex + 1) / totalQuestions : 0
  
  const currentCorrectAnswer = correctAnswers[testState.currentQuestionIndex] || 0
  const currentShuffledOptions = shuffledOptions[testState.currentQuestionIndex] || []
  
  const score = testState.selectedAnswers.reduce((acc: number, answer, index) => {
    // All questions are MCQ, so compare indices
    if (answer !== null && answer === correctAnswers[index]) {
      return acc + 1
    }
    return acc
  }, 0)
  
  const timeSpent = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : null

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
    progress
  }
}
