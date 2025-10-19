import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../Card'

describe('Card', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>)

    const card = screen.getByText('Card content')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass(
      'rounded-xl',
      'bg-white',
      'shadow-sm',
      'border',
      'border-gray-200',
      'p-6'
    )
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Card variant="default">Default</Card>)
    expect(screen.getByText('Default')).toHaveClass('bg-white', 'shadow-sm')

    rerender(<Card variant="elevated">Elevated</Card>)
    expect(screen.getByText('Elevated')).toHaveClass('bg-white', 'shadow-lg')

    rerender(<Card variant="outlined">Outlined</Card>)
    expect(screen.getByText('Outlined')).toHaveClass(
      'bg-transparent',
      'border-2',
      'border-gray-300'
    )

    rerender(<Card variant="filled">Filled</Card>)
    expect(screen.getByText('Filled')).toHaveClass('bg-gray-50')
  })

  it('renders with different padding sizes', () => {
    const { rerender } = render(<Card padding="none">No padding</Card>)
    expect(screen.getByText('No padding')).toHaveClass('p-0')

    rerender(<Card padding="sm">Small padding</Card>)
    expect(screen.getByText('Small padding')).toHaveClass('p-3')

    rerender(<Card padding="md">Medium padding</Card>)
    expect(screen.getByText('Medium padding')).toHaveClass('p-6')

    rerender(<Card padding="lg">Large padding</Card>)
    expect(screen.getByText('Large padding')).toHaveClass('p-8')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom</Card>)

    expect(screen.getByText('Custom')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Ref test</Card>)

    expect(ref).toHaveBeenCalled()
  })
})
