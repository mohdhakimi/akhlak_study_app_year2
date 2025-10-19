import React from 'react'
import { Question } from '../types'
import { useBilingual } from '../contexts/BilingualContext'
import { cn } from '../utils/cn'

interface TrueFalseQuestionProps {
  question: Question
  selectedAnswer: number | null
  onAnswerSelect: (answerIndex: number) => void
  isRevealed: boolean
  correctAnswer: number
  className?: string
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isRevealed,
  correctAnswer,
  className
}) => {
  const { formatText } = useBilingual()

  const trueFalseOptions = [
    formatText('بتول | Betul'),
    formatText('ساله | Salah')
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Question Text */}
      <div className="text-lg font-medium text-gray-800 mb-6">
        {formatText(question.question)}
      </div>

      {/* True/False Options */}
      <div className="space-y-3">
        {trueFalseOptions.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === correctAnswer
          const isWrong = isSelected && !isCorrect && isRevealed

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={isRevealed}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500',
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                isRevealed && isCorrect
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : '',
                isWrong
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : '',
                isRevealed && !isSelected && !isCorrect
                  ? 'border-gray-200 bg-gray-50 text-gray-500'
                  : ''
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold',
                    isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300',
                    isRevealed && isCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : '',
                    isWrong
                      ? 'border-red-500 bg-red-500 text-white'
                      : ''
                  )}>
                    {isSelected && '✓'}
                  </div>
                  <span className="text-lg font-medium">{option}</span>
                </div>
                {isRevealed && (
                  <div className="text-2xl">
                    {isCorrect && '✅'}
                    {isWrong && '❌'}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TrueFalseQuestion
