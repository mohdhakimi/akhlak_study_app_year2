import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

// Mock the UserContext
vi.mock('./contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUserContext: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    addUser: vi.fn(),
    updateUser: vi.fn(),
    removeUser: vi.fn(),
    selectUser: vi.fn(),
    clearError: vi.fn(),
    showUserSelectionModal: false,
    openUserSelectionModal: vi.fn(),
    closeUserSelectionModal: vi.fn(),
  }),
}))

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />)
    expect(screen.getByText('Akhlak Tahun Dua KSRI')).toBeInTheDocument()
    expect(
      screen.getByText('Aplikasi Pembelajaran Interaktif')
    ).toBeInTheDocument()
  })

  it('renders user selection button', () => {
    render(<App />)
    expect(screen.getByText('Pilih Pengguna')).toBeInTheDocument()
  })

  it('renders welcome text', () => {
    render(<App />)
    expect(screen.getByText('Selamat Datang')).toBeInTheDocument()
  })
})
