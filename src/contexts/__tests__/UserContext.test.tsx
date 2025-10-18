import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProvider, useUserContext } from '../UserContext'
import { User } from '../../types'

// Mock the useUsers hook
const mockUseUsers = vi.fn(() => ({
  users: [
    { id: '1', name: 'Ahmad', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: '2', name: 'Siti', createdAt: '2025-01-02T00:00:00.000Z' }
  ],
  currentUser: null,
  loading: false,
  error: null,
  addUser: vi.fn(),
  updateUser: vi.fn(),
  removeUser: vi.fn(),
  selectUser: vi.fn(),
  clearError: vi.fn()
}))

vi.mock('../../hooks/useUsers', () => ({
  useUsers: mockUseUsers
}))

// Test component that uses the context
const TestComponent = () => {
  const {
    users,
    currentUser,
    loading,
    error,
    addUser,
    selectUser,
    clearError,
    showUserSelectionModal,
    openUserSelectionModal,
    closeUserSelectionModal
  } = useUserContext()

  return (
    <div>
      <div data-testid="users-count">{users.length}</div>
      <div data-testid="current-user">{currentUser?.name || 'None'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="modal-open">{showUserSelectionModal ? 'Open' : 'Closed'}</div>
      
      <button onClick={() => addUser('Test User')}>Add User</button>
      <button onClick={() => selectUser(users[0])}>Select User</button>
      <button onClick={clearError}>Clear Error</button>
      <button onClick={openUserSelectionModal}>Open Modal</button>
      <button onClick={closeUserSelectionModal}>Close Modal</button>
    </div>
  )
}

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides user context values', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    expect(screen.getByTestId('users-count')).toHaveTextContent('2')
    expect(screen.getByTestId('current-user')).toHaveTextContent('None')
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
    expect(screen.getByTestId('error')).toHaveTextContent('No Error')
    expect(screen.getByTestId('modal-open')).toHaveTextContent('Closed')
  })

  it('opens modal when no current user and no users exist', async () => {
    // Mock useUsers to return empty users array
    mockUseUsers.mockReturnValue({
      users: [],
      currentUser: null,
      loading: false,
      error: null,
      addUser: vi.fn(),
      updateUser: vi.fn(),
      removeUser: vi.fn(),
      selectUser: vi.fn(),
      clearError: vi.fn()
    })

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('modal-open')).toHaveTextContent('Open')
    })
  })

  it('handles modal open/close', async () => {
    const user = userEvent.setup()
    
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Open modal
    const openButton = screen.getByText('Open Modal')
    await user.click(openButton)
    
    expect(screen.getByTestId('modal-open')).toHaveTextContent('Open')

    // Close modal
    const closeButton = screen.getByText('Close Modal')
    await user.click(closeButton)
    
    expect(screen.getByTestId('modal-open')).toHaveTextContent('Closed')
  })

  it('calls context functions when buttons are clicked', async () => {
    const user = userEvent.setup()
    const mockAddUser = vi.fn()
    const mockSelectUser = vi.fn()
    const mockClearError = vi.fn()

    mockUseUsers.mockReturnValue({
      users: [
        { id: '1', name: 'Ahmad', createdAt: '2025-01-01T00:00:00.000Z' }
      ],
      currentUser: null,
      loading: false,
      error: null,
      addUser: mockAddUser,
      updateUser: vi.fn(),
      removeUser: vi.fn(),
      selectUser: mockSelectUser,
      clearError: mockClearError
    })

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Test add user
    const addButton = screen.getByText('Add User')
    await user.click(addButton)
    expect(mockAddUser).toHaveBeenCalledWith('Test User')

    // Test select user
    const selectButton = screen.getByText('Select User')
    await user.click(selectButton)
    expect(mockSelectUser).toHaveBeenCalledWith({ id: '1', name: 'Ahmad', createdAt: '2025-01-01T00:00:00.000Z' })

    // Test clear error
    const clearButton = screen.getByText('Clear Error')
    await user.click(clearButton)
    expect(mockClearError).toHaveBeenCalled()
  })

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useUserContext must be used within a UserProvider')

    consoleSpy.mockRestore()
  })
})
