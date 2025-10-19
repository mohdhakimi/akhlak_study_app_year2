import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TopicSelector from '../TopicSelector'
import { StudyTopic } from '../../types'

// Mock data
const mockTopics: StudyTopic[] = [
  {
    id: 'topic-1',
    name: 'Akhlak Terpuji',
    description: 'Mengenali dan mempraktikkan akhlak yang terpuji',
    notes: [
      { id: 'note-1', title: 'Note 1', content: 'Content 1', order: 1 },
      { id: 'note-2', title: 'Note 2', content: 'Content 2', order: 2 },
    ],
  },
  {
    id: 'topic-2',
    name: 'Akhlak Terhadap Ibu Bapa',
    description: 'Cara menghormati dan berbuat baik kepada ibu bapa',
    notes: [{ id: 'note-3', title: 'Note 3', content: 'Content 3', order: 1 }],
  },
]

const defaultProps = {
  topics: mockTopics,
  onTopicSelect: vi.fn(),
  onBack: vi.fn(),
  loading: false,
}

describe('TopicSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders topic selector with all topics', () => {
    render(<TopicSelector {...defaultProps} />)

    expect(screen.getByText('Pilih Topik')).toBeInTheDocument()
    expect(
      screen.getByText('Pilih topik yang ingin anda pelajari')
    ).toBeInTheDocument()
    expect(screen.getByText('Akhlak Terpuji')).toBeInTheDocument()
    expect(screen.getByText('Akhlak Terhadap Ibu Bapa')).toBeInTheDocument()
  })

  it('displays topic descriptions and note counts', () => {
    render(<TopicSelector {...defaultProps} />)

    expect(
      screen.getByText('Mengenali dan mempraktikkan akhlak yang terpuji')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Cara menghormati dan berbuat baik kepada ibu bapa')
    ).toBeInTheDocument()
    expect(screen.getByText('2 nota')).toBeInTheDocument()
    expect(screen.getByText('1 nota')).toBeInTheDocument()
  })

  it('calls onTopicSelect when topic is clicked', async () => {
    const user = userEvent.setup()
    render(<TopicSelector {...defaultProps} />)

    const topicCard = screen.getByText('Akhlak Terpuji').closest('div')
    await user.click(topicCard!)

    expect(defaultProps.onTopicSelect).toHaveBeenCalledWith(mockTopics[0])
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<TopicSelector {...defaultProps} />)

    const backButton = screen.getByText('Kembali ke Menu')
    await user.click(backButton)

    expect(defaultProps.onBack).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<TopicSelector {...defaultProps} loading={true} />)

    expect(screen.getByText('Memuatkan...')).toBeInTheDocument()
    expect(screen.queryByText('Pilih Topik')).not.toBeInTheDocument()
  })

  it('shows empty state when no topics', () => {
    render(<TopicSelector {...defaultProps} topics={[]} />)

    expect(screen.getByText('Tiada Topik Tersedia')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Maaf, tiada topik pembelajaran yang tersedia pada masa ini.'
      )
    ).toBeInTheDocument()
  })

  it('has responsive grid layout', () => {
    render(<TopicSelector {...defaultProps} />)

    const gridContainer = screen
      .getByText('Akhlak Terpuji')
      .closest('div')?.parentElement
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2')
  })

  it('displays topic icons and hover effects', () => {
    render(<TopicSelector {...defaultProps} />)

    expect(screen.getAllByText('📖')).toHaveLength(2)
    expect(screen.getAllByText('Klik untuk mula belajar')).toHaveLength(2)
  })
})
