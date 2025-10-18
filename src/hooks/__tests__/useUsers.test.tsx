import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUsers } from '../useUsers'
import * as localStorageUtils from '../../utils/localStorage'

// Mock the localStorage utilities
vi.mock('../../utils/localStorage', () => ({
  getUsers: vi.fn(),
  saveUser: vi.fn(),
  deleteUser: vi.fn(),
  getCurrentUser: vi.fn(),
  setCurrentUser: vi.fn(),
  isValidUser: vi.fn()
}))

const mockUser: localStorageUtils.User = {
  id: 'user1',
  name: 'Test User',
  createdAt: '2025-10-18T10:00:00Z'
}

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(localStorageUtils.getUsers).mockReturnValue([])
    vi.mocked(localStorageUtils.getCurrentUser).mockReturnValue(null)
    vi.mocked(localStorageUtils.isValidUser).mockReturnValue(true)
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useUsers())
    
    expect(result.current.users).toEqual([])
    expect(result.current.currentUser).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should load users and current user on mount', () => {
    const mockUsers = [mockUser]
    vi.mocked(localStorageUtils.getUsers).mockReturnValue(mockUsers)
    vi.mocked(localStorageUtils.getCurrentUser).mockReturnValue(mockUser)
    
    const { result } = renderHook(() => useUsers())
    
    expect(result.current.users).toEqual(mockUsers)
    expect(result.current.currentUser).toEqual(mockUser)
  })

  it('should add a new user successfully', async () => {
    vi.mocked(localStorageUtils.saveUser).mockReturnValue(true)
    
    const { result } = renderHook(() => useUsers())
    
    await act(async () => {
      const newUser = result.current.addUser('New User')
      expect(newUser).not.toBeNull()
      expect(newUser?.name).toBe('New User')
    })
    
    expect(localStorageUtils.saveUser).toHaveBeenCalled()
    expect(result.current.users).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('should handle adding user with empty name', async () => {
    const { result } = renderHook(() => useUsers())
    
    await act(async () => {
      const newUser = result.current.addUser('')
      expect(newUser).toBeNull()
    })
    
    expect(result.current.error).toBe('Nama tidak boleh kosong')
  })

  it('should handle adding duplicate user', async () => {
    vi.mocked(localStorageUtils.getUsers).mockReturnValue([mockUser])
    
    const { result } = renderHook(() => useUsers())
    
    await act(async () => {
      const newUser = result.current.addUser('Test User')
      expect(newUser).toBeNull()
    })
    
    expect(result.current.error).toBe('Nama pengguna sudah wujud')
  })

  it('should update user successfully', async () => {
    vi.mocked(localStorageUtils.saveUser).mockReturnValue(true)
    vi.mocked(localStorageUtils.getUsers).mockReturnValue([mockUser])
    
    const { result } = renderHook(() => useUsers())
    
    const updatedUser = { ...mockUser, name: 'Updated User' }
    
    await act(async () => {
      const success = result.current.updateUser(updatedUser)
      expect(success).toBe(true)
    })
    
    expect(localStorageUtils.saveUser).toHaveBeenCalledWith(updatedUser)
    expect(result.current.error).toBeNull()
  })

  it('should delete user successfully', async () => {
    vi.mocked(localStorageUtils.deleteUser).mockReturnValue(true)
    vi.mocked(localStorageUtils.getUsers).mockReturnValue([mockUser])
    vi.mocked(localStorageUtils.getCurrentUser).mockReturnValue(mockUser)
    
    const { result } = renderHook(() => useUsers())
    
    await act(async () => {
      const success = result.current.removeUser('user1')
      expect(success).toBe(true)
    })
    
    expect(localStorageUtils.deleteUser).toHaveBeenCalledWith('user1')
    expect(result.current.users).toHaveLength(0)
    expect(result.current.currentUser).toBeNull()
  })

  it('should select user successfully', async () => {
    vi.mocked(localStorageUtils.setCurrentUser).mockReturnValue(true)
    
    const { result } = renderHook(() => useUsers())
    
    await act(async () => {
      const success = result.current.selectUser(mockUser)
      expect(success).toBe(true)
    })
    
    expect(localStorageUtils.setCurrentUser).toHaveBeenCalledWith(mockUser)
    expect(result.current.currentUser).toEqual(mockUser)
  })

  it('should clear error', async () => {
    const { result } = renderHook(() => useUsers())
    
    // First set an error
    await act(async () => {
      result.current.addUser('')
    })
    
    expect(result.current.error).toBe('Nama tidak boleh kosong')
    
    // Then clear it
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('should handle localStorage errors', async () => {
    vi.mocked(localStorageUtils.getUsers).mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    const { result } = renderHook(() => useUsers())
    
    expect(result.current.error).toBe('Failed to load users data')
    expect(result.current.loading).toBe(false)
  })
})
