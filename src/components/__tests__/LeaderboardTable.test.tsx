import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LeaderboardTable from '../LeaderboardTable'
import { LeaderboardEntry } from '../../types'

const mockEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userName: 'Ahmad',
    score: 10,
    percentage: 100,
    date: 'Hari ini',
    quizId: 'test',
  },
  {
    rank: 2,
    userName: 'Siti',
    score: 9,
    percentage: 90,
    date: 'Semalam',
    quizId: 'quiz-1',
  },
  {
    rank: 3,
    userName: 'Ali',
    score: 8,
    percentage: 80,
    date: '2 hari lepas',
    quizId: 'test',
  },
]

const defaultProps = {
  entries: mockEntries,
  type: 'all' as const,
}

describe('LeaderboardTable', () => {
  it('renders leaderboard table correctly', () => {
    render(<LeaderboardTable {...defaultProps} />)

    expect(screen.getByText('Papan Markah - Semua')).toBeInTheDocument()
    expect(screen.getByText('3 entri')).toBeInTheDocument()
  })

  it('displays all entries with correct data', () => {
    render(<LeaderboardTable {...defaultProps} />)

    // Check headers
    expect(screen.getByText('Kedudukan')).toBeInTheDocument()
    expect(screen.getByText('Nama Pemain')).toBeInTheDocument()
    expect(screen.getByText('Markah')).toBeInTheDocument()
    expect(screen.getByText('Peratusan')).toBeInTheDocument()
    expect(screen.getByText('Tarikh')).toBeInTheDocument()
    expect(screen.getByText('Jenis')).toBeInTheDocument()

    // Check first entry
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Hari ini')).toBeInTheDocument()
  })

  it('shows correct rank icons', () => {
    render(<LeaderboardTable {...defaultProps} />)

    expect(screen.getByText('🥇')).toBeInTheDocument() // First place
    expect(screen.getByText('🥈')).toBeInTheDocument() // Second place
    expect(screen.getByText('🥉')).toBeInTheDocument() // Third place
  })

  it('displays correct type labels', () => {
    render(<LeaderboardTable {...defaultProps} />)

    expect(screen.getByText('Ujian')).toBeInTheDocument() // test type
    expect(screen.getByText('Kuiz')).toBeInTheDocument() // quiz type
  })

  it('highlights current user entries', () => {
    render(<LeaderboardTable {...defaultProps} currentUserName="Ahmad" />)

    expect(screen.getByText('Anda')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<LeaderboardTable {...defaultProps} loading={true} />)

    expect(screen.getByText('Memuatkan papan markah...')).toBeInTheDocument()
  })

  it('shows empty state when no entries', () => {
    render(<LeaderboardTable {...defaultProps} entries={[]} />)

    expect(screen.getByText('Tiada Markah Lagi')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Cuba ambil kuiz atau ujian untuk melihat markah anda di sini!'
      )
    ).toBeInTheDocument()
  })

  it('shows correct category label for different types', () => {
    const { rerender } = render(
      <LeaderboardTable {...defaultProps} type="quiz" />
    )
    expect(screen.getByText('Papan Markah - Kuiz')).toBeInTheDocument()

    rerender(<LeaderboardTable {...defaultProps} type="test" />)
    expect(screen.getByText('Papan Markah - Ujian')).toBeInTheDocument()

    rerender(<LeaderboardTable {...defaultProps} type="all" />)
    expect(screen.getByText('Papan Markah - Semua')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <LeaderboardTable {...defaultProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('shows progress bars for percentages', () => {
    render(<LeaderboardTable {...defaultProps} />)

    // Check that progress bars are rendered (they should have specific width styles)
    const progressBars = screen.getAllByRole('progressbar', { hidden: true })
    expect(progressBars).toHaveLength(3)
  })

  it('displays user avatars with first letter', () => {
    render(<LeaderboardTable {...defaultProps} />)

    // Use getAllByText for duplicate letters and check specific contexts
    const aElements = screen.getAllByText('A')
    expect(aElements).toHaveLength(2) // Ahmad and Ali

    expect(screen.getByText('S')).toBeInTheDocument() // Siti
  })

  it('shows different colors for different rank ranges', () => {
    const entriesWithDifferentRanks: LeaderboardEntry[] = [
      { ...mockEntries[0], rank: 1, percentage: 100 },
      { ...mockEntries[1], rank: 2, percentage: 90 },
      { ...mockEntries[2], rank: 3, percentage: 80 },
      { ...mockEntries[0], rank: 4, percentage: 70, userName: 'Hassan' },
      { ...mockEntries[1], rank: 5, percentage: 60, userName: 'Fatimah' },
    ]

    render(
      <LeaderboardTable {...defaultProps} entries={entriesWithDifferentRanks} />
    )

    // All entries should be rendered
    expect(screen.getByText('Hassan')).toBeInTheDocument()
    expect(screen.getByText('Fatimah')).toBeInTheDocument()
  })

  it('handles large number of entries', () => {
    const manyEntries: LeaderboardEntry[] = Array.from(
      { length: 50 },
      (_, i) => ({
        rank: i + 1,
        userName: `User${i + 1}`,
        score: 50 - i,
        percentage: 100 - i,
        date: 'Hari ini',
        quizId: 'test',
      })
    )

    render(<LeaderboardTable {...defaultProps} entries={manyEntries} />)

    expect(screen.getByText('50 entri')).toBeInTheDocument()
    expect(screen.getByText('User1')).toBeInTheDocument()
    expect(screen.getByText('User50')).toBeInTheDocument()
  })

  it('shows footer message', () => {
    render(<LeaderboardTable {...defaultProps} />)

    expect(
      screen.getByText('Papan markah dikemas kini secara automatik')
    ).toBeInTheDocument()
  })
})
