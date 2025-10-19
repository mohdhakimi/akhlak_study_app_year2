import React, { useEffect, useState } from 'react'
import { cn } from '../utils/cn'
import Mascot from './Mascot'

export interface CelebrationMessageProps {
  score: number
  totalQuestions: number
  isPerfect?: boolean
  isExcellent?: boolean
  isGood?: boolean
  className?: string
  onAnimationComplete?: () => void
}

const CelebrationMessage: React.FC<CelebrationMessageProps> = ({
  score,
  totalQuestions,
  isPerfect = false,
  isExcellent = false,
  isGood = false,
  className,
  onAnimationComplete,
}) => {
  const [showMessage, setShowMessage] = useState(false)
  const percentage = Math.round((score / totalQuestions) * 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 500)

    const completeTimer = setTimeout(() => {
      onAnimationComplete?.()
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onAnimationComplete])

  const getMessage = () => {
    if (isPerfect) {
      return {
        title: 'Sempurna! 🏆',
        subtitle: 'Anda mendapat markah penuh!',
        message: 'Tahniah! Anda benar-benar hebat!',
        expression: 'celebrating' as const,
      }
    }

    if (isExcellent) {
      return {
        title: 'Cemerlang! 🌟',
        subtitle: `${percentage}% - Prestasi yang luar biasa!`,
        message: 'Anda menunjukkan pemahaman yang sangat baik!',
        expression: 'excited' as const,
      }
    }

    if (isGood) {
      return {
        title: 'Bagus! 👍',
        subtitle: `${percentage}% - Kerja yang baik!`,
        message: 'Teruskan usaha yang baik!',
        expression: 'happy' as const,
      }
    }

    return {
      title: 'Syabas! 🎉',
      subtitle: `${percentage}% - Anda telah mencuba!`,
      message: 'Teruskan belajar dan anda akan menjadi lebih baik!',
      expression: 'encouraging' as const,
    }
  }

  const messageData = getMessage()

  if (!showMessage) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        'animate-fade-in',
        className
      )}
    >
      <div
        className={cn(
          'bg-white rounded-2xl p-8 max-w-md w-full text-center',
          'shadow-2xl transform transition-all duration-500',
          'animate-scale-in'
        )}
      >
        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <Mascot
            expression={messageData.expression}
            size="lg"
            animated={true}
          />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 animate-bounce">
            {messageData.title}
          </h2>

          <p className="text-xl font-semibold text-primary-600">
            {messageData.subtitle}
          </p>

          <p className="text-gray-600 leading-relaxed">{messageData.message}</p>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 mt-6">
            <div className="text-2xl font-bold text-primary-700">
              {score} / {totalQuestions}
            </div>
            <div className="text-sm text-primary-600">Soalan yang betul</div>
          </div>
        </div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-2 h-2 rounded-full',
                i % 4 === 0
                  ? 'bg-yellow-400'
                  : i % 4 === 1
                    ? 'bg-pink-400'
                    : i % 4 === 2
                      ? 'bg-blue-400'
                      : 'bg-green-400',
                'animate-confetti'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CelebrationMessage
