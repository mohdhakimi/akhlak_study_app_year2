import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TestResults from '../TestResults'
import { Question } from '../../types'
import { BilingualProvider } from '../../contexts/BilingualContext'

const mockQuestions: Question[] = [
  {
    id: 'q1',
    question: 'What is the first question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0,
  },
  {
    id: 'q2',
    question: 'What is the second question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 1,
  },
]

const mockResults = [
  {
    question: mockQuestions[0],
    userAnswer: 0,
    correctAnswer: 0,
    isCorrect: true,
    shuffledOptions: ['Option A', 'Option B', 'Option C', 'Option D'],
    newCorrectIndex: 0,
  },
  {
    question: mockQuestions[1],
    userAnswer: 2,
    correctAnswer: 1,
    isCorrect: false,
    shuffledOptions: ['Option A', 'Option B', 'Option C', 'Option D'],
    newCorrectIndex: 1,
  },
]

const defaultProps = {
  results: mockResults,
  score: 1,
  totalQuestions: 2,
  onRetake: vi.fn(),
  onBackToMenu: vi.fn(),
  onViewLeaderboard: vi.fn(),
}

// Wrapper component with BilingualProvider
const TestResultsWrapper = (props: any) => (
  <BilingualProvider>
    <TestResults {...props} />
  </BilingualProvider>
)

describe('TestResults', () => {
  it('renders test results correctly', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent?.includes('Keputusan Ujian') ||
          element?.textContent?.includes('کڤوتوسان اوجيان')
        )
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Ujian Komprehensif - 30 Soalan')
    ).toBeInTheDocument()
  })

  it('displays score and percentage correctly', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    expect(screen.getByText('1/2')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows perfect score message for 100%', () => {
    render(
      <TestResultsWrapper {...defaultProps} score={2} totalQuestions={2} />
    )

    expect(screen.getByText('Sempurna! 🏆')).toBeInTheDocument()
    expect(
      screen.getByText('Anda mendapat markah penuh dalam ujian! Tahniah!')
    ).toBeInTheDocument()
  })

  it('shows excellent message for 90%+', () => {
    render(
      <TestResultsWrapper {...defaultProps} score={18} totalQuestions={20} />
    )

    expect(screen.getByText('Cemerlang! 🌟')).toBeInTheDocument()
    expect(
      screen.getByText('Prestasi yang sangat cemerlang dalam ujian!')
    ).toBeInTheDocument()
  })

  it('shows good message for 80%+', () => {
    render(
      <TestResultsWrapper {...defaultProps} score={16} totalQuestions={20} />
    )

    expect(screen.getByText('Bagus! 👍')).toBeInTheDocument()
    expect(
      screen.getByText('Prestasi yang baik dalam ujian!')
    ).toBeInTheDocument()
  })

  it('shows passing message for 60%+', () => {
    render(
      <TestResultsWrapper {...defaultProps} score={12} totalQuestions={20} />
    )

    expect(screen.getByText('Lulus! ✅')).toBeInTheDocument()
    expect(
      screen.getByText('Anda telah lulus ujian dengan memuaskan!')
    ).toBeInTheDocument()
  })

  it('shows try again message for below 60%', () => {
    render(
      <TestResultsWrapper {...defaultProps} score={8} totalQuestions={20} />
    )

    expect(screen.getByText('Cuba Lagi! 💪')).toBeInTheDocument()
    expect(
      screen.getByText('Jangan berputus asa, teruskan berusaha!')
    ).toBeInTheDocument()
  })

  it('displays grade correctly', () => {
    const { rerender } = render(
      <TestResultsWrapper {...defaultProps} score={28} totalQuestions={30} />
    )
    expect(screen.getByText('A+')).toBeInTheDocument()

    rerender(
      <TestResultsWrapper {...defaultProps} score={24} totalQuestions={30} />
    )
    expect(screen.getByText('A')).toBeInTheDocument()

    rerender(
      <TestResultsWrapper {...defaultProps} score={21} totalQuestions={30} />
    )
    expect(screen.getByText('B+')).toBeInTheDocument()

    rerender(
      <TestResultsWrapper {...defaultProps} score={18} totalQuestions={30} />
    )
    expect(screen.getByText('B')).toBeInTheDocument()

    rerender(
      <TestResultsWrapper {...defaultProps} score={15} totalQuestions={30} />
    )
    expect(screen.getByText('C+')).toBeInTheDocument()

    rerender(
      <TestResultsWrapper {...defaultProps} score={12} totalQuestions={30} />
    )
    expect(screen.getByText('C')).toBeInTheDocument()

    rerender(
      <TestResultsWrapper {...defaultProps} score={9} totalQuestions={30} />
    )
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('displays time spent when provided', () => {
    render(<TestResultsWrapper {...defaultProps} timeSpent={125} />)

    expect(screen.getByText('2:05')).toBeInTheDocument()
  })

  it('calls onRetake when retake button is clicked', () => {
    const mockOnRetake = vi.fn()
    render(<TestResultsWrapper {...defaultProps} onRetake={mockOnRetake} />)

    fireEvent.click(screen.getByText('Ambil Ujian Lagi'))

    expect(mockOnRetake).toHaveBeenCalledTimes(1)
  })

  it('calls onBackToMenu when back to menu button is clicked', () => {
    const mockOnBackToMenu = vi.fn()
    render(
      <TestResultsWrapper {...defaultProps} onBackToMenu={mockOnBackToMenu} />
    )

    fireEvent.click(screen.getByText('Kembali ke Menu'))

    expect(mockOnBackToMenu).toHaveBeenCalledTimes(1)
  })

  it('calls onViewLeaderboard when leaderboard button is clicked', () => {
    const mockOnViewLeaderboard = vi.fn()
    render(
      <TestResultsWrapper
        {...defaultProps}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    )

    fireEvent.click(screen.getByText('Lihat Papan Markah'))

    expect(mockOnViewLeaderboard).toHaveBeenCalledTimes(1)
  })

  it('displays detailed review of all questions', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    expect(screen.getByText('Semakan Terperinci')).toBeInTheDocument()
    expect(screen.getByText('What is the first question?')).toBeInTheDocument()
    expect(screen.getByText('What is the second question?')).toBeInTheDocument()
  })

  it('shows correct/incorrect indicators for each question', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent?.includes('✓') &&
          element?.textContent?.includes('Betul')
        )
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent?.includes('✗') &&
          element?.textContent?.includes('Salah')
        )
      })
    ).toBeInTheDocument()
  })

  it('displays statistics correctly', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    // Check for statistics - use getAllByText for duplicate numbers
    const oneElements = screen.getAllByText('1')
    expect(oneElements.length).toBeGreaterThanOrEqual(2) // At least 2 "1"s (correct and wrong)

    expect(screen.getByText('2')).toBeInTheDocument() // Total
  })

  it('shows question numbers correctly', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    // Check for question numbers - use getAllByText for duplicate numbers
    const oneElements = screen.getAllByText('1')
    expect(oneElements.length).toBeGreaterThanOrEqual(1) // At least 1 "1" (first question)

    expect(screen.getByText('2')).toBeInTheDocument() // Second question
  })

  it('displays answer options with correct letters', () => {
    render(<TestResultsWrapper {...defaultProps} />)

    // Check for answer options - use getAllByText for duplicate letters
    const aElements = screen.getAllByText('A')
    expect(aElements.length).toBeGreaterThanOrEqual(1) // At least 1 "A"

    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <TestResultsWrapper {...defaultProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles empty results gracefully', () => {
    render(<TestResultsWrapper {...defaultProps} results={[]} />)

    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent?.includes('Keputusan Ujian') ||
          element?.textContent?.includes('کڤوتوسان اوجيان')
        )
      })
    ).toBeInTheDocument()
  })
})
