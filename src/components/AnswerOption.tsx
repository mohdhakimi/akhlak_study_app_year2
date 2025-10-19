import React from 'react'
import { cn } from '../utils/cn'
import { useBilingual } from '../contexts/BilingualContext'
import { useQuizAudio } from '../hooks/useAudio'

export interface AnswerOptionProps {
  option: string
  index: number
  isSelected: boolean
  isCorrect: boolean
  isIncorrect: boolean
  isRevealed: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  index,
  isSelected,
  isCorrect,
  isIncorrect,
  isRevealed,
  onClick,
  disabled = false,
  className
}) => {
  const { formatText } = useBilingual()
  const { playCorrectSound, playIncorrectSound } = useQuizAudio()

  const handleClick = () => {
    if (!disabled) {
      // Play sound based on correctness (if revealed)
      if (isRevealed) {
        if (isCorrect) {
          playCorrectSound()
        } else if (isIncorrect) {
          playIncorrectSound()
        }
      }
      onClick()
    }
  }
  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index) // A, B, C, D
  }

  const getVariantStyles = () => {
    if (disabled || isRevealed) {
      if (isCorrect) {
        return 'bg-green-100 border-green-500 text-green-800 ring-2 ring-green-300'
      }
      if (isIncorrect) {
        return 'bg-red-100 border-red-500 text-red-800 ring-2 ring-red-300'
      }
      return 'bg-gray-100 border-gray-300 text-gray-600'
    }

    if (isSelected) {
      return 'bg-blue-100 border-blue-500 text-blue-800 ring-2 ring-blue-300'
    }

    return 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-300'
  }

  const getIcon = () => {
    if (disabled || isRevealed) {
      if (isCorrect) {
        return '✅'
      }
      if (isIncorrect) {
        return '❌'
      }
      return '○'
    }

    if (isSelected) {
      return '●'
    }

    return '○'
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed',
        getVariantStyles(),
        className
      )}
      aria-pressed={isSelected}
      aria-label={`Option ${getOptionLetter(index)}: ${option}`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-semibold">
          {getOptionLetter(index)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">{formatText(option)}</p>
        </div>
        <div className="flex-shrink-0 text-lg">
          {getIcon()}
        </div>
      </div>
    </button>
  )
}

export default AnswerOption
