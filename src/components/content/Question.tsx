/**
 * =============================================================================
 * QUESTION COMPONENT
 * =============================================================================
 * A reusable question display component for quizzes and tests.
 * 
 * Features:
 * - Question numbering
 * - Bilingual support
 * - Multiple question types
 * - Custom styling support
 */

import React from 'react'
import { cn } from '../../utils/cn'
import { useBilingual } from '../../contexts/BilingualContext'

export interface QuestionProps {
  question: string
  questionNumber?: number
  totalQuestions?: number
  type?: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay'
  enableBilingual?: boolean
  className?: string
  showNumber?: boolean
}

const Question: React.FC<QuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  type = 'multiple-choice',
  enableBilingual = false,
  className,
  showNumber = true
}) => {
  const { formatText } = useBilingual()

  const typeIcons = {
    'multiple-choice': '📝',
    'true-false': '✅',
    'fill-blank': '✏️',
    'essay': '📄'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Question Header */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-sm">
              {questionNumber}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{typeIcons[type]}</span>
            {showNumber && totalQuestions && (
              <span className="text-sm text-gray-500">
                Soalan {questionNumber} dari {totalQuestions}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {enableBilingual ? formatText(question) : question}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Question
