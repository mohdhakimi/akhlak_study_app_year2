import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStudyMode } from '../useStudyMode'
import { StudyTopic } from '../../types'

// Mock data
const mockTopic: StudyTopic = {
  id: 'topic-1',
  name: 'Akhlak Terpuji',
  description: 'Test topic',
  notes: [
    { id: 'note-1', title: 'Note 1', content: 'Content 1', order: 1 },
    { id: 'note-2', title: 'Note 2', content: 'Content 2', order: 2 },
    { id: 'note-3', title: 'Note 3', content: 'Content 3', order: 3 }
  ]
}

describe('useStudyMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useStudyMode())
    
    expect(result.current.currentTopic).toBeNull()
    expect(result.current.currentNoteIndex).toBe(0)
    expect(result.current.isStudying).toBe(false)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.currentNote).toBeNull()
    expect(result.current.canGoNext).toBe(false)
    expect(result.current.canGoPrevious).toBe(false)
    expect(result.current.totalNotes).toBe(0)
    expect(result.current.progress).toBe(0)
  })

  it('starts studying when topic is selected', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    expect(result.current.currentTopic).toBe(mockTopic)
    expect(result.current.currentNoteIndex).toBe(0)
    expect(result.current.isStudying).toBe(true)
    expect(result.current.currentNote).toBe(mockTopic.notes[0])
    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(false)
    expect(result.current.totalNotes).toBe(3)
    expect(result.current.progress).toBeCloseTo(33.33, 1)
  })

  it('navigates to next note', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    act(() => {
      result.current.actions.goToNext()
    })
    
    expect(result.current.currentNoteIndex).toBe(1)
    expect(result.current.currentNote).toBe(mockTopic.notes[1])
    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(true)
    expect(result.current.progress).toBeCloseTo(66.67, 1)
  })

  it('navigates to previous note', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    act(() => {
      result.current.actions.goToNext()
    })
    
    act(() => {
      result.current.actions.goToPrevious()
    })
    
    expect(result.current.currentNoteIndex).toBe(0)
    expect(result.current.currentNote).toBe(mockTopic.notes[0])
    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(false)
  })

  it('does not go beyond last note', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    // Go to last note
    act(() => {
      result.current.actions.goToNext()
    })
    
    act(() => {
      result.current.actions.goToNext()
    })
    
    expect(result.current.currentNoteIndex).toBe(2)
    expect(result.current.canGoNext).toBe(false)
    
    // Try to go beyond
    act(() => {
      result.current.actions.goToNext()
    })
    
    expect(result.current.currentNoteIndex).toBe(2)
  })

  it('does not go before first note', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    expect(result.current.currentNoteIndex).toBe(0)
    expect(result.current.canGoPrevious).toBe(false)
    
    // Try to go before first
    act(() => {
      result.current.actions.goToPrevious()
    })
    
    expect(result.current.currentNoteIndex).toBe(0)
  })

  it('resets study state', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    act(() => {
      result.current.actions.goToNext()
    })
    
    act(() => {
      result.current.actions.resetStudy()
    })
    
    expect(result.current.currentTopic).toBeNull()
    expect(result.current.currentNoteIndex).toBe(0)
    expect(result.current.isStudying).toBe(false)
    expect(result.current.currentNote).toBeNull()
  })

  it('sets error state', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.setError('Test error')
    })
    
    expect(result.current.error).toBe('Test error')
  })

  it('sets loading state', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.setLoading(true)
    })
    
    expect(result.current.loading).toBe(true)
  })

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useStudyMode())
    
    act(() => {
      result.current.actions.startStudying(mockTopic)
    })
    
    // First note (index 0)
    expect(result.current.progress).toBeCloseTo(33.33, 1)
    
    act(() => {
      result.current.actions.goToNext()
    })
    
    // Second note (index 1)
    expect(result.current.progress).toBeCloseTo(66.67, 1)
    
    act(() => {
      result.current.actions.goToNext()
    })
    
    // Third note (index 2)
    expect(result.current.progress).toBeCloseTo(100, 1)
  })
})
