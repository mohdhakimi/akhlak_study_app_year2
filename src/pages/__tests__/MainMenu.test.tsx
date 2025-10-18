import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import MainMenu from '../MainMenu'

// Mock the UserContext
const mockUseUserContext = vi.fn()
vi.mock('../../contexts/UserContext', () => ({
  useUserContext: () => mockUseUserContext()
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children
  }
})

const defaultContextValue = {
  currentUser: { id: '1', name: 'Ahmad', createdAt: '2025-01-01T00:00:00.000Z' },
  openUserSelectionModal: vi.fn(),
  users: [],
  loading: false,
  error: null,
  addUser: vi.fn(),
  updateUser: vi.fn(),
  removeUser: vi.fn(),
  selectUser: vi.fn(),
  clearError: vi.fn(),
  showUserSelectionModal: false,
  closeUserSelectionModal: vi.fn()
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('MainMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseUserContext.mockReturnValue(defaultContextValue)
  })

  it('renders main menu with all navigation cards', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('Akhlak Tahun Dua KSRI')).toBeInTheDocument()
    expect(screen.getByText('Aplikasi Pembelajaran Interaktif')).toBeInTheDocument()
    expect(screen.getByText('Mod Belajar')).toBeInTheDocument()
    expect(screen.getByText('Mod Kuiz')).toBeInTheDocument()
    expect(screen.getByText('Mod Ujian')).toBeInTheDocument()
    expect(screen.getByText('Papan Markah')).toBeInTheDocument()
  })

  it('displays welcome message with user name when user is logged in', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('Selamat Datang, Ahmad!')).toBeInTheDocument()
  })

  it('displays generic welcome message when no user is logged in', () => {
    mockUseUserContext.mockReturnValue({
      ...defaultContextValue,
      currentUser: null
    })
    
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('Selamat Datang')).toBeInTheDocument()
  })

  it('navigates to correct routes when menu cards are clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MainMenu />)
    
    // Test Study Mode navigation
    const studyCard = screen.getByText('Mod Belajar').closest('div')
    await user.click(studyCard!)
    expect(mockNavigate).toHaveBeenCalledWith('/study')
    
    // Test Quiz Mode navigation
    const quizCard = screen.getByText('Mod Kuiz').closest('div')
    await user.click(quizCard!)
    expect(mockNavigate).toHaveBeenCalledWith('/quiz')
    
    // Test Test Mode navigation
    const testCard = screen.getByText('Mod Ujian').closest('div')
    await user.click(testCard!)
    expect(mockNavigate).toHaveBeenCalledWith('/test')
    
    // Test Leaderboard navigation
    const leaderboardCard = screen.getByText('Papan Markah').closest('div')
    await user.click(leaderboardCard!)
    expect(mockNavigate).toHaveBeenCalledWith('/leaderboard')
  })

  it('calls openUserSelectionModal when user button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MainMenu />)
    
    const userButton = screen.getByText('Tukar Pengguna')
    await user.click(userButton)
    
    expect(defaultContextValue.openUserSelectionModal).toHaveBeenCalled()
  })

  it('shows correct button text based on user state', () => {
    // Test with user logged in
    renderWithRouter(<MainMenu />)
    expect(screen.getByText('Tukar Pengguna')).toBeInTheDocument()
    
    // Test without user logged in
    mockUseUserContext.mockReturnValue({
      ...defaultContextValue,
      currentUser: null
    })
    
    renderWithRouter(<MainMenu />)
    expect(screen.getByText('Pilih Pengguna')).toBeInTheDocument()
  })

  it('displays menu item descriptions', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('Baca dan pelajari nota-nota penting')).toBeInTheDocument()
    expect(screen.getByText('Uji pengetahuan dengan kuiz pendek')).toBeInTheDocument()
    expect(screen.getByText('Ujian lengkap 30 soalan')).toBeInTheDocument()
    expect(screen.getByText('Lihat markah tertinggi')).toBeInTheDocument()
  })

  it('displays mascot and encouraging message', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('🐾')).toBeInTheDocument()
    expect(screen.getByText('"Jom belajar bersama-sama! Pilih mod yang anda suka untuk mula belajar."')).toBeInTheDocument()
  })

  it('has refresh button that reloads the page', async () => {
    const user = userEvent.setup()
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})
    
    renderWithRouter(<MainMenu />)
    
    const refreshButton = screen.getByText('Muat Semula')
    await user.click(refreshButton)
    
    expect(reloadSpy).toHaveBeenCalled()
    
    reloadSpy.mockRestore()
  })

  it('renders all menu items with correct icons', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('📚')).toBeInTheDocument() // Study
    expect(screen.getByText('🧩')).toBeInTheDocument() // Quiz
    expect(screen.getByText('📝')).toBeInTheDocument() // Test
    expect(screen.getByText('🏆')).toBeInTheDocument() // Leaderboard
  })

  it('has responsive grid layout classes', () => {
    renderWithRouter(<MainMenu />)
    
    const gridContainer = screen.getByText('Mod Belajar').closest('div')?.parentElement
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')
  })
})
