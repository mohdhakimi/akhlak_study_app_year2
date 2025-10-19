import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import MainMenu from '../MainMenu'
import { BilingualProvider } from '../../contexts/BilingualContext'

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
      <BilingualProvider>
        {component}
      </BilingualProvider>
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
    
    expect(screen.getByText('سلامت داتڠ، Ahmad! | Selamat Datang, Ahmad!')).toBeInTheDocument()
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
    
    const userButton = screen.getByRole('button', { name: /Pengguna semasa: Ahmad/ })
    await user.click(userButton)
    
    expect(defaultContextValue.openUserSelectionModal).toHaveBeenCalled()
  })

  it('shows correct button text based on user state', () => {
    // Test with user logged in
    renderWithRouter(<MainMenu />)
    expect(screen.getByRole('button', { name: /Pengguna semasa: Ahmad/ })).toBeInTheDocument()
    
    // Test without user logged in
    mockUseUserContext.mockReturnValue({
      ...defaultContextValue,
      currentUser: null
    })
    
    renderWithRouter(<MainMenu />)
    // There are multiple "Pilih Pengguna" buttons, so we'll check that at least one exists
    expect(screen.getAllByRole('button', { name: /Pilih Pengguna/ })).toHaveLength(2)
  })

  it('displays menu item descriptions', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getByText('باچ دان ڤلاجري نوتا-نوتا ڤنتڠ | Baca dan pelajari nota-nota penting')).toBeInTheDocument()
    expect(screen.getByText('اوجي ڤنڬتاهوان دغن کویز ڤندق | Uji pengetahuan dengan kuiz pendek')).toBeInTheDocument()
    expect(screen.getByText('اوجيان لڠکڤ 30 سوالن | Ujian lengkap 30 soalan')).toBeInTheDocument()
    expect(screen.getByText('ليه ماره ترتيڠڬي | Lihat markah tertinggi')).toBeInTheDocument()
  })

  it('displays mascot and encouraging message', () => {
    renderWithRouter(<MainMenu />)
    
    expect(screen.getAllByText('😊')).toHaveLength(2) // There are 2 mascots in the page
    expect(screen.getByText('ماري بلاجر اخالق دغن چرا يغ منيرونوکن! ڤليه مود ڤمبلاچرن يغ اندا سوكا. | Mari belajar Akhlak dengan cara yang menyeronokkan! Pilih mod pembelajaran yang anda suka.')).toBeInTheDocument()
  })

  it('has refresh button that reloads the page', async () => {
    const user = userEvent.setup()
    // Mock window.location.reload by replacing the entire location object
    const reloadSpy = vi.fn()
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, reload: reloadSpy } as any
    
    renderWithRouter(<MainMenu />)
    
    const refreshButton = screen.getByText('Muat Semula')
    await user.click(refreshButton)
    
    expect(reloadSpy).toHaveBeenCalled()
    
    // Restore original location
    window.location = originalLocation
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
    
    // Find the grid container by looking for the parent of the menu items
    const studyCard = screen.getByText('Mod Belajar').closest('div')
    const gridContainer = studyCard?.closest('.grid')
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')
  })
})
