import { useState, useCallback, useRef } from 'react'
import { Question, QuizCategory, QuizResult } from '../types'
import { shuffleArray, selectQuizOptions, randomSelect } from '../utils/shuffleOptions'

export interface QuizState {
  currentQuestionIndex: number
  selectedAnswers: (number | null)[]
  isAnswered: boolean
  isRevealed: boolean
  startTime: number | null
  endTime: number | null
}

export interface UseQuizModeReturn {
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
  startQuiz: (category: QuizCategory) => void
  selectAnswer: (answerIndex: number) => void
  goToNext: () => void
  goToPrevious: () => void
  finishQuiz: () => QuizResult[]
  resetQuiz: () => void
  
  // Navigation
  canGoNext: boolean
  canGoPrevious: boolean
  progress: number
}

export function useQuizMode(): UseQuizModeReturn {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    isAnswered: false,
    isRevealed: false,
    startTime: null,
    endTime: null
  })
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [category, setCategory] = useState<QuizCategory | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([])
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([])
  
  const startTimeRef = useRef<number | null>(null)

  const startQuiz = useCallback((selectedCategory: QuizCategory) => {
    if (!selectedCategory.questions || selectedCategory.questions.length === 0) {
      throw new Error('No questions available for this category')
    }

    // Select 10 random questions from the category
    const selectedQuestions = randomSelect(selectedCategory.questions, 10)
    
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
