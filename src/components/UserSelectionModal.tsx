import React, { useState, useEffect } from 'react'
import { User } from '../types'
import { TEXT } from '../constants/text'
import Modal from './Modal'
import Button from './Button'
import Card from './Card'
import { cn } from '../utils/cn'

export interface UserSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onUserSelect: (user: User) => void
  onCreateUser: (name: string) => User | null
  existingUsers: User[]
  loading?: boolean
  error?: string | null
  onClearError?: () => void
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  isOpen,
  onClose,
  onUserSelect,
  onCreateUser,
  existingUsers,
  loading = false,
  error = null,
  onClearError,
}) => {
  const [newUserName, setNewUserName] = useState('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Clear form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewUserName('')
      setShowCreateForm(false)
      setValidationError(null)
      onClearError?.()
    }
  }, [isOpen, onClearError])

  const handleCreateUser = async () => {
    const trimmedName = newUserName.trim()

    // Validation
    if (!trimmedName) {
      setValidationError(TEXT.NAME_REQUIRED)
      return
    }

    if (trimmedName.length < 2) {
      setValidationError(TEXT.NAME_TOO_SHORT)
      return
    }

    // Check if user already exists
    const userExists = existingUsers.some(
      user => user.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (userExists) {
      setValidationError(TEXT.NAME_ALREADY_EXISTS)
      return
    }

    setIsCreatingUser(true)
    setValidationError(null)

    try {
      const newUser = onCreateUser(trimmedName)
      if (newUser) {
        // Success - select the new user
        onUserSelect(newUser)
        onClose()
      }
    } catch (err) {
      console.error('Error creating user:', err)
    } finally {
      setIsCreatingUser(false)
    }
  }

  const handleUserSelect = (user: User) => {
    onUserSelect(user)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreatingUser) {
      handleCreateUser()
    }
  }

  const displayError = error || validationError

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={TEXT.SELECT_USER}
      size="lg"
      closeOnOverlayClick={false}
    >
      <div className="space-y-6">
        {/* Error Display */}
        {displayError && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-danger-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-danger-800">{displayError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Existing Users List */}
        {existingUsers.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {TEXT.SELECT_USER}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {existingUsers.map(user => (
                <Card
                  key={user.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ms-MY')}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create New User Section */}
        <div className="border-t border-gray-200 pt-6">
          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              fullWidth
              className="mb-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {TEXT.CREATE_NEW_USER}
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {TEXT.CREATE_NEW_USER}
              </h3>

              <div>
                <label
                  htmlFor="user-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {TEXT.USER_NAME}
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={TEXT.ENTER_YOUR_NAME}
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    displayError && 'border-danger-300 focus:ring-danger-500'
                  )}
                  disabled={isCreatingUser}
                  autoFocus
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleCreateUser}
                  loading={isCreatingUser}
                  disabled={!newUserName.trim() || isCreatingUser}
                  className="flex-1"
                >
                  {TEXT.CREATE_NEW_USER}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewUserName('')
                    setValidationError(null)
                  }}
                  variant="secondary"
                  disabled={isCreatingUser}
                >
                  {TEXT.CANCEL}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">{TEXT.LOADING}</span>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default UserSelectionModal
