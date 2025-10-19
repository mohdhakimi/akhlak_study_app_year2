import { useState, useEffect, useCallback } from 'react'
import { User } from '../types'
import {
  getUsers,
  saveUser,
  deleteUser,
  getCurrentUser,
  setCurrentUser,
  isValidUser,
} from '../utils/localStorage'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load users and current user from localStorage
  useEffect(() => {
    try {
      const loadedUsers = getUsers()
      const loadedCurrentUser = getCurrentUser()

      // Validate users data
      const validUsers = loadedUsers.filter(isValidUser)
      setUsers(validUsers)

      // Validate current user
      if (loadedCurrentUser && isValidUser(loadedCurrentUser)) {
        setCurrentUserState(loadedCurrentUser)
      } else {
        setCurrentUserState(null)
      }

      setError(null)
    } catch (err) {
      setError('Failed to load users data')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add a new user
  const addUser = useCallback(
    (name: string): User | null => {
      if (!name.trim()) {
        setError('Nama tidak boleh kosong')
        return null
      }

      // Check if user already exists
      const existingUser = users.find(
        u => u.name.toLowerCase() === name.toLowerCase().trim()
      )
      if (existingUser) {
        setError('Nama pengguna sudah wujud')
        return null
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        createdAt: new Date().toISOString(),
      }

      try {
        const success = saveUser(newUser)
        if (success) {
          setUsers(prev => [...prev, newUser])
          setError(null)
          return newUser
        } else {
          setError('Gagal menyimpan pengguna baru')
          return null
        }
      } catch (err) {
        setError('Gagal menyimpan pengguna baru')
        console.error('Error adding user:', err)
        return null
      }
    },
    [users]
  )

  // Update an existing user
  const updateUser = useCallback((user: User): boolean => {
    if (!isValidUser(user)) {
      setError('Data pengguna tidak sah')
      return false
    }

    try {
      const success = saveUser(user)
      if (success) {
        setUsers(prev => prev.map(u => (u.id === user.id ? user : u)))
        setError(null)
        return true
      } else {
        setError('Gagal mengemas kini pengguna')
        return false
      }
    } catch (err) {
      setError('Gagal mengemas kini pengguna')
      console.error('Error updating user:', err)
      return false
    }
  }, [])

  // Delete a user
  const removeUser = useCallback(
    (userId: string): boolean => {
      try {
        const success = deleteUser(userId)
        if (success) {
          setUsers(prev => prev.filter(u => u.id !== userId))

          // If current user is deleted, clear current user
          if (currentUser?.id === userId) {
            setCurrentUserState(null)
            setCurrentUser(null)
          }

          setError(null)
          return true
        } else {
          setError('Gagal memadam pengguna')
          return false
        }
      } catch (err) {
        setError('Gagal memadam pengguna')
        console.error('Error deleting user:', err)
        return false
      }
    },
    [currentUser]
  )

  // Set current user
  const selectUser = useCallback((user: User | null): boolean => {
    try {
      const success = setCurrentUser(user)
      if (success) {
        setCurrentUserState(user)
        setError(null)
        return true
      } else {
        setError('Gagal memilih pengguna')
        return false
      }
    } catch (err) {
      setError('Gagal memilih pengguna')
      console.error('Error selecting user:', err)
      return false
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    users,
    currentUser,
    loading,
    error,
    addUser,
    updateUser,
    removeUser,
    selectUser,
    clearError,
  }
}
