import React, { createContext, useContext, useState, ReactNode } from 'react'

export type BilingualMode = 'jawi' | 'rumi' | 'both'

interface BilingualContextType {
  mode: BilingualMode
  setMode: (mode: BilingualMode) => void
  cycleMode: () => void
  formatText: (text: string) => string
}

const BilingualContext = createContext<BilingualContextType | undefined>(
  undefined
)

interface BilingualProviderProps {
  children: ReactNode
}

export function BilingualProvider({ children }: BilingualProviderProps) {
  const [mode, setMode] = useState<BilingualMode>('both')

  const cycleMode = () => {
    setMode(prev => {
      switch (prev) {
        case 'jawi':
          return 'rumi'
        case 'rumi':
          return 'both'
        case 'both':
          return 'jawi'
        default:
          return 'both'
      }
    })
  }

  const formatText = (text: string): string => {
    if (!text || mode === 'both') {
      return text
    }

    // Split by | separator (Jawi | Rumi format)
    const parts = text.split(' | ')
    if (parts.length !== 2) {
      return text // Return as-is if not in expected format
    }

    const [jawi, rumi] = parts

    switch (mode) {
      case 'jawi':
        return jawi.trim()
      case 'rumi':
        return rumi.trim()
      default:
        return text
    }
  }

  return (
    <BilingualContext.Provider value={{ mode, setMode, cycleMode, formatText }}>
      {children}
    </BilingualContext.Provider>
  )
}

export function useBilingual() {
  const context = useContext(BilingualContext)
  if (context === undefined) {
    throw new Error('useBilingual must be used within a BilingualProvider')
  }
  return context
}
