import React from 'react'
import { UserProvider, useUserContext } from './contexts/UserContext'
import UserSelectionModal from './components/UserSelectionModal'
import Layout from './components/Layout'
import Button from './components/Button'
import { TEXT } from './constants/text'
import './App.css'

const AppContent: React.FC = () => {
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
      <Layout
        title={TEXT.APP_TITLE}
        subtitle={TEXT.APP_SUBTITLE}
        currentUser={currentUser?.name}
        onUserClick={openUserSelectionModal}
        showUser={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {currentUser ? `${TEXT.WELCOME}, ${currentUser.name}!` : TEXT.WELCOME}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentUser 
                  ? 'Aplikasi ini sedang dalam pembangunan. Fasa 2 telah selesai!'
                  : 'Aplikasi ini sedang dalam pembangunan. Fasa 2 telah selesai!'
                }
              </p>
              <div className="space-y-3">
                <Button
                  onClick={openUserSelectionModal}
                  variant="outline"
                  fullWidth
                >
                  {currentUser ? TEXT.SWITCH_USER : TEXT.SELECT_USER}
                </Button>
                {currentUser && (
                  <Button
                    onClick={() => selectUser(null)}
                    variant="secondary"
                    fullWidth
                  >
                    Log Keluar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>

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
      <AppContent />
    </UserProvider>
  )
}

export default App
