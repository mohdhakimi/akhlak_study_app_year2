import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import QuizMode from '../QuizMode'
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

const QuizModeWrapper = () => (
  <BrowserRouter>
    <UserProvider>
      <QuizMode />
    </UserProvider>
  </BrowserRouter>
)

describe('QuizMode Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContentData).mockReturnValue(mockUseContentData as any)
    vi.mocked(useScores).mockReturnValue(mockUseScores as any)
  })

  it('renders category selector initially', () => {
    render(<QuizModeWrapper />)
    
    expect(screen.getByText('Pilih Kategori Kuiz')).toBeInTheDocument()
    expect(screen.getByText('Akhlak Terpuji')).toBeInTheDocument()
  })

  it('navigates to quiz when category is selected', async () => {
    render(<QuizModeWrapper />)
    
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    await waitFor(() => {
      expect(screen.getByText('Apakah akhlak terpuji yang pertama?')).toBeInTheDocument()
    })
  })

  it('shows loading state when content is loading', () => {
    vi.mocked(useContentData).mockReturnValue({
      ...mockUseContentData,
      loading: true
    } as any)
    
    render(<QuizModeWrapper />)
    
    expect(screen.getByText('Memuatkan kandungan...')).toBeInTheDocument()
  })

  it('shows error state when content fails to load', () => {
    vi.mocked(useContentData).mockReturnValue({
      ...mockUseContentData,
      error: 'Failed to load content'
    } as any)
    
    render(<QuizModeWrapper />)
    
    expect(screen.getByText('Ralat Memuatkan Kandungan')).toBeInTheDocument()
  })

  it('completes full quiz flow', async () => {
    render(<QuizModeWrapper />)
    
    // Select category
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 2')).toBeInTheDocument()
    })
    
    // Answer first question
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      expect(screen.getByText('Seterusnya →')).toBeInTheDocument()
    })
    
    // Go to next question
    fireEvent.click(screen.getByText('Seterusnya →'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 2')).toBeInTheDocument()
    })
    
    // Answer second question
    fireEvent.click(screen.getByText('Rendah diri'))
    
    await waitFor(() => {
      expect(screen.getByText('Selesai')).toBeInTheDocument()
    })
    
    // Finish quiz
    fireEvent.click(screen.getByText('Selesai'))
    
    await waitFor(() => {
      expect(screen.getByText('Keputusan Kuiz')).toBeInTheDocument()
    })
  })

  it('saves score when quiz is completed', async () => {
    render(<QuizModeWrapper />)
    
    // Complete quiz flow
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 2')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 2')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Rendah diri'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Selesai'))
    })
    
    await waitFor(() => {
      expect(mockUseScores.saveScore).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '1',
          userName: 'Test User',
          quizId: '1',
          quizName: 'Akhlak Terpuji',
          score: 2,
          totalQuestions: 2,
          type: 'quiz'
        })
      )
    })
  })

  it('handles navigation between questions', async () => {
    render(<QuizModeWrapper />)
    
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 2')).toBeInTheDocument()
    })
    
    // Answer first question
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 2')).toBeInTheDocument()
    })
    
    // Go back to previous question
    fireEvent.click(screen.getByText('← Sebelum'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 2')).toBeInTheDocument()
    })
  })

  it('shows retake quiz option in results', async () => {
    render(<QuizModeWrapper />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 2')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Seterusnya →'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 2')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Rendah diri'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Selesai'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Ambil Kuiz Lagi')).toBeInTheDocument()
    })
  })

  it('handles back to menu navigation', async () => {
    render(<QuizModeWrapper />)
    
    // Start quiz
    fireEvent.click(screen.getByText('Akhlak Terpuji'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 1 dari 2')).toBeInTheDocument()
    })
    
    // Go back to menu
    fireEvent.click(screen.getByText('Kembali ke Menu'))
    
    await waitFor(() => {
      expect(screen.getByText('Pilih Kategori Kuiz')).toBeInTheDocument()
    })
  })
})
