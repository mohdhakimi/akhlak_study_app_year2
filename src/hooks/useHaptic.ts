/**
 * Haptic Feedback Hook
 * 
 * Custom React hook for providing haptic feedback throughout the application.
 * Automatically handles device detection and provides easy-to-use feedback methods.
 * 
 * Features:
 * - Automatic mobile device detection
 * - Easy-to-use feedback methods
 * - Performance optimized with useCallback
 * - Graceful fallback for unsupported devices
 */

import { useCallback, useEffect, useState } from 'react'
import { HapticFeedback, isHapticSupported, isMobileDevice } from '../utils/haptic'

/**
 * Hook return type
 */
interface UseHapticReturn {
  // Feedback methods
  light: () => boolean
  medium: () => boolean
  heavy: () => boolean
  success: () => boolean
  warning: () => boolean
  error: () => boolean
  buttonPress: () => boolean
  navigation: () => boolean
  answerFeedback: (isCorrect: boolean) => boolean
  custom: (pattern: number[]) => boolean
  
  // Utility properties
  isSupported: boolean
  isMobile: boolean
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

/**
 * Custom hook for haptic feedback
 * @param enabled - whether haptic feedback is enabled (default: true)
 * @returns UseHapticReturn - haptic feedback methods and utilities
 */
export const useHaptic = (enabled: boolean = true): UseHapticReturn => {
  const [isSupported, setIsSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isEnabled, setIsEnabled] = useState(enabled)

  // Check device capabilities on mount
  useEffect(() => {
    setIsSupported(isHapticSupported())
    setIsMobile(isMobileDevice())
  }, [])

  // Memoized feedback methods for performance
  const light = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.light() : false
  }, [isEnabled, isSupported, isMobile])

  const medium = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.medium() : false
  }, [isEnabled, isSupported, isMobile])

  const heavy = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.heavy() : false
  }, [isEnabled, isSupported, isMobile])

  const success = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.success() : false
  }, [isEnabled, isSupported, isMobile])

  const warning = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.warning() : false
  }, [isEnabled, isSupported, isMobile])

  const error = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.error() : false
  }, [isEnabled, isSupported, isMobile])

  const buttonPress = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.buttonPress() : false
  }, [isEnabled, isSupported, isMobile])

  const navigation = useCallback(() => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.navigation() : false
  }, [isEnabled, isSupported, isMobile])

  const answerFeedback = useCallback((isCorrect: boolean) => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.answerFeedback(isCorrect) : false
  }, [isEnabled, isSupported, isMobile])

  const custom = useCallback((pattern: number[]) => {
    return isEnabled && isSupported && isMobile ? HapticFeedback.custom(pattern) : false
  }, [isEnabled, isSupported, isMobile])

  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled)
  }, [])

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    buttonPress,
    navigation,
    answerFeedback,
    custom,
    isSupported,
    isMobile,
    isEnabled,
    setEnabled
  }
}

export default useHaptic
