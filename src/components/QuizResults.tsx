import React, { useEffect } from 'react'
import { Question } from '../types'
import Card from './Card'
import Button from './Button'
import { cn } from '../utils/cn'
import { useQuizAudio } from '../hooks/useAudio'
import { useBilingual } from '../contexts/BilingualContext'

export interface QuizResult {
  question: Question
  userAnswer: number | string
  correctAnswer: number
  isCorrect: boolean
  shuffledOptions: string[]
  newCorrectIndex: number
}

export interface QuizResultsProps {
  results: QuizResult[]
  score: number
  totalQuestions: number
  categoryName: string
  timeSpent?: number
  onRetake: () => void
  onBackToMenu: () => void
  onViewLeaderboard: () => void
  className?: string
}

const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  score,
  totalQuestions,
  categoryName,
  timeSpent,
  onRetake,
  onBackToMenu,
  onViewLeaderboard,
  className,
}) => {
  const { playQuizCompleteSound, playCelebrationSound } = useQuizAudio()
  const { formatText } = useBilingual()

  const percentage = Math.round((score / totalQuestions) * 100)
  const isPerfect = score === totalQuestions
  const isGood = percentage >= 80
  const isPassing = percentage >= 60

  // Play completion sound when component mounts
  useEffect(() => {
    playQuizCompleteSound()
    if (isPerfect) {
      // Play celebration sound for perfect score
      setTimeout(() => playCelebrationSound(), 1000)
    }
  }, [playQuizCompleteSound, playCelebrationSound, isPerfect])

  const getPerformanceMessage = () => {
    if (isPerfect) {
      return {
        message: formatText('سيمڤورنا! 🎉 | Sempurna! 🎉'),
        description: formatText(
          'اندا ميندافت مارکاه ڤنوه! تحنيه! | Anda mendapat markah penuh! Tahniah!'
        ),
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      }
    }
    if (isGood) {
      return {
        message: formatText('چميرلڠ! 🌟 | Cemerlang! 🌟'),
        description: formatText(
          'ڤرستاسي يڠ ساڠت بايق! | Prestasi yang sangat baik!'
        ),
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      }
    }
    if (isPassing) {
      return {
        message: formatText('باݢوس! 👍 | Bagus! 👍'),
        description: formatText(
          'ڤرستاسي يڠ ممواسکن! | Prestasi yang memuaskan!'
        ),
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      }
    }
    return {
      message: formatText('چوبا لاݢي! 💪 | Cuba Lagi! 💪'),
      description: formatText(
        'جڠن برڤوتس اسا، تروسکن بروسها! | Jangan berputus asa, teruskan berusaha!'
      ),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    }
  }

  const performance = getPerformanceMessage()

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('min-h-screen py-8', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formatText('کڤوتوسان کويز | Keputusan Kuiz')}
          </h1>
          <p className="text-lg text-gray-600">{formatText(categoryName)}</p>
        </div>

        {/* Score Card */}
        <Card
          className={cn('mb-8', performance.bgColor, performance.borderColor)}
        >
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">
              {isPerfect ? '🏆' : isGood ? '🌟' : isPassing ? '👍' : '💪'}
            </div>
            <h2 className={cn('text-3xl font-bold mb-2', performance.color)}>
              {performance.message}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {performance.description}
            </p>

            {/* Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">
                  {score}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600">
                  {formatText('مارکاه | Markah')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">
                  {formatText('ڤراتوسن | Peratusan')}
                </div>
              </div>
              {timeSpent && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800">
                    {formatTime(timeSpent)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatText('ماسا | Masa')}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onRetake}
                variant="primary"
                className="px-8 py-3"
              >
                {formatText('امبيل کويز لاݢي | Ambil Kuiz Lagi')}
              </Button>
              <Button
                onClick={onViewLeaderboard}
                variant="secondary"
                className="px-8 py-3"
              >
                {formatText('ليهت ڤان مارکاه | Lihat Papan Markah')}
              </Button>
              <Button
                onClick={onBackToMenu}
                variant="outline"
                className="px-8 py-3"
              >
                {formatText('کمبالي ک منو | Kembali ke Menu')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Detailed Review */}
        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              📋 {formatText('سمکن ترڤرينچي | Semakan Terperinci')}
            </h3>
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border-2',
                    result.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  )}
                >
                  <div className="flex items-start space-x-4">
                    {/* Question Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {formatText(result.question.question)}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2">
                        {result.shuffledOptions.map((option, optionIndex) => {
                          const isUserAnswer = optionIndex === result.userAnswer
                          const isCorrectAnswer =
                            optionIndex === result.newCorrectIndex
                          const letter = String.fromCharCode(65 + optionIndex)

                          return (
                            <div
                              key={optionIndex}
                              className={cn(
                                'flex items-center space-x-3 p-2 rounded',
                                isCorrectAnswer
                                  ? 'bg-green-100 border border-green-300'
                                  : isUserAnswer && !result.isCorrect
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-gray-50'
                              )}
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-semibold">
                                {letter}
                              </div>
                              <span className="text-sm">
                                {formatText(option)}
                              </span>
                              <div className="flex-shrink-0">
                                {isCorrectAnswer && '✅'}
                                {isUserAnswer && !result.isCorrect && '❌'}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Result Status */}
                      <div className="mt-3 flex items-center space-x-2">
                        {result.isCorrect ? (
                          <>
                            <span className="text-green-600 font-semibold">
                              ✓ {formatText('بتول | Betul')}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatText('جوابن اندا | Jawapan anda')}:{' '}
                              {typeof result.userAnswer === 'number'
                                ? String.fromCharCode(65 + result.userAnswer)
                                : result.userAnswer}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-red-600 font-semibold">
                              ✗ {formatText('ساله | Salah')}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatText('جوابن اندا | Jawapan anda')}:{' '}
                              {typeof result.userAnswer === 'number'
                                ? String.fromCharCode(65 + result.userAnswer)
                                : result.userAnswer}{' '}
                              |{formatText('جوابن بتول | Jawapan betul')}:{' '}
                              {String.fromCharCode(65 + result.newCorrectIndex)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default QuizResults
