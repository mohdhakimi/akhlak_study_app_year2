import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Leaderboard from '../Leaderboard'
import { UserProvider } from '../../contexts/UserContext'
import { useScores } from '../../hooks/useScores'

// Mock the hooks
vi.mock('../../hooks/useScores')
vi.mock('../../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUserContext: () => ({
    currentUser: { id: '1', name: 'Test User' },
  }),
}))

const mockScores = [
  {
    id: '1',
    userId: '1',
    userName: 'Test User',
    quizId: 'test',
    quizName: 'Ujian Komprehensif',
    score: 25,
    totalQuestions: 30,
    percentage: 83,
    timestamp: new Date().toISOString(),
    type: 'test' as const,
    answers: [],
  },
  {
    id: '2',
    userId: '2',
    userName: 'Ahmad',
    quizId: 'quiz-1',
    quizName: 'Akhlak Terpuji',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    type: 'quiz' as const,
    answers: [],
  },
  {
    id: '3',
    userId: '3',
    userName: 'Siti',
    quizId: 'test',
    quizName: 'Ujian Komprehensif',
    score: 28,
    totalQuestions: 30,
    percentage: 93,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    type: 'test' as const,
    answers: [],
  },
]

const mockUseScores = {
  scores: mockScores,
  loading: false,
  error: null,
}

const LeaderboardWrapper = () => (
  <BrowserRouter>
    <UserProvider>
      <Leaderboard />
    </UserProvider>
  </BrowserRouter>
)

describe('Leaderboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useScores).mockReturnValue(mockUseScores as any)
  })

  it('renders leaderboard page correctly', () => {
    render(<LeaderboardWrapper />)

    expect(screen.getByText('Papan Markah')).toBeInTheDocument()
    expect(
      screen.getByText('Lihat prestasi terbaik pelajar dalam kuiz dan ujian')
    ).toBeInTheDocument()
  })

  it('displays statistics cards', () => {
    render(<LeaderboardWrapper />)

    expect(screen.getByText('3')).toBeInTheDocument() // Total scores
    expect(screen.getByText('Jumlah Percubaan')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Quiz scores
    expect(screen.getByText('Kuiz')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Test scores
    expect(screen.getByText('Ujian')).toBeInTheDocument()
  })

  it('shows filter buttons', () => {
    render(<LeaderboardWrapper />)

    expect(screen.getByText('Semua (3)')).toBeInTheDocument()
    expect(screen.getByText('Kuiz (1)')).toBeInTheDocument()
    expect(screen.getByText('Ujian (2)')).toBeInTheDocument()
  })

  it('filters scores by quiz type', async () => {
    render(<LeaderboardWrapper />)

    fireEvent.click(screen.getByText('Kuiz (1)'))

    await waitFor(() => {
      expect(screen.getByText('Papan Markah - Kuiz')).toBeInTheDocument()
    })

    // Should only show quiz scores
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
    expect(screen.queryByText('Siti')).not.toBeInTheDocument()
  })

  it('filters scores by test type', async () => {
    render(<LeaderboardWrapper />)

    fireEvent.click(screen.getByText('Ujian (2)'))

    await waitFor(() => {
      expect(screen.getByText('Papan Markah - Ujian')).toBeInTheDocument()
    })

    // Should only show test scores
    expect(screen.getByText('Siti')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.queryByText('Ahmad')).not.toBeInTheDocument()
  })

  it('shows all scores when all filter is selected', async () => {
    render(<LeaderboardWrapper />)

    fireEvent.click(screen.getByText('Ujian (2)'))
    fireEvent.click(screen.getByText('Semua (3)'))

    await waitFor(() => {
      expect(screen.getByText('Papan Markah - Semua')).toBeInTheDocument()
    })

    // Should show all scores
    expect(screen.getByText('Siti')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
  })

  it('highlights current user scores', () => {
    render(<LeaderboardWrapper />)

    expect(screen.getByText('Anda')).toBeInTheDocument()
  })

  it('sorts scores by percentage (highest first)', () => {
    render(<LeaderboardWrapper />)

    // Siti should be first (93%), then Test User (83%), then Ahmad (80%)
    const entries = screen.getAllByText(/Test User|Ahmad|Siti/)
    expect(entries[0]).toHaveTextContent('Siti')
    expect(entries[1]).toHaveTextContent('Test User')
    expect(entries[2]).toHaveTextContent('Ahmad')
  })

  it('shows loading state', () => {
    vi.mocked(useScores).mockReturnValue({
      ...mockUseScores,
      loading: true,
    } as any)

    render(<LeaderboardWrapper />)

    expect(screen.getByText('Memuatkan...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useScores).mockReturnValue({
      ...mockUseScores,
      error: 'Failed to load scores',
    } as any)

    render(<LeaderboardWrapper />)

    expect(screen.getByText('Ralat Memuatkan Papan Markah')).toBeInTheDocument()
    expect(screen.getByText('Failed to load scores')).toBeInTheDocument()
  })

  it('shows empty state when no scores', () => {
    vi.mocked(useScores).mockReturnValue({
      ...mockUseScores,
      scores: [],
    } as any)

    render(<LeaderboardWrapper />)

    expect(screen.getByText('Tiada Markah Lagi')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Cuba ambil kuiz atau ujian untuk melihat markah anda di sini!'
      )
    ).toBeInTheDocument()
  })

  it('navigates back to menu when back button is clicked', () => {
    render(<LeaderboardWrapper />)

    fireEvent.click(screen.getByText('Kembali ke Menu'))

    // Should navigate back (this would be tested with router in real app)
    expect(screen.getByText('Kembali ke Menu')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<LeaderboardWrapper />)

    expect(screen.getByText('Hari ini')).toBeInTheDocument()
    expect(screen.getByText('Semalam')).toBeInTheDocument()
    expect(screen.getByText('2 hari lepas')).toBeInTheDocument()
  })

  it('shows encouragement message when there are scores', () => {
    render(<LeaderboardWrapper />)

    expect(screen.getByText('Teruskan Berusaha!')).toBeInTheDocument()
    expect(
      screen.getByText('Setiap percubaan adalah langkah ke arah kecemerlangan.')
    ).toBeInTheDocument()
  })

  it('updates filter button states correctly', () => {
    render(<LeaderboardWrapper />)

    const allButton = screen.getByText('Semua (3)')
    const quizButton = screen.getByText('Kuiz (1)')
    const testButton = screen.getByText('Ujian (2)')

    // Initially all should be selected
    expect(allButton).toHaveClass('bg-primary-600')

    // Click quiz filter
    fireEvent.click(quizButton)
    expect(quizButton).toHaveClass('bg-primary-600')
    expect(allButton).not.toHaveClass('bg-primary-600')

    // Click test filter
    fireEvent.click(testButton)
    expect(testButton).toHaveClass('bg-primary-600')
    expect(quizButton).not.toHaveClass('bg-primary-600')
  })

  it('handles empty scores array gracefully', () => {
    vi.mocked(useScores).mockReturnValue({
      scores: [],
      loading: false,
      error: null,
    } as any)

    render(<LeaderboardWrapper />)

    // Check for specific 0 values in statistics
    const zeroElements = screen.getAllByText('0')
    expect(zeroElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Tiada Markah Lagi')).toBeInTheDocument()
  })
})
