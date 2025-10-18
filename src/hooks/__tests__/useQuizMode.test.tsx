import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuizMode } from '../useQuizMode'
import { QuizCategory, Question } from '../../types'

// Mock the shuffleArray function
vi.mock('../../utils/shuffleOptions', () => ({
  shuffleArray: vi.fn((arr) => [...arr]) // Return array as-is for predictable testing
}))

const mockQuestions: Question[] = [
  {
    id: 'q1',
    question: 'What is the first question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0
  },
  {
    id: 'q2',
    question: 'What is the second question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 1
  },
  {
    id: 'q3',
    question: 'What is the third question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 2
  }
]

const mockCategory: QuizCategory = {
  id: 'test-category',
  name: 'Test Category',
  description: 'A test category',
  questions: mockQuestions
}

describe('useQuizMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuizMode())
    
    expect(result.current.currentQuestion).toBeNull()
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.totalQuestions).toBe(0)
    expect(result.current.selectedAnswers).toEqual([])
    expect(result.current.isAnswered).toBe(false)
    expect(result.current.isRevealed).toBe(false)
    expect(result.current.score).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('should start quiz with category', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
    })
    
    expect(result.current.currentQuestion).toEqual(mockQuestions[0])
    expect(result.current.totalQuestions).toBe(3)
    expect(result.current.selectedAnswers).toEqual([null, null, null])
    expect(result.current.currentQuestionIndex).toBe(0)
  })

  it('should select answer correctly', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
    })
    
    act(() => {
      result.current.selectAnswer(1)
    })
    
    expect(result.current.selectedAnswers[0]).toBe(1)
    expect(result.current.isAnswered).toBe(true)
    expect(result.current.isRevealed).toBe(true)
  })

  it('should not select answer if already answered', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(1)
    })
    
    const initialAnswers = [...result.current.selectedAnswers]
    
    act(() => {
      result.current.selectAnswer(2)
    })
    
    expect(result.current.selectedAnswers).toEqual(initialAnswers)
  })

  it('should navigate to next question', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(1)
    })
    
    expect(result.current.canGoNext).toBe(true)
    
    act(() => {
      result.current.goToNext()
    })
    
    expect(result.current.currentQuestionIndex).toBe(1)
    expect(result.current.currentQuestion).toEqual(mockQuestions[1])
  })

  it('should navigate to previous question', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(1)
      result.current.goToNext()
    })
    
    expect(result.current.canGoPrevious).toBe(true)
    
    act(() => {
      result.current.goToPrevious()
    })
    
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.currentQuestion).toEqual(mockQuestions[0])
  })

  it('should not navigate beyond boundaries', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
    })
    
    expect(result.current.canGoPrevious).toBe(false)
    
    act(() => {
      result.current.goToPrevious()
    })
    
    expect(result.current.currentQuestionIndex).toBe(0)
  })

  it('should calculate score correctly', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(0) // Correct for first question
      result.current.goToNext()
      result.current.selectAnswer(1) // Correct for second question
      result.current.goToNext()
      result.current.selectAnswer(3) // Wrong for third question
    })
    
    expect(result.current.score).toBe(2)
  })

  it('should detect quiz completion', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(0)
      result.current.goToNext()
      result.current.selectAnswer(1)
      result.current.goToNext()
      result.current.selectAnswer(2)
    })
    
    expect(result.current.isComplete).toBe(true)
  })

  it('should finish quiz and return results', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(0)
      result.current.goToNext()
      result.current.selectAnswer(1)
      result.current.goToNext()
      result.current.selectAnswer(2)
    })
    
    const results = act(() => result.current.finishQuiz())
    
    expect(results).toHaveLength(3)
    expect(results[0].question).toEqual(mockQuestions[0])
    expect(results[0].userAnswer).toBe(0)
    expect(results[0].isCorrect).toBe(true)
  })

  it('should reset quiz state', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
      result.current.selectAnswer(0)
    })
    
    act(() => {
      result.current.resetQuiz()
    })
    
    expect(result.current.currentQuestion).toBeNull()
    expect(result.current.totalQuestions).toBe(0)
    expect(result.current.selectedAnswers).toEqual([])
    expect(result.current.isAnswered).toBe(false)
  })

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
    })
    
    expect(result.current.progress).toBe(1/3)
    
    act(() => {
      result.current.selectAnswer(0)
      result.current.goToNext()
    })
    
    expect(result.current.progress).toBe(2/3)
  })

  it('should handle empty category', () => {
    const { result } = renderHook(() => useQuizMode())
    const emptyCategory: QuizCategory = {
      id: 'empty',
      name: 'Empty',
      description: 'No questions',
      questions: []
    }
    
    expect(() => {
      act(() => {
        result.current.startQuiz(emptyCategory)
      })
    }).toThrow('No questions available for this category')
  })

  it('should track time spent', () => {
    const { result } = renderHook(() => useQuizMode())
    
    act(() => {
      result.current.startQuiz(mockCategory)
    })
    
    // Mock Date.now to return specific times
    const startTime = 1000000
    const endTime = 1005000 // 5 seconds later
    
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(startTime)
      .mockReturnValueOnce(endTime)
    
    act(() => {
      result.current.startQuiz(mockCategory)
    })
    
    // Wait a bit to simulate time passing
    act(() => {
      // Simulate time passing
      vi.advanceTimersByTime(5000)
    })
    
    expect(result.current.timeSpent).toBeGreaterThan(0)
  })
})
