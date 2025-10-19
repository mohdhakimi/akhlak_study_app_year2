import React from 'react'
import { StudyTopic } from '../types'
import { useBilingual } from '../contexts/BilingualContext'
import { TEXT } from '../constants/text'
import Card from './Card'
import Button from './Button'
import BackToMenuButton from './BackToMenuButton'
import { cn } from '../utils/cn'

export interface TopicSelectorProps {
  topics: StudyTopic[]
  onTopicSelect: (topic: StudyTopic) => void
  onBack: () => void
  loading?: boolean
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  onTopicSelect,
  onBack,
  loading = false,
}) => {
  const { formatText } = useBilingual()
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">{TEXT.LOADING}</span>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Tiada Topik Tersedia
        </h3>
        <p className="text-gray-600 mb-6">
          Maaf, tiada topik pembelajaran yang tersedia pada masa ini.
        </p>
        <BackToMenuButton
          onClick={onBack}
          variant="outline"
          size="md"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {TEXT.SELECT_TOPIC}
        </h1>
        <p className="text-lg text-gray-600">
          Pilih topik yang ingin anda pelajari
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map(topic => (
          <Card
            key={topic.id}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden"
            onClick={() => onTopicSelect(topic)}
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white opacity-10"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    📖
                  </div>
                  <div className="text-sm opacity-90">
                    {topic.notes.length} nota
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-100 transition-colors">
                  {formatText(topic.name)}
                </h3>

                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  {formatText(topic.description)}
                </p>

                <div className="flex items-center text-blue-100 text-sm">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Klik untuk mula belajar
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  )
}

export default TopicSelector
