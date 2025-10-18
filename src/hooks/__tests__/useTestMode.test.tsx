import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTestMode } from '../useTestMode'
import { QuizCategory, Question } from '../../types'

// Mock the shuffleArray and randomSelect functions
vi.mock('../../utils/shuffleOptions', () => ({
  shuffleArray: vi.fn((arr) => [...arr]), // Return array as-is for predictable testing
  randomSelect: vi.fn((arr, count) => arr.slice(0, count)) // Return first N items for predictable testing
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

const mockCategories: QuizCategory[] = [
  {
    id: 'cat1',
    name: 'Category 1',
    description: 'First category',
    questions: [mockQuestions[0]]
  },
  {
    id: 'cat2',
    name: 'Category 2',
    description: 'Second category',
    questions: [mockQuestions[1], mockQuestions[2]]
  }
]

describe('useTestMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTestMode())
    
    expect(result.current.currentQuestion).toBeNull()
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.totalQuestions).toBe(0)
    expect(result.current.selectedAnswers).toEqual([])
    expect(result.current.isAnswered).toBe(false)
    expect(result.current.isRevealed).toBe(false)
    expect(result.current.score).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('should start test with all categories', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
    })
    
    expect(result.current.currentQuestion).toEqual(mockQuestions[0])
    expect(result.current.totalQuestions).toBe(3) // All questions from all categories
    expect(result.current.selectedAnswers).toEqual([null, null, null])
    expect(result.current.currentQuestionIndex).toBe(0)
  })

  it('should select answer correctly', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
    })
    
    act(() => {
      result.current.selectAnswer(1)
    })
    
    expect(result.current.selectedAnswers[0]).toBe(1)
    expect(result.current.isAnswered).toBe(true)
    expect(result.current.isRevealed).toBe(true)
  })

  it('should not select answer if already answered', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
      result.current.selectAnswer(1)
    })
    
    const initialAnswers = [...result.current.selectedAnswers]
    
    act(() => {
      result.current.selectAnswer(2)
    })
    
    expect(result.current.selectedAnswers).toEqual(initialAnswers)
  })

  it('should navigate to next question', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
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
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
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
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
    })
    
    expect(result.current.canGoPrevious).toBe(false)
    
    act(() => {
      result.current.goToPrevious()
    })
    
    expect(result.current.currentQuestionIndex).toBe(0)
  })

  it('should calculate score correctly', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
      result.current.selectAnswer(0) // Correct for first question
      result.current.goToNext()
      result.current.selectAnswer(1) // Correct for second question
      result.current.goToNext()
      result.current.selectAnswer(3) // Wrong for third question
    })
    
    expect(result.current.score).toBe(2)
  })

  it('should detect test completion', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
      result.current.selectAnswer(0)
      result.current.goToNext()
      result.current.selectAnswer(1)
      result.current.goToNext()
      result.current.selectAnswer(2)
    })
    
    expect(result.current.isComplete).toBe(true)
  })

  it('should finish test and return results', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
      result.current.selectAnswer(0)
      result.current.goToNext()
      result.current.selectAnswer(1)
      result.current.goToNext()
      result.current.selectAnswer(2)
    })
    
    const results = act(() => result.current.finishTest())
    
    expect(results).toHaveLength(3)
    expect(results[0].question).toEqual(mockQuestions[0])
    expect(results[0].userAnswer).toBe(0)
    expect(results[0].isCorrect).toBe(true)
  })

  it('should reset test state', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
      result.current.selectAnswer(0)
    })
    
    act(() => {
      result.current.resetTest()
    })
    
    expect(result.current.currentQuestion).toBeNull()
    expect(result.current.totalQuestions).toBe(0)
    expect(result.current.selectedAnswers).toEqual([])
    expect(result.current.isAnswered).toBe(false)
  })

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
    })
    
    expect(result.current.progress).toBe(1/3)
    
    act(() => {
      result.current.selectAnswer(0)
      result.current.goToNext()
    })
    
    expect(result.current.progress).toBe(2/3)
  })

  it('should handle empty categories', () => {
    const { result } = renderHook(() => useTestMode())
    const emptyCategories: QuizCategory[] = []
    
    expect(() => {
      act(() => {
        result.current.startTest(emptyCategories)
      })
    }).toThrow('No questions available for test')
  })

  it('should handle categories with no questions', () => {
    const { result } = renderHook(() => useTestMode())
    const categoriesWithNoQuestions: QuizCategory[] = [
      {
        id: 'empty',
        name: 'Empty',
        description: 'No questions',
        questions: []
      }
    ]
    
    expect(() => {
      act(() => {
        result.current.startTest(categoriesWithNoQuestions)
      })
    }).toThrow('No questions available for test')
  })

  it('should track time spent', () => {
    const { result } = renderHook(() => useTestMode())
    
    act(() => {
      result.current.startTest(mockCategories)
    })
    
    // Mock Date.now to return specific times
    const startTime = 1000000
    const endTime = 1005000 // 5 seconds later
    
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(startTime)
      .mockReturnValueOnce(endTime)
    
    act(() => {
      result.current.startTest(mockCategories)
    })
    
    // Wait a bit to simulate time passing
    act(() => {
      // Simulate time passing
      vi.advanceTimersByTime(5000)
    })
    
    expect(result.current.timeSpent).toBeGreaterThan(0)
  })

  it('should limit questions to 30 maximum', () => {
    const { result } = renderHook(() => useTestMode())
    
    // Create categories with more than 30 questions total
    const manyQuestions: Question[] = Array.from({ length: 50 }, (_, i) => ({
      id: `q${i}`,
      question: `Question ${i}`,
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0
    }))
    
    const manyCategories: QuizCategory[] = [
      {
        id: 'many',
        name: 'Many Questions',
        description: 'Lots of questions',
        questions: manyQuestions
      }
    ]
    
    act(() => {
      result.current.startTest(manyCategories)
    })
    
    // Should be limited to 30 questions
    expect(result.current.totalQuestions).toBe(30)
  })
})
