import React, { useState, useEffect } from 'react'
import { Question } from '../types'
import { useBilingual } from '../contexts/BilingualContext'
import { cn } from '../utils/cn'

interface FillBlankQuestionProps {
  question: Question
  selectedAnswer: string
  onAnswerChange: (answer: string) => void
  isRevealed: boolean
  correctText: string
  className?: string
}

const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerChange,
  isRevealed,
  correctText,
  className
}) => {
  const { formatText } = useBilingual()
  const [inputValue, setInputValue] = useState(selectedAnswer || '')

  useEffect(() => {
    setInputValue(selectedAnswer || '')
  }, [selectedAnswer])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onAnswerChange(value)
  }

  const isCorrect = selectedAnswer.toLowerCase().trim() === correctText.toLowerCase().trim()
  const isWrong = selectedAnswer && !isCorrect && isRevealed

  return (
    <div className={cn('space-y-4', className)}>
      {/* Question Text */}
      <div className="text-lg font-medium text-gray-800 mb-6">
        {formatText(question.question)}
      </div>

      {/* Fill in the blank input */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isRevealed}
            placeholder={formatText('توليس جوابن اندا د سني | Tulis jawapan anda di sini')}
            className={cn(
              'w-full p-4 text-lg border-2 rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              isRevealed && isCorrect
                ? 'border-green-500 bg-green-50 text-green-700'
                : '',
              isWrong
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            )}
          />
          {isRevealed && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl">
              {isCorrect && '✅'}
              {isWrong && '❌'}
            </div>
          )}
        </div>

        {/* Show correct answer when revealed */}
        {isRevealed && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium mb-2">
              {formatText('جوابن بتول | Jawapan betul')}:
            </div>
            <div className="text-lg text-blue-800 font-semibold">
              {formatText(correctText)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FillBlankQuestion
