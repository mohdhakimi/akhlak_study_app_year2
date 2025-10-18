import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TestMode from '../TestMode'
import { UserProvider } from '../../contexts/UserContext'
import { useContentData } from '../../hooks/useContentData'
import { useScores } from '../../hooks/useScores'

// Mock the hooks
vi.mock('../../hooks/useContentData')
vi.mock('../../hooks/useScores')
vi.mock('../../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUserContext: () => ({
    currentUser: { id: '1', name: 'Test User' }
  })
}))

const mockQuizCategories = [
  {
    id: '1',
    name: 'Akhlak Terpuji',
    description: 'Mengenali dan mempraktikkan akhlak yang terpuji',
    questions: [
      {
        id: 'q1',
        question: 'Apakah akhlak terpuji yang pertama?',
        options: ['Jujur', 'Bohong', 'Menipu', 'Curang'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Apakah akhlak terpuji yang kedua?',
        options: ['Sombong', 'Rendah diri', 'Bongkak', 'Angkuh'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: '2',
    name: 'Akhlak Terhadap Ibu Bapa',
    description: 'Cara menghormati dan berbuat baik kepada ibu bapa',
    questions: [
      {
        id: 'q3',
        question: 'Apakah yang perlu dilakukan apabila ibu bapa memberikan nasihat?',
        options: ['Mengabaikan', 'Mematuhi', 'Menolak', 'Membantah'],
        correctAnswer: 1
      }
    ]
  }
]

const mockUseContentData = {
  quizCategories: mockQuizCategories,
  loading: false,
  error: null
}

const mockUseScores = {
  saveScore: vi.fn()
}

const TestModeWrapper = () => (
  <BrowserRouter>
    <UserProvider>
      <TestMode />
    </UserProvider>
  </BrowserRouter>
)

describe('TestMode Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContentData).mockReturnValue(mockUseContentData as any)
    vi.mocked(useScores).mockReturnValue(mockUseScores as any)
  })

  it('renders test introduction initially', () => {
    render(<TestModeWrapper />)
    
    expect(screen.getByText('Ujian Komprehensif')).toBeInTheDocument()
    expect(screen.getByText('Ujian ini mengandungi 30 soalan yang dipilih secara rawak dari semua topik.')).toBeInTheDocument()
  })

  it('shows test details and instructions', () => {
    render(<TestModeWrapper />)
    
    expect(screen.getByText('30')).toBeInTheDocument() // Number of questions
    expect(screen.getByText('Semua Topik')).toBeInTheDocument() // Categories
    expect(screen.getByText('Tiada Had Masa')).toBeInTheDocument() // Time limit
    expect(screen.getByText('Arahan Ujian')).toBeInTheDocument()
  })

  it('starts test when start button is clicked', async () => {
    render(<TestModeWrapper />)
    
    fireEvent.click(screen.getByText('Mula Ujian'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
  })

  it('shows loading state when content is loading', () => {
    vi.mocked(useContentData).mockReturnValue({
      ...mockUseContentData,
      loading: true
    } as any)
    
    render(<TestModeWrapper />)
    
    expect(screen.getByText('Memuatkan...')).toBeInTheDocument()
  })

  it('shows error state when content fails to load', () => {
    vi.mocked(useContentData).mockReturnValue({
      ...mockUseContentData,
      error: 'Failed to load content'
    } as any)
    
    render(<TestModeWrapper />)
    
    expect(screen.getByText('Ralat Memuatkan Kandungan')).toBeInTheDocument()
  })

  it('completes full test flow', async () => {
    render(<TestModeWrapper />)
    
    // Start test
    fireEvent.click(screen.getByText('Mula Ujian'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
    
    // Answer first question
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      expect(screen.getByText('Seterusnya →')).toBeInTheDocument()
    })
    
    // Go to next question
    fireEvent.click(screen.getByText('Seterusnya →'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 3')).toBeInTheDocument()
    })
    
    // Answer second question
    fireEvent.click(screen.getByText('Rendah diri'))
    
    await waitFor(() => {
      expect(screen.getByText('Seterusnya →')).toBeInTheDocument()
    })
    
    // Go to next question
    fireEvent.click(screen.getByText('Seterusnya →'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 3 dari 3')).toBeInTheDocument()
    })
    
    // Answer third question
    fireEvent.click(screen.getByText('Mematuhi'))
    
    await waitFor(() => {
      expect(screen.getByText('Selesai')).toBeInTheDocument()
    })
    
    // Finish test
    fireEvent.click(screen.getByText('Selesai'))
    
    await waitFor(() => {
      expect(screen.getByText('Keputusan Ujian')).toBeInTheDocument()
    })
  })

  it('saves score when test is completed', async () => {
    render(<TestModeWrapper />)
    
    // Complete test flow
    fireEvent.click(screen.getByText('Mula Ujian'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 3')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Rendah diri'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 3 dari 3')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Mematuhi'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Selesai'))
    })
    
    await waitFor(() => {
      expect(mockUseScores.saveScore).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '1',
          userName: 'Test User',
          quizId: 'test',
          quizName: 'Ujian Komprehensif',
          score: 3,
          totalQuestions: 3,
          type: 'test'
        })
      )
    })
  })

  it('handles navigation between questions', async () => {
    render(<TestModeWrapper />)
    
    fireEvent.click(screen.getByText('Mula Ujian'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
    
    // Answer first question
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 3')).toBeInTheDocument()
    })
    
    // Go back to previous question
    fireEvent.click(screen.getByText('← Sebelum'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
  })

  it('shows retake test option in results', async () => {
    render(<TestModeWrapper />)
    
    // Complete test
    fireEvent.click(screen.getByText('Mula Ujian'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 3')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Rendah diri'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 3 dari 3')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Mematuhi'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Selesai'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Ambil Ujian Lagi')).toBeInTheDocument()
    })
  })

  it('handles back to menu navigation', async () => {
    render(<TestModeWrapper />)
    
    // Start test
    fireEvent.click(screen.getByText('Mula Ujian'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 3')).toBeInTheDocument()
    })
    
    // Go back to menu
    fireEvent.click(screen.getByText('Kembali ke Menu'))
    
    await waitFor(() => {
      expect(screen.getByText('Ujian Komprehensif')).toBeInTheDocument()
    })
  })

  it('shows message when no questions available', () => {
    vi.mocked(useContentData).mockReturnValue({
      ...mockUseContentData,
      quizCategories: []
    } as any)
    
    render(<TestModeWrapper />)
    
    expect(screen.getByText('Tiada soalan tersedia untuk ujian. Sila cuba lagi nanti.')).toBeInTheDocument()
  })

  it('disables start button when no questions available', () => {
    vi.mocked(useContentData).mockReturnValue({
      ...mockUseContentData,
      quizCategories: []
    } as any)
    
    render(<TestModeWrapper />)
    
    expect(screen.getByText('Mula Ujian')).toBeDisabled()
  })
})
