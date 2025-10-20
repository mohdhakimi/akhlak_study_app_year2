/**
 * Haptic Feedback Utility
 * 
 * Provides haptic feedback for mobile devices to enhance user experience.
 * Uses the Vibration API when available, with fallbacks for different devices.
 * 
 * Features:
 * - Light, medium, and heavy haptic feedback
 * - Success, warning, and error feedback patterns
 * - Button press feedback
 * - Custom vibration patterns
 * - Graceful fallback for unsupported devices
 */

/**
 * Check if haptic feedback is supported on the current device
 * @returns boolean - true if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in navigator && navigator.vibrate !== undefined
}

/**
 * Check if the device is mobile
 * @returns boolean - true if device is mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Basic haptic feedback function
 * @param pattern - Vibration pattern (number or array of numbers)
 * @returns boolean - true if vibration was successful
 */
export const vibrate = (pattern: number | number[]): boolean => {
  if (!isHapticSupported() || !isMobileDevice()) {
    return false
  }

  try {
    return navigator.vibrate(pattern)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
    return false
  }
}

/**
 * Light haptic feedback (subtle tap)
 * Used for: button presses, small interactions
 */
export const hapticLight = (): boolean => {
  return vibrate(10)
}

/**
 * Medium haptic feedback (noticeable tap)
 * Used for: successful actions, confirmations
 */
export const hapticMedium = (): boolean => {
  return vibrate(20)
}

/**
 * Heavy haptic feedback (strong tap)
 * Used for: important actions, errors, warnings
 */
export const hapticHeavy = (): boolean => {
  return vibrate(50)
}

/**
 * Success haptic feedback pattern
 * Used for: successful completions, correct answers
 */
export const hapticSuccess = (): boolean => {
  return vibrate([50, 50, 50])
}

/**
 * Warning haptic feedback pattern
 * Used for: warnings, attention-grabbing events
 */
export const hapticWarning = (): boolean => {
  return vibrate([100, 50, 100])
}

/**
 * Error haptic feedback pattern
 * Used for: errors, incorrect answers, failures
 */
export const hapticError = (): boolean => {
  return vibrate([200, 100, 200])
}

/**
 * Button press haptic feedback
 * Used for: interactive elements, buttons, cards
 */
export const hapticButtonPress = (): boolean => {
  return hapticLight()
}

/**
 * Navigation haptic feedback
 * Used for: page transitions, menu selections
 */
export const hapticNavigation = (): boolean => {
  return hapticMedium()
}

/**
 * Quiz/Test feedback based on answer correctness
 * @param isCorrect - whether the answer is correct
 */
export const hapticAnswerFeedback = (isCorrect: boolean): boolean => {
  return isCorrect ? hapticSuccess() : hapticError()
}

/**
 * Custom haptic pattern
 * @param pattern - custom vibration pattern
 */
export const hapticCustom = (pattern: number[]): boolean => {
  return vibrate(pattern)
}

/**
 * Haptic feedback for different UI interactions
 */
export const HapticFeedback = {
  // Basic feedback types
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
  
  // Semantic feedback types
  success: hapticSuccess,
  warning: hapticWarning,
  error: hapticError,
  
  // UI interaction feedback
  buttonPress: hapticButtonPress,
  navigation: hapticNavigation,
  answerFeedback: hapticAnswerFeedback,
  
  // Custom feedback
  custom: hapticCustom,
  
  // Utility functions
  isSupported: isHapticSupported,
  isMobile: isMobileDevice
}

export default HapticFeedback
