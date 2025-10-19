import React from 'react'
import { Question } from '../types'
import { useBilingual } from '../contexts/BilingualContext'
import AnswerOption from './AnswerOption'
import TrueFalseQuestion from './TrueFalseQuestion'
import FillBlankQuestion from './FillBlankQuestion'
import { shuffleQuizOptions } from '../utils/shuffleOptions'
import { cn } from '../utils/cn'

export interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: number | null | string
  correctAnswer: number
  isAnswered: boolean
  isRevealed: boolean
  onAnswerSelect: (answerIndex: number) => void
  onAnswerChange?: (answer: string) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  className?: string
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  correctAnswer,
  isAnswered,
  isRevealed,
  onAnswerSelect,
  onAnswerChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  className
}) => {
  const { formatText } = useBilingual()
  
  // Determine question type (default to MCQ for backward compatibility)
  const questionType = question.type || 'mcq'
  
  // Shuffle options on component mount or when question changes (only for MCQ)
  const { shuffledOptions, newCorrectIndex } = React.useMemo(() => {
    if (questionType === 'mcq') {
      return shuffleQuizOptions(question.options, correctAnswer)
    }
    return { shuffledOptions: question.options, newCorrectIndex: correctAnswer }
  }, [question.options, correctAnswer, questionType])

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      onAnswerSelect(answerIndex)
    }
  }

  const handleAnswerChange = (answer: string) => {
    if (onAnswerChange) {
      onAnswerChange(answer)
    }
  }

  const isCorrect = questionType === 'fill_blank' 
    ? selectedAnswer === question.correctText
    : selectedAnswer === newCorrectIndex
  const isIncorrect = selectedAnswer !== null && selectedAnswer !== newCorrectIndex && questionType !== 'fill_blank'

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-700">
            {formatText(`سوالن ${questionNumber} دري ${totalQuestions} | Soalan ${questionNumber} dari ${totalQuestions}`)}
          </h2>
          <div className="text-sm text-gray-500">
            {Math.round((questionNumber / totalQuestions) * 100)}% {formatText('سلساي | Selesai')}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Question Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {formatText(question.question)}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="p-6">
          {questionType === 'mcq' && (
            <div className="space-y-3">
              {shuffledOptions.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedAnswer === index}
                  isCorrect={index === newCorrectIndex}
                  isIncorrect={isIncorrect && selectedAnswer === index}
                  isRevealed={isRevealed}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                />
              ))}
            </div>
          )}
          
          {questionType === 'true_false' && (
            <TrueFalseQuestion
              question={question}
              selectedAnswer={selectedAnswer as number | null}
              onAnswerSelect={handleAnswerSelect}
              isRevealed={isRevealed}
              correctAnswer={newCorrectIndex}
            />
          )}
          
          {questionType === 'fill_blank' && (
            <FillBlankQuestion
              question={question}
              selectedAnswer={selectedAnswer as string}
              onAnswerChange={handleAnswerChange}
              isRevealed={isRevealed}
              correctText={question.correctText || ''}
            />
          )}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <>
                    <span className="text-2xl">🎉</span>
                    <span className="text-green-700 font-semibold">
                      {formatText('بتول! جوابن اندا تيڤت | Betul! Jawapan anda tepat.')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">💡</span>
                    <span className="text-red-700 font-semibold">
                      {questionType === 'fill_blank' 
                        ? formatText('تيدق تيڤت. جوابن يڠ بتول اداله | Tidak tepat. Jawapan yang betul adalah') + ` "${question.correctText}"`
                        : formatText('تيدق تيڤت. جوابن يڠ بتول اداله | Tidak tepat. Jawapan yang betul adalah') + ` ${String.fromCharCode(65 + newCorrectIndex)}.`
                      }
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                canGoPrevious
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              ← {formatText('سبلوم | Sebelum')}
            </button>

            <button
              onClick={onNext}
              disabled={!canGoNext || !isAnswered}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                canGoNext && isAnswered
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {questionNumber === totalQuestions 
                ? formatText('سلساي | Selesai') 
                : formatText('ستروسڽا | Seterusnya') + ' →'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
