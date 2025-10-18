import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AnswerOption from '../AnswerOption'

describe('AnswerOption', () => {
  const defaultProps = {
    option: 'Test option',
    index: 0,
    isSelected: false,
    isCorrect: false,
    isIncorrect: false,
    isRevealed: false,
    onClick: vi.fn()
  }

  it('renders option text correctly', () => {
    render(<AnswerOption {...defaultProps} option="This is a test option" />)
    
    expect(screen.getByText('This is a test option')).toBeInTheDocument()
  })

  it('displays correct option letter (A, B, C, D)', () => {
    const { rerender } = render(<AnswerOption {...defaultProps} index={0} />)
    expect(screen.getByText('A')).toBeInTheDocument()

    rerender(<AnswerOption {...defaultProps} index={1} />)
    expect(screen.getByText('B')).toBeInTheDocument()

    rerender(<AnswerOption {...defaultProps} index={2} />)
    expect(screen.getByText('C')).toBeInTheDocument()

    rerender(<AnswerOption {...defaultProps} index={3} />)
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('calls onClick when clicked and not disabled', () => {
    const mockOnClick = vi.fn()
    render(<AnswerOption {...defaultProps} onClick={mockOnClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn()
    render(<AnswerOption {...defaultProps} onClick={mockOnClick} disabled={true} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('shows correct icon for unselected option', () => {
    render(<AnswerOption {...defaultProps} isSelected={false} />)
    
    expect(screen.getByText('○')).toBeInTheDocument()
  })

  it('shows correct icon for selected option', () => {
    render(<AnswerOption {...defaultProps} isSelected={true} />)
    
    expect(screen.getByText('●')).toBeInTheDocument()
  })

  it('shows correct icon for correct answer when revealed', () => {
    render(<AnswerOption {...defaultProps} isCorrect={true} isRevealed={true} />)
    
    expect(screen.getByText('✅')).toBeInTheDocument()
  })

  it('shows correct icon for incorrect answer when revealed', () => {
    render(<AnswerOption {...defaultProps} isIncorrect={true} isRevealed={true} />)
    
    expect(screen.getByText('❌')).toBeInTheDocument()
  })

  it('applies correct styles for selected state', () => {
    render(<AnswerOption {...defaultProps} isSelected={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-100', 'border-blue-500', 'text-blue-800')
  })

  it('applies correct styles for correct answer when revealed', () => {
    render(<AnswerOption {...defaultProps} isCorrect={true} isRevealed={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-green-100', 'border-green-500', 'text-green-800')
  })

  it('applies correct styles for incorrect answer when revealed', () => {
    render(<AnswerOption {...defaultProps} isIncorrect={true} isRevealed={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-100', 'border-red-500', 'text-red-800')
  })

  it('applies disabled styles when disabled', () => {
    render(<AnswerOption {...defaultProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('cursor-not-allowed')
  })

  it('has correct aria attributes', () => {
    render(<AnswerOption {...defaultProps} isSelected={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('aria-label', 'Option A: Test option')
  })

  it('handles long option text correctly', () => {
    const longOption = 'This is a very long option text that should be handled properly and not break the layout'
    render(<AnswerOption {...defaultProps} option={longOption} />)
    
    expect(screen.getByText(longOption)).toBeInTheDocument()
  })
})
