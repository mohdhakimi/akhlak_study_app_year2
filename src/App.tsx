/**
 * Main Application Component - Akhlak Tahun Dua KSRI
 * 
 * This is the root component that sets up the application structure with:
 * - React Router for navigation between different learning modes
 * - Context providers for global state management (User and Bilingual)
 * - User selection modal for multi-user support
 * - Loading states and error handling
 * 
 * The app supports 4 main learning modes:
 * 1. Study Mode (Mod Belajar) - Reading and reviewing content
 * 2. Quiz Mode (Mod Kuiz) - 10-question interactive quizzes
 * 3. Test Mode (Mod Ujian) - 30-question comprehensive tests
 * 4. Leaderboard (Papan Markah) - Score tracking and rankings
 */

import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { UserProvider, useUserContext } from './contexts/UserContext'
import { BilingualProvider } from './contexts/BilingualContext'
import UserSelectionModal from './components/UserSelectionModal'
import MainMenu from './pages/MainMenu'
import StudyMode from './pages/StudyMode'
import QuizMode from './pages/QuizMode'
import TestMode from './pages/TestMode'
import Leaderboard from './pages/Leaderboard'
import { TEXT } from './constants/text'
import './App.css'

/**
 * AppContent Component
 * 
 * The main content component that handles:
 * - User context state management
 * - Loading and error states
 * - Route configuration
 * - User selection modal display
 * 
 * This component is wrapped by context providers in the main App function
 * to ensure all child components have access to global state.
 */
const AppContent: React.FC = () => {
  // Extract user management functions and state from UserContext
  const {
    users,                    // List of all registered users
    loading,                  // Loading state for user data
    error,                    // Error state for user operations
    addUser,                  // Function to create new user
    selectUser,               // Function to select existing user
    clearError,               // Function to clear error state
    showUserSelectionModal,   // Boolean to show/hide user selection modal
    closeUserSelectionModal,  // Function to close user selection modal
  } = useUserContext()

  /**
   * Handle user selection from existing users
   * @param user - The selected user object
   */
  const handleUserSelect = (user: any) => {
    selectUser(user)
  }

  /**
   * Handle creation of new user
   * @param name - The name of the new user
   * @returns Promise<boolean> - Success status of user creation
   */
  const handleCreateUser = (name: string) => {
    return addUser(name)
  }

  // Show loading spinner while user data is being loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          {/* Animated loading spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-primary-600">{TEXT.LOADING}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main application router for navigation between different modes */}
      <Router>
        <Routes>
          {/* Main menu - entry point of the application */}
          <Route path="/" element={<MainMenu />} />
          
          {/* Study Mode - Interactive content reading and review */}
          <Route path="/study" element={<StudyMode />} />
          
          {/* Quiz Mode - 10-question interactive quizzes by topic */}
          <Route path="/quiz" element={<QuizMode />} />
          
          {/* Test Mode - 30-question comprehensive tests across all topics */}
          <Route path="/test" element={<TestMode />} />
          
          {/* Leaderboard - Score tracking and user rankings */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Catch-all route - redirect unknown paths to main menu */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* User Selection Modal - shown when no user is selected or user wants to switch */}
      <UserSelectionModal
        isOpen={showUserSelectionModal}
        onClose={closeUserSelectionModal}
        onUserSelect={handleUserSelect}
        onCreateUser={handleCreateUser}
        existingUsers={users}
        loading={loading}
        error={error}
        onClearError={clearError}
      />
    </>
  )
}

/**
 * Main App Component
 * 
 * Root component that provides context providers for:
 * - UserProvider: Manages user state, selection, and persistence
 * - BilingualProvider: Manages language switching between Jawi and Rumi
 * 
 * The component structure ensures that all child components have access
 * to global state without prop drilling.
 */
function App() {
  return (
    <UserProvider>
      <BilingualProvider>
        <AppContent />
      </BilingualProvider>
    </UserProvider>
  )
}

export default App
