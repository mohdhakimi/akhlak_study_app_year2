import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserSelectionModal from '../UserSelectionModal'
import { User } from '../../types'

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Siti',
    createdAt: '2025-01-02T00:00:00.000Z'
  }
]

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onUserSelect: vi.fn(),
  onCreateUser: vi.fn(),
  existingUsers: mockUsers,
  loading: false,
  error: null,
  onClearError: vi.fn()
}

describe('UserSelectionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<UserSelectionModal {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.getByText('Siti')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<UserSelectionModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays existing users', () => {
    render(<UserSelectionModal {...defaultProps} />)
    
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.getByText('Siti')).toBeInTheDocument()
  })

  it('calls onUserSelect when user is clicked', async () => {
    const user = userEvent.setup()
    render(<UserSelectionModal {...defaultProps} />)
    
    const ahmadCard = screen.getByText('Ahmad').closest('div')
    await user.click(ahmadCard!)
    
    expect(defaultProps.onUserSelect).toHaveBeenCalledWith(mockUsers[0])
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('shows create user form when create button is clicked', async () => {
    const user = userEvent.setup()
    render(<UserSelectionModal {...defaultProps} />)
    
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    expect(screen.getByPlaceholderText('Masukkan nama anda di sini...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Batal/ })).toBeInTheDocument()
  })

  it('validates empty name when creating user', async () => {
    const user = userEvent.setup()
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Try to create user with empty name
    const createUserButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createUserButton)
    
    expect(screen.getByText('Nama diperlukan')).toBeInTheDocument()
    expect(defaultProps.onCreateUser).not.toHaveBeenCalled()
  })

  it('validates short name when creating user', async () => {
    const user = userEvent.setup()
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Enter short name
    const nameInput = screen.getByPlaceholderText('Masukkan nama anda di sini...')
    await user.type(nameInput, 'A')
    
    // Try to create user
    const createUserButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createUserButton)
    
    expect(screen.getByText('Nama terlalu pendek')).toBeInTheDocument()
    expect(defaultProps.onCreateUser).not.toHaveBeenCalled()
  })

  it('validates duplicate name when creating user', async () => {
    const user = userEvent.setup()
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Enter duplicate name
    const nameInput = screen.getByPlaceholderText('Masukkan nama anda di sini...')
    await user.type(nameInput, 'Ahmad')
    
    // Try to create user
    const createUserButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createUserButton)
    
    expect(screen.getByText('Nama sudah wujud')).toBeInTheDocument()
    expect(defaultProps.onCreateUser).not.toHaveBeenCalled()
  })

  it('creates user with valid name', async () => {
    const user = userEvent.setup()
    const mockNewUser: User = {
      id: '3',
      name: 'Ali',
      createdAt: '2025-01-03T00:00:00.000Z'
    }
    
    defaultProps.onCreateUser.mockReturnValue(mockNewUser)
    
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Enter valid name
    const nameInput = screen.getByPlaceholderText('Masukkan nama anda di sini...')
    await user.type(nameInput, 'Ali')
    
    // Create user
    const createUserButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createUserButton)
    
    expect(defaultProps.onCreateUser).toHaveBeenCalledWith('Ali')
    expect(defaultProps.onUserSelect).toHaveBeenCalledWith(mockNewUser)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('handles create user error', async () => {
    const user = userEvent.setup()
    defaultProps.onCreateUser.mockReturnValue(null)
    
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Enter valid name
    const nameInput = screen.getByPlaceholderText('Masukkan nama anda di sini...')
    await user.type(nameInput, 'Ali')
    
    // Create user
    const createUserButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createUserButton)
    
    expect(defaultProps.onCreateUser).toHaveBeenCalledWith('Ali')
    expect(defaultProps.onUserSelect).not.toHaveBeenCalled()
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('cancels create user form', async () => {
    const user = userEvent.setup()
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Cancel
    const cancelButton = screen.getByRole('button', { name: /Batal/ })
    await user.click(cancelButton)
    
    expect(screen.queryByPlaceholderText('Masukkan nama anda di sini...')).not.toBeInTheDocument()
  })

  it('handles enter key in name input', async () => {
    const user = userEvent.setup()
    const mockNewUser: User = {
      id: '3',
      name: 'Ali',
      createdAt: '2025-01-03T00:00:00.000Z'
    }
    
    defaultProps.onCreateUser.mockReturnValue(mockNewUser)
    
    render(<UserSelectionModal {...defaultProps} />)
    
    // Open create form
    const createButton = screen.getByRole('button', { name: /Cipta Pengguna Baru/ })
    await user.click(createButton)
    
    // Enter valid name and press enter
    const nameInput = screen.getByPlaceholderText('Masukkan nama anda di sini...')
    await user.type(nameInput, 'Ali')
    await user.keyboard('{Enter}')
    
    expect(defaultProps.onCreateUser).toHaveBeenCalledWith('Ali')
  })

  it('displays error message', () => {
    render(<UserSelectionModal {...defaultProps} error="Test error" />)
    
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    render(<UserSelectionModal {...defaultProps} loading={true} />)
    
    expect(screen.getByText('Memuatkan...')).toBeInTheDocument()
  })

  it('calls onClearError when modal opens', () => {
    const { rerender } = render(<UserSelectionModal {...defaultProps} isOpen={false} />)
    
    expect(defaultProps.onClearError).not.toHaveBeenCalled()
    
    rerender(<UserSelectionModal {...defaultProps} isOpen={true} />)
    
    expect(defaultProps.onClearError).toHaveBeenCalled()
  })
})
