/**
 * =============================================================================
 * ANALYTICS LOGIN COMPONENT
 * =============================================================================
 * A password-protected login component for accessing the analytics dashboard.
 * 
 * Features:
 * - Password authentication
 * - Session management
 * - Error handling
 * - Bilingual support
 * - Responsive design
 */

import React, { useState } from 'react'
import { useBilingual } from '../../contexts/BilingualContext'
import Card from '../Card'
import Button from '../Button'
import Input from '../ui/Input'
import Alert from '../ui/Alert'

export interface AnalyticsLoginProps {
  onLogin: (password: string) => boolean
  onCancel: () => void
  className?: string
}

const AnalyticsLogin: React.FC<AnalyticsLoginProps> = ({
  onLogin,
  onCancel,
  className
}) => {
  const { formatText } = useBilingual()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const isValid = onLogin(password)
      if (!isValid) {
        setError('Invalid password. Please try again.')
        setPassword('')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setPassword('')
    setError('')
    onCancel()
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {formatText('Analytics Access | الوصول للتحليلات')}
          </h1>
          <p className="text-gray-600 mt-2">
            {formatText('Enter password to access analytics dashboard | أدخل كلمة المرور للوصول إلى لوحة التحليلات')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {formatText('Password | كلمة المرور')}
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={formatText('Enter password | أدخل كلمة المرور')}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && (
            <Alert variant="error" message={error} className="text-sm" />
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !password.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {formatText('Verifying... | جاري التحقق...')}
                </div>
              ) : (
                formatText('Access Analytics | الوصول للتحليلات')
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              {formatText('Cancel | إلغاء')}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {formatText('This area is restricted to authorized personnel only | هذه المنطقة مخصصة للموظفين المصرح لهم فقط')}
          </p>
        </div>
      </Card>
    </div>
  )
}

export default AnalyticsLogin
