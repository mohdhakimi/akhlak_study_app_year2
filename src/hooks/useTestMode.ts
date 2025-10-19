import { useState, useCallback, useRef } from 'react'
import { Question, QuizCategory, QuizResult } from '../types'
import { shuffleArray, randomSelect, selectQuizOptions } from '../utils/shuffleOptions'

export interface TestState {
  currentQuestionIndex: number
  selectedAnswers: (number | null | string)[]
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
  selectedAnswers: (number | null | string)[]
  isAnswered: boolean
  isRevealed: boolean
  score: number
  timeSpent: number | null
  isComplete: boolean
  
  // Actions
  startTest: (allCategories: QuizCategory[]) => void
  selectAnswer: (answerIndex: number) => void
  changeAnswer: (answer: string) => void
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
    
    // Create mixed question types: 70% MCQ, 15% True/False, 15% Fill in the blank
    const mixedQuestions = selectedQuestions.map((question, index) => {
      const questionType = index < 21 ? 'mcq' : index < 25 ? 'true_false' : 'fill_blank'
      
      if (questionType === 'true_false') {
        // Convert MCQ to True/False by taking first two options
        return {
          ...question,
          type: 'true_false' as const,
          options: question.options.slice(0, 2),
          correctAnswer: question.correctAnswer < 2 ? question.correctAnswer : 0
        }
      } else if (questionType === 'fill_blank') {
        // Convert MCQ to Fill in the blank
        return {
          ...question,
          type: 'fill_blank' as const,
          options: [],
          correctText: question.options[question.correctAnswer],
          correctAnswer: 0
        }
      } else {
        // Keep as MCQ
        return {
          ...question,
          type: 'mcq' as const
        }
      }
    })
    
    // Prepare 4 selected options and correct answers for MCQ questions only
    const optionsData = mixedQuestions.map(question => {
      if (question.type === 'mcq') {
        const options = [...question.options]
        const correctIndex = question.correctAnswer
        
        // Select 4 options (1 correct + 3 random distractors)
        const { selectedOptions, newCorrectIndex } = selectQuizOptions(options, correctIndex)
        
        return { selectedOptions, newCorrectIndex }
      } else {
        // For non-MCQ questions, return empty options and correct answer
        return { selectedOptions: [], newCorrectIndex: question.correctAnswer }
      }
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

  const changeAnswer = useCallback((answer: string) => {
    if (testState.isAnswered) return

    setTestState(prev => ({
      ...prev,
      selectedAnswers: prev.selectedAnswers.map((selectedAnswer, index) =>
        index === prev.currentQuestionIndex ? answer : selectedAnswer
      ),
      isAnswered: answer.trim() !== '',
      isRevealed: answer.trim() !== ''
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
      
      let isCorrect = false
      let processedUserAnswer = userAnswer !== null && userAnswer !== undefined ? userAnswer : -1
      
      if (question.type === 'fill_blank') {
        // For fill in the blank, compare text answers
        isCorrect = typeof userAnswer === 'string' && 
                   userAnswer.toLowerCase().trim() === (question.correctText || '').toLowerCase().trim()
        processedUserAnswer = 0 // For compatibility with QuizResult interface
      } else {
        // For MCQ and True/False, compare indices
        isCorrect = userAnswer === correctAnswer
      }

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
  
  const score = testState.selectedAnswers.reduce((acc: number, answer, index) => {
    const question = questions[index]
    if (!question) return acc
    
    if (question.type === 'fill_blank') {
      // For fill in the blank, compare text answers
      if (typeof answer === 'string' && answer.toLowerCase().trim() === (question.correctText || '').toLowerCase().trim()) {
        return acc + 1
      }
    } else {
      // For MCQ and True/False, compare indices
      if (answer !== null && answer === correctAnswers[index]) {
        return acc + 1
      }
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
    
    // Actions
    startTest,
    selectAnswer,
    changeAnswer,
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
