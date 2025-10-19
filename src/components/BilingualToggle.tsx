import React from 'react'
import { useBilingual } from '../contexts/BilingualContext'

const BilingualToggle: React.FC = () => {
  const { mode, cycleMode } = useBilingual()

  const getModeText = () => {
    switch (mode) {
      case 'jawi':
        return 'جاوي | Jawi'
      case 'rumi':
        return 'رومي | Rumi'
      case 'both':
        return 'كيدوا-دوا | Both'
      default:
        return 'كيدوا-دوا | Both'
    }
  }

  return (
    <button
      onClick={cycleMode}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      title="Toggle between Jawi, Rumi, and Both languages"
    >
      <span className="mr-2">🌐</span>
      <span>{getModeText()}</span>
    </button>
  )
}

export default BilingualToggle
