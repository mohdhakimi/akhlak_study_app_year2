import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudyCard from '../StudyCard'
import { StudyNote } from '../../types'

// Mock data
const mockNote: StudyNote = {
  id: 'note-1',
  title: 'Pengenalan Akhlak Terpuji',
  content: 'Akhlak terpuji adalah tingkah laku yang baik dan mulia.\n\n1. Jujur dalam perkataan\n2. Amanah dalam tugas\n\n• Membuatkan kita disukai oleh Allah SWT\n• Menjadi contoh yang baik',
  order: 1
}

const defaultProps = {
  note: mockNote,
  currentIndex: 0,
  totalNotes: 3,
  onNext: vi.fn(),
  onPrevious: vi.fn(),
  onBack: vi.fn(),
  canGoNext: true,
  canGoPrevious: false
}

describe('StudyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders study card with note content', () => {
    render(<StudyCard {...defaultProps} />)
    
    expect(screen.getByText('Pengenalan Akhlak Terpuji')).toBeInTheDocument()
    expect(screen.getByText('Akhlak terpuji adalah tingkah laku yang baik dan mulia.')).toBeInTheDocument()
  })

  it('displays progress indicator', () => {
    render(<StudyCard {...defaultProps} />)
    
    expect(screen.getByText('Kemajuan')).toBeInTheDocument()
    expect(screen.getByText('1 dari 3')).toBeInTheDocument()
  })

  it('formats numbered lists correctly', () => {
    render(<StudyCard {...defaultProps} />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Jujur dalam perkataan')).toBeInTheDocument()
    expect(screen.getByText('Amanah dalam tugas')).toBeInTheDocument()
  })

  it('formats bullet points correctly', () => {
    render(<StudyCard {...defaultProps} />)
    
    expect(screen.getByText('Membuatkan kita disukai oleh Allah SWT')).toBeInTheDocument()
    expect(screen.getByText('Menjadi contoh yang baik')).toBeInTheDocument()
  })

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup()
    render(<StudyCard {...defaultProps} />)
    
    const nextButton = screen.getByText('Seterusnya')
    await user.click(nextButton)
    
    expect(defaultProps.onNext).toHaveBeenCalled()
  })

  it('calls onPrevious when previous button is clicked', async () => {
    const user = userEvent.setup()
    render(<StudyCard {...defaultProps} canGoPrevious={true} />)
    
    const previousButton = screen.getByText('Sebelum')
    await user.click(previousButton)
    
    expect(defaultProps.onPrevious).toHaveBeenCalled()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<StudyCard {...defaultProps} />)
    
    const backButton = screen.getByText('Kembali ke Menu')
    await user.click(backButton)
    
    expect(defaultProps.onBack).toHaveBeenCalled()
  })

  it('disables next button when cannot go next', () => {
    render(<StudyCard {...defaultProps} canGoNext={false} />)
    
    const nextButton = screen.getByText('Seterusnya')
    expect(nextButton).toBeDisabled()
  })

  it('disables previous button when cannot go previous', () => {
    render(<StudyCard {...defaultProps} canGoPrevious={false} />)
    
    const previousButton = screen.getByText('Sebelum')
    expect(previousButton).toBeDisabled()
  })

  it('shows completion message when cannot go next', () => {
    render(<StudyCard {...defaultProps} canGoNext={false} />)
    
    expect(screen.getByText('Topik Selesai')).toBeInTheDocument()
    expect(screen.getByText('Syabas! Anda telah selesai mempelajari topik ini.')).toBeInTheDocument()
  })

  it('displays note icon and title styling', () => {
    render(<StudyCard {...defaultProps} />)
    
    expect(screen.getByText('📖')).toBeInTheDocument()
    expect(screen.getByText('Pengenalan Akhlak Terpuji')).toBeInTheDocument()
  })

  it('has responsive button layout', () => {
    render(<StudyCard {...defaultProps} />)
    
    const buttonContainer = screen.getByText('Sebelum').closest('div')?.parentElement
    expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row')
  })
})
