/**
 * Utility functions for shuffling and randomizing quiz options
 */

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Shuffles quiz answer options while preserving the correct answer
 * @param options - Array of answer options
 * @param correctIndex - Index of the correct answer
 * @returns Object with shuffled options and new correct index
 */
export function shuffleQuizOptions<T>(
  options: T[],
  correctIndex: number
): { shuffledOptions: T[]; newCorrectIndex: number } {
  if (options.length === 0) {
    return { shuffledOptions: [], newCorrectIndex: -1 }
  }

  if (correctIndex < 0 || correctIndex >= options.length) {
    throw new Error('Invalid correct index')
  }

  // Create array of indices
  const indices = Array.from({ length: options.length }, (_, i) => i)
  
  // Shuffle the indices
  const shuffledIndices = shuffleArray(indices)
  
  // Find the new position of the correct answer
  const newCorrectIndex = shuffledIndices.indexOf(correctIndex)
  
  // Create shuffled options array
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
