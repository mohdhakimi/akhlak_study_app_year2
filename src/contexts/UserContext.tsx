/**
 * User Context Provider - Global User State Management
 * 
 * This context provides global user state management throughout the application.
 * It handles user creation, selection, persistence, and modal state management.
 * 
 * Key features:
 * - Multi-user support with localStorage persistence
 * - Automatic user selection modal display for new users
 * - User CRUD operations (Create, Read, Update, Delete)
 * - Error handling and loading states
 * - Modal state management for user selection
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { User } from '../types'
import { useUsers } from '../hooks/useUsers'

/**
 * UserContextType Interface
 * 
 * Defines the shape of the user context value, including:
 * - User data: users list, current user, loading/error states
 * - User actions: CRUD operations for user management
 * - Modal state: User selection modal visibility and controls
 */
interface UserContextType {
  // User data
  users: User[]                    // Array of all registered users
  currentUser: User | null         // Currently selected user
  loading: boolean                 // Loading state for user operations
  error: string | null             // Error message for user operations

  // User actions
  addUser: (name: string) => User | null        // Create new user
  updateUser: (user: User) => boolean           // Update existing user
  removeUser: (userId: string) => boolean       // Delete user
  selectUser: (user: User | null) => boolean    // Select/switch user
  clearError: () => void                        // Clear error state

  // User selection modal state
  showUserSelectionModal: boolean               // Modal visibility state
  openUserSelectionModal: () => void            // Show user selection modal
  closeUserSelectionModal: () => void           // Hide user selection modal
}

// Create the context with undefined as default value
const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

/**
 * UserProvider Component
 * 
 * Provides user context to all child components. This component:
 * - Uses the useUsers hook for user data management
 * - Manages user selection modal state
 * - Auto-opens modal for new users
 * - Provides all user-related functions to child components
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Extract user management functions and state from useUsers hook
  const {
    users,                    // All registered users
    currentUser,              // Currently selected user
    loading,                  // Loading state
    error,                    // Error state
    addUser,                  // Create new user function
    updateUser,               // Update user function
    removeUser,               // Delete user function
    selectUser,               // Select user function
    clearError,               // Clear error function
  } = useUsers()

  // Local state for user selection modal visibility
  const [showUserSelectionModal, setShowUserSelectionModal] =
    React.useState(false)

  /**
   * Open the user selection modal
   * Called when user wants to switch users or create new user
   */
  const openUserSelectionModal = () => {
    setShowUserSelectionModal(true)
  }

  /**
   * Close the user selection modal
   * Also clears any error state when modal is closed
   */
  const closeUserSelectionModal = () => {
    setShowUserSelectionModal(false)
    clearError()
  }

  /**
   * Auto-open user selection modal for new users
   * 
   * This effect automatically shows the user selection modal when:
   * - App is not loading
   * - No current user is selected
   * - No users exist in the system
   * 
   * This ensures new users are prompted to create an account
   */
  React.useEffect(() => {
    if (!loading && !currentUser && users.length === 0) {
      setShowUserSelectionModal(true)
    }
  }, [loading, currentUser, users.length])

  // Create context value object with all user-related state and functions
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

/**
 * useUserContext Hook
 * 
 * Custom hook to access user context. This hook:
 * - Returns the user context value
 * - Throws an error if used outside of UserProvider
 * - Provides type safety for context usage
 * 
 * @returns UserContextType - The user context value
 * @throws Error if used outside of UserProvider
 */
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}

export default UserContext
