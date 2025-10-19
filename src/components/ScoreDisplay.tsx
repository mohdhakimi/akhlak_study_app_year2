import React from 'react'
import { cn } from '../utils/cn'
import { formatScore, getMotivationalMessage } from '../constants/text'

export interface ScoreDisplayProps {
  score: number
  total: number
  showPercentage?: boolean
  showMotivation?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  total,
  showPercentage = true,
  showMotivation = true,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const getVariantClasses = () => {
    if (percentage >= 90)
      return 'text-success-600 bg-success-50 border-success-200'
    if (percentage >= 80)
      return 'text-primary-600 bg-primary-50 border-primary-200'
    if (percentage >= 70)
      return 'text-warning-600 bg-warning-50 border-warning-200'
    return 'text-danger-600 bg-danger-50 border-danger-200'
  }

  const sizeClasses = {
    sm: 'text-sm p-3',
    md: 'text-base p-4',
    lg: 'text-lg p-6',
  }

  const scoreSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  return (
    <div className={cn('text-center', className)}>
      {/* Score display */}
      <div
        className={cn(
          'inline-flex flex-col items-center justify-center rounded-xl border-2 font-bold',
          getVariantClasses(),
          sizeClasses[size]
        )}
      >
        <div className={cn('font-bold', scoreSizeClasses[size])}>
          {formatScore(score, total)}
        </div>
        {showPercentage && (
          <div className="text-sm opacity-80 mt-1">{percentage}% betul</div>
        )}
      </div>

      {/* Motivational message */}
      {showMotivation && (
        <div className="mt-4">
          <p
            className={cn(
              'font-medium',
              size === 'sm'
                ? 'text-sm'
                : size === 'lg'
                  ? 'text-lg'
                  : 'text-base',
              percentage >= 80
                ? 'text-success-600'
                : percentage >= 60
                  ? 'text-primary-600'
                  : 'text-gray-600'
            )}
          >
            {getMotivationalMessage(score, total)}
          </p>
        </div>
      )}
    </div>
  )
}

export default ScoreDisplay
