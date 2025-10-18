import React, { useEffect, useState } from 'react'
import { cn } from '../utils/cn'
import { usePageTransitionAudio } from '../hooks/useAudio'

export interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  enableSound?: boolean
  animation?: 'fade' | 'slide' | 'scale' | 'none'
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  enableSound = true,
  animation = 'fade'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { playTransitionSound } = usePageTransitionAudio()

  useEffect(() => {
    // Play transition sound
    if (enableSound) {
      playTransitionSound()
    }

    // Trigger animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [enableSound, playTransitionSound])

  const getAnimationClasses = () => {
    if (animation === 'none') return ''
    
    const baseClasses = 'transition-all duration-300 ease-in-out'
    
    switch (animation) {
      case 'fade':
        return cn(
          baseClasses,
          isVisible ? 'opacity-100' : 'opacity-0'
        )
      case 'slide':
        return cn(
          baseClasses,
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )
      case 'scale':
        return cn(
          baseClasses,
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )
      default:
        return baseClasses
    }
  }

  return (
    <div className={cn(getAnimationClasses(), className)}>
      {children}
    </div>
  )
}

export default PageTransition
