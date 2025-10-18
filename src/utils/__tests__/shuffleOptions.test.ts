import { describe, it, expect, vi } from 'vitest'
import { shuffleArray, shuffleQuizOptions, randomBetween, randomSelect } from '../shuffleOptions'

// Mock Math.random to make tests deterministic
const mockMath = Object.create(global.Math)
mockMath.random = vi.fn(() => 0.5)
global.Math = mockMath

describe('shuffleOptions', () => {
  describe('shuffleArray', () => {
    it('should return a new array with same length', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled).not.toBe(original) // Should be a new array
    })

    it('should contain all original elements', () => {
      const original = ['a', 'b', 'c', 'd']
      const shuffled = shuffleArray(original)
      
      original.forEach(item => {
        expect(shuffled).toContain(item)
      })
    })

    it('should handle empty array', () => {
      const original: number[] = []
      const shuffled = shuffleArray(original)
      
      expect(shuffled).toEqual([])
    })

    it('should handle single element array', () => {
      const original = [42]
      const shuffled = shuffleArray(original)
      
      expect(shuffled).toEqual([42])
    })
  })

  describe('shuffleQuizOptions', () => {
    it('should shuffle options and return correct new index', () => {
      const options = ['Option A', 'Option B', 'Option C', 'Option D']
      const correctIndex = 1 // Option B is correct
      
      const result = shuffleQuizOptions(options, correctIndex)
      
      expect(result.shuffledOptions).toHaveLength(4)
      expect(result.shuffledOptions).toContain('Option A')
      expect(result.shuffledOptions).toContain('Option B')
      expect(result.shuffledOptions).toContain('Option C')
      expect(result.shuffledOptions).toContain('Option D')
      expect(result.newCorrectIndex).toBeGreaterThanOrEqual(0)
      expect(result.newCorrectIndex).toBeLessThan(4)
    })

    it('should preserve correct answer in shuffled options', () => {
      const options = ['Wrong 1', 'Correct', 'Wrong 2', 'Wrong 3']
      const correctIndex = 1
      
      const result = shuffleQuizOptions(options, correctIndex)
      
      expect(result.shuffledOptions[result.newCorrectIndex]).toBe('Correct')
    })

    it('should throw error for invalid correct index', () => {
      const options = ['A', 'B', 'C']
      const invalidIndex = 5
      
      expect(() => shuffleQuizOptions(options, invalidIndex)).toThrow('Invalid correct index')
    })

    it('should handle empty options array', () => {
      const options: string[] = []
      const correctIndex = 0
      
      const result = shuffleQuizOptions(options, correctIndex)
      
      expect(result.shuffledOptions).toEqual([])
      expect(result.newCorrectIndex).toBe(-1)
    })
  })

  describe('randomBetween', () => {
    it('should return number within range', () => {
      const result = randomBetween(1, 10)
      
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(10)
    })

    it('should handle same min and max', () => {
      const result = randomBetween(5, 5)
      
      expect(result).toBe(5)
    })

    it('should handle negative numbers', () => {
      const result = randomBetween(-10, -1)
      
      expect(result).toBeGreaterThanOrEqual(-10)
      expect(result).toBeLessThanOrEqual(-1)
    })
  })

  describe('randomSelect', () => {
    it('should return requested number of items', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const count = 3
      
      const result = randomSelect(array, count)
      
      expect(result).toHaveLength(count)
    })

    it('should return all items if count equals array length', () => {
      const array = [1, 2, 3]
      const count = 3
      
      const result = randomSelect(array, count)
      
      expect(result).toHaveLength(3)
      array.forEach(item => {
        expect(result).toContain(item)
      })
    })

    it('should return all items if count exceeds array length', () => {
      const array = [1, 2, 3]
      const count = 5
      
      const result = randomSelect(array, count)
      
      expect(result).toHaveLength(3)
      array.forEach(item => {
        expect(result).toContain(item)
      })
    })

    it('should handle empty array', () => {
      const array: number[] = []
      const count = 3
      
      const result = randomSelect(array, count)
      
      expect(result).toEqual([])
    })
  })
})
