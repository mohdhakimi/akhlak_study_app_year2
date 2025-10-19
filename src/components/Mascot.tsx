import React from 'react'
import { cn } from '../utils/cn'

export interface MascotProps {
  expression?: 'happy' | 'excited' | 'thinking' | 'encouraging' | 'celebrating'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

const Mascot: React.FC<MascotProps> = ({
  expression = 'happy',
  size = 'md',
  className,
  animated = true,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-12 h-12'
      case 'lg':
        return 'w-20 h-20'
      default:
        return 'w-16 h-16'
    }
  }

  const getExpressionEmoji = () => {
    switch (expression) {
      case 'excited':
        return '🤩'
      case 'thinking':
        return '🤔'
      case 'encouraging':
        return '😊'
      case 'celebrating':
        return '🎉'
      default:
        return '😊'
    }
  }

  const getAnimationClass = () => {
    if (!animated) return ''

    switch (expression) {
      case 'excited':
        return 'animate-bounce'
      case 'celebrating':
        return 'animate-pulse'
      case 'thinking':
        return 'animate-pulse'
      default:
        return 'hover:scale-110 transition-transform duration-200'
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        getSizeClasses(),
        getAnimationClass(),
        className
      )}
      role="img"
      aria-label={`Mascot dengan ekspresi ${expression}`}
    >
      <div className="text-4xl">{getExpressionEmoji()}</div>
    </div>
  )
}

export default Mascot
