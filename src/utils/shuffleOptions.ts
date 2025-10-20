/**
 * =============================================================================
 * SHUFFLE AND RANDOMIZATION UTILITIES
 * =============================================================================
 * This module provides utility functions for shuffling arrays, randomizing
 * quiz options, and selecting random subsets of data. These functions are
 * essential for creating varied and fair quiz experiences.
 *
 * Features:
 * - Fisher-Yates shuffle algorithm for unbiased randomization
 * - Quiz option shuffling with correct answer preservation
 * - Random subset selection for question pools
 * - Type-safe generic implementations
 */

// =============================================================================
// CORE SHUFFLING FUNCTIONS
// =============================================================================

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * This provides an unbiased shuffle with O(n) time complexity
 * @param array - The array to shuffle
 * @returns A new shuffled array (original array is not modified)
 * @example
 * const numbers = [1, 2, 3, 4, 5]
 * const shuffled = shuffleArray(numbers) // [3, 1, 5, 2, 4] (example)
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array
  const shuffled = [...array]

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

/**
 * Shuffles quiz answer options while preserving the correct answer position
 * This ensures that the correct answer is tracked through the shuffle process
 * @param options - Array of answer options to shuffle
 * @param correctIndex - Index of the correct answer in the original array
 * @returns Object containing shuffled options and the new correct answer index
 * @throws {Error} If correctIndex is out of bounds
 * @example
 * const options = ['A', 'B', 'C', 'D']
 * const result = shuffleQuizOptions(options, 2) // correct answer is 'C'
 * // result.shuffledOptions might be ['D', 'C', 'A', 'B']
 * // result.newCorrectIndex would be 1 (new position of 'C')
 */
export function shuffleQuizOptions<T>(
  options: T[],
  correctIndex: number
): { shuffledOptions: T[]; newCorrectIndex: number } {
  // Handle empty array case
  if (options.length === 0) {
    return { shuffledOptions: [], newCorrectIndex: -1 }
  }

  // Validate correct index bounds
  if (correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(
      `Invalid correct index: ${correctIndex}. Must be between 0 and ${options.length - 1}`
    )
  }

  // Create array of indices for shuffling
  const indices = Array.from({ length: options.length }, (_, i) => i)

  // Shuffle the indices to get new positions
  const shuffledIndices = shuffleArray(indices)

  // Find where the correct answer ended up after shuffling
  const newCorrectIndex = shuffledIndices.indexOf(correctIndex)

  // Map shuffled indices back to actual option values
  const shuffledOptions = shuffledIndices.map(index => options[index])

  return { shuffledOptions, newCorrectIndex }
}

/**
 * Generates a random number between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Selects a random subset of items from an array
 * @param array - Source array
 * @param count - Number of items to select
 * @returns Array of randomly selected items
 */
export function randomSelect<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return shuffleArray(array)
  }

  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

/**
 * Selects 4 random options from 7 (1 correct + 3 distractors)
 * @param options - Array of 7 options
 * @param correctIndex - Index of the correct answer
 * @returns Object with 4 selected options and new correct index
 */
export function selectQuizOptions(
  options: string[],
  correctIndex: number
): { selectedOptions: string[]; newCorrectIndex: number } {
  const totalOptions = options.length

  // Validate bounds
  if (totalOptions === 0) {
    return { selectedOptions: [], newCorrectIndex: -1 }
  }
  if (correctIndex < 0 || correctIndex >= totalOptions) {
    throw new Error('Invalid correct index')
  }

  // If there are 4 or fewer options, just shuffle all and remap correct index
  if (totalOptions <= 4) {
    const indices = Array.from({ length: totalOptions }, (_, i) => i)
    const shuffledIndices = shuffleArray(indices)
    const newCorrectIndex = shuffledIndices.indexOf(correctIndex)
    const selectedOptions = shuffledIndices.map(i => options[i])
    return { selectedOptions, newCorrectIndex }
  }

  // There are more than 4 options: pick 1 correct + 3 distractors
  const correctAnswer = options[correctIndex]
  const distractors = options.filter((_, idx) => idx !== correctIndex)
  const selectedDistractors = randomSelect(distractors, 3)
  const combined = [correctAnswer, ...selectedDistractors]
  const shuffled = shuffleArray(combined)
  const newCorrectIndex = shuffled.findIndex(opt => opt === correctAnswer)
  return { selectedOptions: shuffled, newCorrectIndex }
}
