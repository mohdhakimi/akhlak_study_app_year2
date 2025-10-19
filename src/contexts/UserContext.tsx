import React, { createContext, useContext, ReactNode } from 'react'
import { User } from '../types'
import { useUsers } from '../hooks/useUsers'

interface UserContextType {
  // User data
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null

  // User actions
  addUser: (name: string) => User | null
  updateUser: (user: User) => boolean
  removeUser: (userId: string) => boolean
  selectUser: (user: User | null) => boolean
  clearError: () => void

  // User selection modal state
  showUserSelectionModal: boolean
  openUserSelectionModal: () => void
  closeUserSelectionModal: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const {
    users,
    currentUser,
    loading,
    error,
    addUser,
    updateUser,
    removeUser,
    selectUser,
    clearError,
  } = useUsers()

  // User selection modal state
  const [showUserSelectionModal, setShowUserSelectionModal] =
    React.useState(false)

  const openUserSelectionModal = () => {
    setShowUserSelectionModal(true)
  }

  const closeUserSelectionModal = () => {
    setShowUserSelectionModal(false)
    clearError()
  }

  // Auto-open user selection modal if no current user
  React.useEffect(() => {
    if (!loading && !currentUser && users.length === 0) {
      setShowUserSelectionModal(true)
    }
  }, [loading, currentUser, users.length])

  const contextValue: UserContextType = {
    // User data
    users,
    currentUser,
    loading,
    error,

    // User actions
    addUser,
    updateUser,
    removeUser,
    selectUser,
    clearError,

    // User selection modal state
    showUserSelectionModal,
    openUserSelectionModal,
    closeUserSelectionModal,
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}

export default UserContext
