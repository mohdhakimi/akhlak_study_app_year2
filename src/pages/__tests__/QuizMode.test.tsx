import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import QuizMode from '../QuizMode'
import { UserProvider } from '../../contexts/UserContext'
import { BilingualProvider } from '../../contexts/BilingualContext'
import { useContentData } from '../../hooks/useContentData'
import { useScores } from '../../hooks/useScores'
import { useQuizMode } from '../../hooks/useQuizMode'

// Mock the hooks
vi.mock('../../hooks/useContentData')
vi.mock('../../hooks/useScores')
vi.mock('../../hooks/useQuizMode')
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
        type: 'mcq',
        options: ['Jujur', 'Bohong', 'Menipu', 'Curang'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Apakah akhlak terpuji yang kedua?',
        type: 'mcq',
        options: ['Sombong', 'Rendah diri', 'Bongkak', 'Angkuh'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'Apakah akhlak terpuji yang ketiga?',
        type: 'mcq',
        options: ['Sabar', 'Marah', 'Dendam', 'Benci'],
        correctAnswer: 0
      },
      {
        id: 'q4',
        question: 'Apakah akhlak terpuji yang keempat?',
        type: 'mcq',
        options: ['Syukur', 'Kufur', 'Sombong', 'Angkuh'],
        correctAnswer: 0
      },
      {
        id: 'q5',
        question: 'Apakah akhlak terpuji yang kelima?',
        type: 'mcq',
        options: ['Tawaduk', 'Sombong', 'Bongkak', 'Angkuh'],
        correctAnswer: 0
      },
      {
        id: 'q6',
        question: 'Apakah akhlak terpuji yang keenam?',
        type: 'mcq',
        options: ['Pemaaf', 'Dendam', 'Benci', 'Marah'],
        correctAnswer: 0
      },
      {
        id: 'q7',
        question: 'Apakah akhlak terpuji yang ketujuh?',
        type: 'mcq',
        options: ['Ikhlas', 'Riya', 'Sombong', 'Angkuh'],
        correctAnswer: 0
      },
      {
        id: 'q8',
        question: 'Apakah akhlak terpuji yang kelapan?',
        type: 'mcq',
        options: ['Amanah', 'Khianat', 'Curang', 'Bohong'],
        correctAnswer: 0
      },
      {
        id: 'q9',
        question: 'Apakah akhlak terpuji yang kesembilan?',
        type: 'mcq',
        options: ['Adil', 'Zalim', 'Sombong', 'Angkuh'],
        correctAnswer: 0
      },
      {
        id: 'q10',
        question: 'Apakah akhlak terpuji yang kesepuluh?',
        type: 'mcq',
        options: ['Kasih sayang', 'Benci', 'Dendam', 'Marah'],
        correctAnswer: 0
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

const mockUseQuizMode = {
  currentQuestion: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  selectedAnswers: [],
  isAnswered: false,
  isRevealed: false,
  score: 0,
  timeSpent: null,
  isComplete: false,
  currentCorrectAnswer: 0,
  currentShuffledOptions: [],
  startQuiz: vi.fn(),
  selectAnswer: vi.fn(),
  goToNext: vi.fn(),
  goToPrevious: vi.fn(),
  finishQuiz: vi.fn(),
  resetQuiz: vi.fn(),
  canGoNext: false,
  canGoPrevious: false,
  progress: 0
}

const QuizModeWrapper = () => (
  <BrowserRouter>
    <UserProvider>
      <BilingualProvider>
        <QuizMode />
      </BilingualProvider>
    </UserProvider>
  </BrowserRouter>
)

describe('QuizMode Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useContentData).mockReturnValue(mockUseContentData as any)
    vi.mocked(useScores).mockReturnValue(mockUseScores as any)
    vi.mocked(useQuizMode).mockReturnValue(mockUseQuizMode as any)
  })

  it('renders category selector initially', () => {
    render(<QuizModeWrapper />)
    
    expect(screen.getByText('Pilih Kategori Kuiz')).toBeInTheDocument()
    expect(screen.getByText('Akhlak Terpuji')).toBeInTheDocument()
  })

        it('navigates to quiz when category is selected', async () => {
          // Mock quiz state after starting
          const mockQuizStarted = {
            ...mockUseQuizMode,
            currentQuestion: mockQuizCategories[0].questions[0],
            currentQuestionIndex: 0,
            totalQuestions: 10,
            isComplete: false,
            canGoNext: true,
            canGoPrevious: false,
            progress: 0
          }
          
          // Mock the startQuiz function to update the quiz state
          const mockStartQuiz = vi.fn().mockImplementation(() => {
            vi.mocked(useQuizMode).mockReturnValue(mockQuizStarted as any)
          })
          
          vi.mocked(useQuizMode).mockReturnValue({
            ...mockUseQuizMode,
            startQuiz: mockStartQuiz
          } as any)
          
          render(<QuizModeWrapper />)
          
          // Click on the category card (not just the text)
          const categoryCard = screen.getByText('Akhlak Terpuji').closest('[class*="cursor-pointer"]')
          fireEvent.click(categoryCard!)
          
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
    fireEvent.click(screen.getByText('Mula Kuiz'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Soalan 1 dari 10') || element?.textContent?.includes('سوالن 1 دري 10')
      })).toBeInTheDocument()
    })
    
    // Answer first question
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Seterusnya') || element?.textContent?.includes('ستروسڽا')
      })).toBeInTheDocument()
    })
    
    // Go to next question
    fireEvent.click(screen.getByText('(content, element) => {
        return element?.textContent?.includes('Seterusnya') || element?.textContent?.includes('ستروسڽا')
      }'))
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 10')).toBeInTheDocument()
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
    fireEvent.click(screen.getByText('Mula Kuiz'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('(content, element) => {
        return element?.textContent?.includes('Soalan 1 dari 10') || element?.textContent?.includes('سوالن 1 دري 10')
      }') || element?.textContent?.includes('سوالن 1 دري 10')
      })).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('(content, element) => {
        return element?.textContent?.includes('Seterusnya') || element?.textContent?.includes('ستروسڽا')
      }'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 10')).toBeInTheDocument()
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
    
    fireEvent.click(screen.getByText('Mula Kuiz'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Soalan 1 dari 10') || element?.textContent?.includes('سوالن 1 دري 10')
      })).toBeInTheDocument()
    })
    
    // Answer first question
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('(content, element) => {
        return element?.textContent?.includes('Seterusnya') || element?.textContent?.includes('ستروسڽا')
      }'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 10')).toBeInTheDocument()
    })
    
    // Go back to previous question
    fireEvent.click(screen.getByText('← Sebelum'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Soalan 1 dari 10') || element?.textContent?.includes('سوالن 1 دري 10')
      })).toBeInTheDocument()
    })
  })

  it('shows retake quiz option in results', async () => {
    render(<QuizModeWrapper />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('Mula Kuiz'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Soalan 1 dari 10') || element?.textContent?.includes('سوالن 1 دري 10')
      })).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Jujur'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('(content, element) => {
        return element?.textContent?.includes('Seterusnya') || element?.textContent?.includes('ستروسڽا')
      }'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Soalan 2 dari 10')).toBeInTheDocument()
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
    fireEvent.click(screen.getByText('Mula Kuiz'))
    
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Soalan 1 dari 10') || element?.textContent?.includes('سوالن 1 دري 10')
      })).toBeInTheDocument()
    })
    
    // Go back to menu
    fireEvent.click(screen.getByText('Kembali ke Menu'))
    
    await waitFor(() => {
      expect(screen.getByText('Pilih Kategori Kuiz')).toBeInTheDocument()
    })
  })
})
