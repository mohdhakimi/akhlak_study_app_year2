/**
 * =============================================================================
 * ANSWER COMPONENT
 * =============================================================================
 * A reusable answer option component for quizzes and tests.
 * 
 * Features:
 * - Multiple answer types
 * - Selection states
 * - Bilingual support
 * - Accessibility features
 * - Custom styling support
 */

import React from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'

export interface AnswerProps {
  option: string
  optionIndex: number
  isSelected?: boolean
  isCorrect?: boolean
  isRevealed?: boolean
  onClick?: () => void
  disabled?: boolean
  enableBilingual?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

const Answer: React.FC<AnswerProps> = ({
  option,
  optionIndex,
  isSelected = false,
  isCorrect = false,
  isRevealed = false,
  onClick,
  disabled = false,
  enableBilingual = false,
  variant = 'default',
  className
}) => {
  const { formatText } = useBilingual()

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, D, etc.
  }

  const getStateClasses = () => {
    if (disabled) return 'opacity-50 cursor-not-allowed'
    if (isRevealed) {
      if (isCorrect) return 'bg-green-50 border-green-300 text-green-800'
      if (isSelected && !isCorrect) return 'bg-red-50 border-red-300 text-red-800'
      return 'bg-gray-50 border-gray-300 text-gray-600'
    }
    if (isSelected) return 'bg-primary-50 border-primary-300 text-primary-800'
    return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
  }

  const variantClasses = {
    default: 'p-4',
    compact: 'p-3',
    detailed: 'p-6'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        getStateClasses(),
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {/* Option Label */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          isRevealed && isCorrect && 'bg-green-500 text-white',
          isRevealed && isSelected && !isCorrect && 'bg-red-500 text-white',
          !isRevealed && isSelected && 'bg-primary-500 text-white',
          !isRevealed && !isSelected && 'bg-gray-200 text-gray-600'
        )}>
          {getOptionLabel(optionIndex)}
        </div>
        
        {/* Option Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {enableBilingual ? formatText(option) : option}
          </p>
        </div>
        
        {/* Status Icons */}
        {isRevealed && (
          <div className="flex-shrink-0">
            {isCorrect ? (
              <span className="text-green-500 text-lg">✓</span>
            ) : isSelected && !isCorrect ? (
              <span className="text-red-500 text-lg">✗</span>
            ) : null}
          </div>
        )}
      </div>
    </button>
  )
}

export default Answer
