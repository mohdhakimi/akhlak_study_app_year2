import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CategorySelector from '../CategorySelector'
import { QuizCategory } from '../../types'

const mockCategories: QuizCategory[] = [
  {
    id: '1',
    name: 'Akhlak Terpuji',
    description: 'Mengenali dan mempraktikkan akhlak yang terpuji',
    questions: [
      {
        id: 'q1',
        question: 'Test question 1',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: '2',
    name: 'Akhlak Terhadap Ibu Bapa',
    description: 'Cara menghormati dan berbuat baik kepada ibu bapa',
    questions: [
      {
        id: 'q2',
        question: 'Test question 2',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 1
      }
    ]
  }
]

describe('CategorySelector', () => {
  const defaultProps = {
    categories: mockCategories,
    onCategorySelect: vi.fn(),
    onBack: vi.fn()
  }

  it('renders category cards correctly', () => {
    render(<CategorySelector {...defaultProps} />)
    
    expect(screen.getByText('Pilih Kategori Kuiz')).toBeInTheDocument()
    expect(screen.getByText('Akhlak Terpuji')).toBeInTheDocument()
    expect(screen.getByText('Akhlak Terhadap Ibu Bapa')).toBeInTheDocument()
  })

  it('displays category descriptions', () => {
    render(<CategorySelector {...defaultProps} />)
    
    expect(screen.getByText('Mengenali dan mempraktikkan akhlak yang terpuji')).toBeInTheDocument()
    expect(screen.getByText('Cara menghormati dan berbuat baik kepada ibu bapa')).toBeInTheDocument()
  })

  it('shows question count for each category', () => {
    render(<CategorySelector {...defaultProps} />)
    
    expect(screen.getAllByText('1 Soalan')).toHaveLength(2)
  })

  it('calls onCategorySelect when category card is clicked', () => {
    const mockOnCategorySelect = vi.fn()
    render(<CategorySelector {...defaultProps} onCategorySelect={mockOnCategorySelect} />)
    
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    expect(mockOnCategorySelect).toHaveBeenCalledWith(mockCategories[0])
  })

  it('calls onCategorySelect when start button is clicked', () => {
    const mockOnCategorySelect = vi.fn()
    render(<CategorySelector {...defaultProps} onCategorySelect={mockOnCategorySelect} />)
    
    fireEvent.click(screen.getByText('Mula Kuiz'))
    
    expect(mockOnCategorySelect).toHaveBeenCalledWith(mockCategories[0])
  })

  it('calls onBack when back button is clicked', () => {
    const mockOnBack = vi.fn()
    render(<CategorySelector {...defaultProps} onBack={mockOnBack} />)
    
    fireEvent.click(screen.getByText('Kembali ke Menu'))
    
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('shows loading state when loading is true', () => {
    render(<CategorySelector {...defaultProps} loading={true} />)
    
    expect(screen.getByText('Memuatkan kategori kuiz...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
  })

  it('shows empty state when no categories', () => {
    render(<CategorySelector {...defaultProps} categories={[]} />)
    
    expect(screen.getByText('Tiada Kategori Kuiz')).toBeInTheDocument()
    expect(screen.getByText('Tiada kategori kuiz tersedia pada masa ini.')).toBeInTheDocument()
  })

  it('shows instructions section', () => {
    render(<CategorySelector {...defaultProps} />)
    
    expect(screen.getByText('Cara Mengambil Kuiz')).toBeInTheDocument()
    expect(screen.getByText('Pilih jawapan yang paling tepat untuk setiap soalan')).toBeInTheDocument()
  })

  it('handles category with no questions', () => {
    const categoriesWithNoQuestions: QuizCategory[] = [
      {
        id: '1',
        name: 'Empty Category',
        description: 'No questions here',
        questions: []
      }
    ]
    
    render(<CategorySelector {...defaultProps} categories={categoriesWithNoQuestions} />)
    
    expect(screen.getByText('0 Soalan')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CategorySelector {...defaultProps} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('prevents event propagation when start button is clicked', () => {
    const mockOnCategorySelect = vi.fn()
    render(<CategorySelector {...defaultProps} onCategorySelect={mockOnCategorySelect} />)
    
    const categoryCard = screen.getByText('Akhlak Terpuji').closest('[class*="cursor-pointer"]')
    const startButton = screen.getByText('Mula Kuiz')
    
    // Click the start button
    fireEvent.click(startButton)
    
    // Should only call onCategorySelect once, not twice
    expect(mockOnCategorySelect).toHaveBeenCalledTimes(1)
  })
})
