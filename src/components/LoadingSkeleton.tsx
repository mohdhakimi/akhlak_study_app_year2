import React from 'react'
import { cn } from '../utils/cn'

export interface LoadingSkeletonProps {
  className?: string
  lines?: number
  height?: string
  width?: string
  rounded?: boolean
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  rounded = true
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gray-200',
            height,
            width,
            rounded ? 'rounded' : '',
            index < lines - 1 ? 'mb-2' : ''
          )}
        />
      ))}
    </div>
  )
}

export default LoadingSkeleton
