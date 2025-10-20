import React from 'react'
import { StudyNote } from '../types'
import { useBilingual } from '../contexts/BilingualContext'
import { TEXT } from '../constants/text'
import Card from './Card'
import Button from './Button'
import BackToMenuButton from './BackToMenuButton'
import { cn } from '../utils/cn'

export interface StudyCardProps {
  note: StudyNote
  currentIndex: number
  totalNotes: number
  onNext: () => void
  onPrevious: () => void
  onBack: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

const StudyCard: React.FC<StudyCardProps> = ({
  note,
  currentIndex,
  totalNotes,
  onNext,
  onPrevious,
  onBack,
  canGoNext,
  canGoPrevious,
}) => {
  const { formatText, formatTextWithStyling } = useBilingual()
  // Format content with proper line breaks
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />
      }

      // Format the line through bilingual context for logic
      const formattedLine = formatText(line)

      // Check if line starts with a number or bullet point
      if (/^\d+\./.test(formattedLine.trim())) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              {formattedLine.match(/^\d+/)?.[0]}
            </span>
            <span className="text-gray-700 leading-relaxed">
              {formatTextWithStyling(line.replace(/^\d+\.\s*/, ''))}
            </span>
          </div>
        )
      }

      if (/^•/.test(formattedLine.trim())) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mr-3 mt-3"></span>
            <span className="text-gray-700 leading-relaxed">
              {formatTextWithStyling(line.replace(/^•\s*/, ''))}
            </span>
          </div>
        )
      }

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-3">
          {formatTextWithStyling(line)}
        </p>
      )
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {TEXT.PROGRESS}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {currentIndex + 1} {TEXT.OF} {totalNotes}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalNotes) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content Card */}
      <Card className="mb-6">
        <div className="p-8">
          {/* Note Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {formatTextWithStyling(note.title)}
            </h2>
            <div className="w-16 h-1 bg-primary-500 rounded-full mx-auto"></div>
          </div>

          {/* Note Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(formatText(note.content))}
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          className={cn(
            'min-w-[140px]',
            !canGoPrevious && 'opacity-50 cursor-not-allowed'
          )}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {TEXT.PREVIOUS}
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="primary"
          className={cn(
            'min-w-[140px]',
            !canGoNext && 'opacity-50 cursor-not-allowed'
          )}
        >
          {TEXT.NEXT}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>

      {/* Completion Message */}
      {!canGoNext && (
        <div className="mt-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {TEXT.TOPIC_COMPLETE}
            </h3>
            <p className="text-green-700">
              Syabas! Anda telah selesai mempelajari topik ini. Teruskan dengan
              topik lain atau kembali ke menu utama.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyCard
