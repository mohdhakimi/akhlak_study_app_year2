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

const AppContent: React.FC = () => {
  const {
    users,
    loading,
    error,
    addUser,
    selectUser,
    clearError,
    showUserSelectionModal,
    closeUserSelectionModal,
  } = useUserContext()

  const handleUserSelect = (user: any) => {
    selectUser(user)
  }

  const handleCreateUser = (name: string) => {
    return addUser(name)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-primary-600">{TEXT.LOADING}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/study" element={<StudyMode />} />
          <Route path="/quiz" element={<QuizMode />} />
          <Route path="/test" element={<TestMode />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

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
