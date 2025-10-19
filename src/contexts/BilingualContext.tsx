/**
 * Bilingual Context Provider - Language Display Management
 * 
 * This context manages the display mode for bilingual text throughout the application.
 * It supports switching between Jawi (Arabic script), Rumi (Latin script), and both.
 * 
 * Key features:
 * - Three display modes: 'jawi', 'rumi', 'both'
 * - Automatic text formatting based on selected mode
 * - Cycling through modes with a single function
 * - Support for "Jawi | Rumi" formatted text strings
 */

import React, { createContext, useContext, useState, ReactNode } from 'react'

/**
 * BilingualMode Type
 * 
 * Defines the available language display modes:
 * - 'jawi': Display only Jawi (Arabic script) text
 * - 'rumi': Display only Rumi (Latin script) text  
 * - 'both': Display both Jawi and Rumi text
 */
export type BilingualMode = 'jawi' | 'rumi' | 'both'

/**
 * BilingualContextType Interface
 * 
 * Defines the shape of the bilingual context value:
 * - mode: Current display mode
 * - setMode: Function to set specific mode
 * - cycleMode: Function to cycle through modes
 * - formatText: Function to format text based on current mode
 */
interface BilingualContextType {
  mode: BilingualMode                    // Current display mode
  setMode: (mode: BilingualMode) => void // Set specific mode
  cycleMode: () => void                  // Cycle through modes
  formatText: (text: string) => string   // Format text based on mode
}

// Create the context with undefined as default value
const BilingualContext = createContext<BilingualContextType | undefined>(
  undefined
)

interface BilingualProviderProps {
  children: ReactNode
}

/**
 * BilingualProvider Component
 * 
 * Provides bilingual context to all child components. This component:
 * - Manages the current display mode state
 * - Provides functions to change and cycle through modes
 * - Formats text based on the selected mode
 * - Defaults to 'both' mode to show both scripts
 */
export function BilingualProvider({ children }: BilingualProviderProps) {
  // State for current display mode, defaults to 'both' to show both scripts
  const [mode, setMode] = useState<BilingualMode>('both')

  /**
   * Cycle through display modes
   * 
   * Cycles through the modes in order: jawi → rumi → both → jawi
   * This provides a convenient way to toggle between different display options
   */
  const cycleMode = () => {
    setMode(prev => {
      switch (prev) {
        case 'jawi':
          return 'rumi'    // Jawi → Rumi
        case 'rumi':
          return 'both'    // Rumi → Both
        case 'both':
          return 'jawi'    // Both → Jawi
        default:
          return 'both'    // Fallback to both
      }
    })
  }

  /**
   * Format text based on current display mode
   * 
   * This function processes text strings that are formatted as "Jawi | Rumi"
   * and returns the appropriate portion based on the current mode.
   * 
   * @param text - The text to format (expected format: "Jawi text | Rumi text")
   * @returns string - The formatted text based on current mode
   */
  const formatText = (text: string): string => {
    // Return text as-is if no text or mode is 'both'
    if (!text || mode === 'both') {
      return text
    }

    // Split by | separator (Jawi | Rumi format)
    const parts = text.split(' | ')
    
    // Return as-is if not in expected "Jawi | Rumi" format
    if (parts.length !== 2) {
      return text
    }

    // Extract Jawi and Rumi parts
    const [jawi, rumi] = parts

    // Return appropriate part based on current mode
    switch (mode) {
      case 'jawi':
        return jawi.trim()    // Return only Jawi text
      case 'rumi':
        return rumi.trim()    // Return only Rumi text
      default:
        return text           // Fallback to original text
    }
  }

  return (
    <BilingualContext.Provider value={{ mode, setMode, cycleMode, formatText }}>
      {children}
    </BilingualContext.Provider>
  )
}

/**
 * useBilingual Hook
 * 
 * Custom hook to access bilingual context. This hook:
 * - Returns the bilingual context value
 * - Throws an error if used outside of BilingualProvider
 * - Provides type safety for context usage
 * 
 * @returns BilingualContextType - The bilingual context value
 * @throws Error if used outside of BilingualProvider
 */
export function useBilingual() {
  const context = useContext(BilingualContext)
  if (context === undefined) {
    throw new Error('useBilingual must be used within a BilingualProvider')
  }
  return context
}
