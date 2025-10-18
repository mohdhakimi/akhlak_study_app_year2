import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  it('renders with basic props', () => {
    render(<ProgressBar current={5} total={10} />)
    
    expect(screen.getByText('5 dari 10')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('calculates percentage correctly', () => {
    const { rerender } = render(<ProgressBar current={3} total={10} />)
    expect(screen.getByText('30%')).toBeInTheDocument()

    rerender(<ProgressBar current={7} total={10} />)
    expect(screen.getByText('70%')).toBeInTheDocument()

    rerender(<ProgressBar current={10} total={10} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('handles edge cases', () => {
    const { rerender } = render(<ProgressBar current={0} total={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()

    rerender(<ProgressBar current={15} total={10} />)
    expect(screen.getByText('100%')).toBeInTheDocument()

    rerender(<ProgressBar current={-5} total={10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<ProgressBar current={5} total={10} size="sm" />)
    expect(screen.getByRole('progressbar').parentElement).toHaveClass('h-2')

    rerender(<ProgressBar current={5} total={10} size="md" />)
    expect(screen.getByRole('progressbar').parentElement).toHaveClass('h-3')

    rerender(<ProgressBar current={5} total={10} size="lg" />)
    expect(screen.getByRole('progressbar').parentElement).toHaveClass('h-4')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<ProgressBar current={5} total={10} variant="default" />)
    expect(screen.getByRole('progressbar')).toHaveClass('bg-primary-600')

    rerender(<ProgressBar current={5} total={10} variant="success" />)
    expect(screen.getByRole('progressbar')).toHaveClass('bg-success-600')

    rerender(<ProgressBar current={5} total={10} variant="warning" />)
    expect(screen.getByRole('progressbar')).toHaveClass('bg-warning-600')

    rerender(<ProgressBar current={5} total={10} variant="danger" />)
    expect(screen.getByRole('progressbar')).toHaveClass('bg-danger-600')
  })

  it('hides text when showText is false', () => {
    render(<ProgressBar current={5} total={10} showText={false} />)
    
    expect(screen.queryByText('5 dari 10')).not.toBeInTheDocument()
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<ProgressBar current={5} total={10} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '5')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '10')
    expect(progressBar).toHaveAttribute('aria-label', 'Kemajuan: 5 dari 10 (50%)')
  })

  it('applies custom className', () => {
    render(<ProgressBar current={5} total={10} className="custom-class" />)
    
    expect(screen.getByRole('progressbar').parentElement?.parentElement).toHaveClass('custom-class')
  })
})
