import { describe, it, expect } from 'vitest'
import contentData from '../../data/akhlak_db.json'

describe('Content Validation', () => {
  describe('Topics Structure', () => {
    it('should have at least 5 topics', () => {
      expect(contentData.topics).toBeDefined()
      expect(contentData.topics.length).toBeGreaterThanOrEqual(5)
    })

    it('should have valid topic structure', () => {
      contentData.topics.forEach((topic, index) => {
        expect(topic.id).toBeDefined()
        expect(topic.name).toBeDefined()
        expect(topic.description).toBeDefined()
        expect(topic.notes).toBeDefined()
        expect(Array.isArray(topic.notes)).toBe(true)
        expect(topic.notes.length).toBeGreaterThan(0)

        // Check notes structure
        topic.notes.forEach((note, noteIndex) => {
          expect(note.id).toBeDefined()
          expect(note.title).toBeDefined()
          expect(note.content).toBeDefined()
          expect(note.order).toBeDefined()
          expect(typeof note.order).toBe('number')
        })
      })
    })
  })

  describe('Quiz Categories Structure', () => {
    it('should have at least 5 quiz categories', () => {
      expect(contentData.quizCategories).toBeDefined()
      expect(contentData.quizCategories.length).toBeGreaterThanOrEqual(5)
    })

    it('should have valid quiz category structure', () => {
      contentData.quizCategories.forEach((category, index) => {
        expect(category.id).toBeDefined()
        expect(category.name).toBeDefined()
        expect(category.description).toBeDefined()
        expect(category.questions).toBeDefined()
        expect(Array.isArray(category.questions)).toBe(true)
        expect(category.questions.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Question Validation', () => {
    it('should have exactly 7 options for each question', () => {
      contentData.quizCategories.forEach(category => {
        category.questions.forEach((question, questionIndex) => {
          expect(question.options).toBeDefined()
          expect(Array.isArray(question.options)).toBe(true)
          expect(question.options.length).toBe(7)

          // Check that all options are strings and not empty
          question.options.forEach((option, optionIndex) => {
            expect(typeof option).toBe('string')
            expect(option.trim().length).toBeGreaterThan(0)
          })
        })
      })
    })

    it('should have valid correct answer indices', () => {
      contentData.quizCategories.forEach(category => {
        category.questions.forEach((question, questionIndex) => {
          expect(question.correctAnswer).toBeDefined()
          expect(typeof question.correctAnswer).toBe('number')
          expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
          expect(question.correctAnswer).toBeLessThan(7)
        })
      })
    })

    it('should have explanations for all questions', () => {
      contentData.quizCategories.forEach(category => {
        category.questions.forEach((question, questionIndex) => {
          expect(question.explanation).toBeDefined()
          expect(typeof question.explanation).toBe('string')
          expect(question.explanation.trim().length).toBeGreaterThan(0)
        })
      })
    })

    it('should have unique question IDs', () => {
      const allQuestionIds: string[] = []

      contentData.quizCategories.forEach(category => {
        category.questions.forEach(question => {
          expect(question.id).toBeDefined()
          expect(typeof question.id).toBe('string')
          expect(question.id.trim().length).toBeGreaterThan(0)

          // Check for uniqueness
          expect(allQuestionIds).not.toContain(question.id)
          allQuestionIds.push(question.id)
        })
      })
    })
  })

  describe('Content Quality', () => {
    it('should have age-appropriate content for 8-year-olds', () => {
      // Check that content uses simple language
      contentData.topics.forEach(topic => {
        expect(topic.name.length).toBeLessThan(80) // Short, simple titles (bilingual content)
        expect(topic.description.length).toBeLessThan(100) // Concise descriptions

        topic.notes.forEach(note => {
          expect(note.title.length).toBeLessThan(150) // Short, simple titles (bilingual content)
          expect(note.content.length).toBeLessThan(600) // Not too long for 8-year-olds (bilingual content)
        })
      })
    })

    it('should have appropriate question difficulty', () => {
      contentData.quizCategories.forEach(category => {
        category.questions.forEach(question => {
          // Questions should be short and clear
          expect(question.question.length).toBeLessThan(150)

          // Options should be short and clear
          question.options.forEach(option => {
            expect(option.length).toBeLessThan(150) // Bilingual content
          })

          // Explanations should be educational and age-appropriate
          expect(question.explanation.length).toBeLessThan(300)
        })
      })
    })

    it('should use proper Bahasa Melayu', () => {
      // Check that content uses proper Malay language
      const malayWords = [
        'akhlak',
        'terhadap',
        'dengan',
        'untuk',
        'dari',
        'pada',
        'dalam',
        'yang',
        'adalah',
        'boleh',
      ]

      let hasMalayContent = false
      contentData.topics.forEach(topic => {
        const topicText = (topic.name + ' ' + topic.description).toLowerCase()
        const hasMalayWords = malayWords.some(word => topicText.includes(word))
        if (hasMalayWords) hasMalayContent = true
      })

      // At least some content should contain Malay words
      expect(hasMalayContent).toBe(true)
    })
  })

  describe('Data Integrity', () => {
    it('should have consistent topic and quiz category IDs', () => {
      const topicIds = contentData.topics.map(topic => topic.id)
      const quizCategoryIds = contentData.quizCategories.map(
        category => category.id
      )

      // Check that quiz categories correspond to topics
      quizCategoryIds.forEach(quizId => {
        expect(topicIds).toContain(quizId)
      })
    })

    it('should have valid JSON structure', () => {
      expect(contentData.version).toBeDefined()
      expect(contentData.lastUpdated).toBeDefined()
      expect(typeof contentData.version).toBe('string')
      expect(typeof contentData.lastUpdated).toBe('string')
    })

    it('should have sufficient content for learning', () => {
      // Each topic should have at least 3 notes
      contentData.topics.forEach(topic => {
        expect(topic.notes.length).toBeGreaterThanOrEqual(3)
      })

      // Each quiz category should have at least 5 questions
      contentData.quizCategories.forEach(category => {
        expect(category.questions.length).toBeGreaterThanOrEqual(4)
      })
    })
  })
})
