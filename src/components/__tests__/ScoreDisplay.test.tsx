import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreDisplay from '../ScoreDisplay'

describe('ScoreDisplay', () => {
  it('renders with basic props', () => {
    render(<ScoreDisplay score={8} total={10} />)
    
    expect(screen.getByText('8/10 (80%)')).toBeInTheDocument()
    expect(screen.getByText('80% betul')).toBeInTheDocument()
    expect(screen.getByText('Kemajuan yang hebat!')).toBeInTheDocument()
  })

  it('shows different motivational messages based on score', () => {
    const { rerender } = render(<ScoreDisplay score={10} total={10} />)
    expect(screen.getByText('Markah sempurna!')).toBeInTheDocument()

    rerender(<ScoreDisplay score={9} total={10} />)
    expect(screen.getByText('Hebat!')).toBeInTheDocument()

    rerender(<ScoreDisplay score={8} total={10} />)
    expect(screen.getByText('Kemajuan yang hebat!')).toBeInTheDocument()

    rerender(<ScoreDisplay score={7} total={10} />)
    expect(screen.getByText('Bagus!')).toBeInTheDocument()

    rerender(<ScoreDisplay score={6} total={10} />)
    expect(screen.getByText('Hampir sampai!')).toBeInTheDocument()

    rerender(<ScoreDisplay score={5} total={10} />)
    expect(screen.getByText('Peningkatan yang baik!')).toBeInTheDocument()

    rerender(<ScoreDisplay score={3} total={10} />)
    expect(screen.getByText('Teruskan belajar!')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<ScoreDisplay score={8} total={10} size="sm" />)
    expect(screen.getByText('8/10 (80%)')).toHaveClass('text-2xl')

    rerender(<ScoreDisplay score={8} total={10} size="md" />)
    expect(screen.getByText('8/10 (80%)')).toHaveClass('text-3xl')

    rerender(<ScoreDisplay score={8} total={10} size="lg" />)
    expect(screen.getByText('8/10 (80%)')).toHaveClass('text-4xl')
  })

  it('hides percentage when showPercentage is false', () => {
    render(<ScoreDisplay score={8} total={10} showPercentage={false} />)
    
    expect(screen.queryByText('80% betul')).not.toBeInTheDocument()
    expect(screen.getByText('8/10 (80%)')).toBeInTheDocument()
  })

  it('hides motivation when showMotivation is false', () => {
    render(<ScoreDisplay score={8} total={10} showMotivation={false} />)
    
    expect(screen.queryByText('Hebat!')).not.toBeInTheDocument()
    expect(screen.getByText('8/10 (80%)')).toBeInTheDocument()
  })

  it('applies correct color classes based on score', () => {
    const { rerender } = render(<ScoreDisplay score={9} total={10} />)
    expect(screen.getByText('9/10 (90%)').parentElement).toHaveClass('text-success-600', 'bg-success-50')

    rerender(<ScoreDisplay score={8} total={10} />)
    expect(screen.getByText('8/10 (80%)').parentElement).toHaveClass('text-primary-600', 'bg-primary-50')

    rerender(<ScoreDisplay score={7} total={10} />)
    expect(screen.getByText('7/10 (70%)').parentElement).toHaveClass('text-warning-600', 'bg-warning-50')

    rerender(<ScoreDisplay score={5} total={10} />)
    expect(screen.getByText('5/10 (50%)').parentElement).toHaveClass('text-danger-600', 'bg-danger-50')
  })

  it('handles edge cases', () => {
    const { rerender } = render(<ScoreDisplay score={0} total={0} />)
    expect(screen.getByText('0/0 (NaN%)')).toBeInTheDocument()

    rerender(<ScoreDisplay score={15} total={10} />)
    expect(screen.getByText('15/10 (150%)')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ScoreDisplay score={8} total={10} className="custom-class" />)
    
    expect(screen.getByText('8/10 (80%)').parentElement?.parentElement).toHaveClass('custom-class')
  })
})
