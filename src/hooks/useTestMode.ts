import { useState, useCallback, useRef } from 'react'
import { Question, QuizCategory, QuizResult } from '../types'
import { shuffleArray, randomSelect } from '../utils/shuffleOptions'

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
    
    // Prepare shuffled options and correct answers for each question
    const optionsData = selectedQuestions.map(question => {
      const options = [...question.options]
      const correctIndex = question.correctAnswer
      
      // Shuffle options while tracking correct answer position
      const shuffled = shuffleArray(options)
      const newCorrectIndex = shuffled.findIndex(option => option === question.options[correctIndex])
      
      return { shuffled, newCorrectIndex }
    })

    setQuestions(selectedQuestions)
    setShuffledOptions(optionsData.map(data => data.shuffled))
    setCorrectAnswers(optionsData.map(data => data.newCorrectIndex))
    
    setTestState({
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
    if (!testState.canGoNext) return

    setTestState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      isAnswered: prev.selectedAnswers[prev.currentQuestionIndex + 1] !== null,
      isRevealed: prev.selectedAnswers[prev.currentQuestionIndex + 1] !== null
    }))
  }, [testState.canGoNext])

  const goToPrevious = useCallback(() => {
    if (!testState.canGoPrevious) return

    setTestState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex - 1,
      isAnswered: prev.selectedAnswers[prev.currentQuestionIndex - 1] !== null,
      isRevealed: prev.selectedAnswers[prev.currentQuestionIndex - 1] !== null
    }))
  }, [testState.canGoPrevious])

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
      const isCorrect = userAnswer === correctAnswer

      return {
        question,
        userAnswer: userAnswer || -1,
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
  
  const score = testState.selectedAnswers.reduce((acc, answer, index) => {
    if (answer === correctAnswers[index]) {
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
    timeSpent,
    isComplete,
    
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
