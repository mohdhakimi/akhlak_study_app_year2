import { useState, useCallback } from 'react'
import { StudyTopic, StudyNote } from '../types'

export interface StudyModeState {
  currentTopic: StudyTopic | null
  currentNoteIndex: number
  isStudying: boolean
  loading: boolean
  error: string | null
}

export interface StudyModeActions {
  startStudying: (topic: StudyTopic) => void
  goToNext: () => void
  goToPrevious: () => void
  resetStudy: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

export function useStudyMode() {
  const [state, setState] = useState<StudyModeState>({
    currentTopic: null,
    currentNoteIndex: 0,
    isStudying: false,
    loading: false,
    error: null,
  })

  const startStudying = useCallback((topic: StudyTopic) => {
    setState(prev => ({
      ...prev,
      currentTopic: topic,
      currentNoteIndex: 0,
      isStudying: true,
      error: null,
    }))
  }, [])

  const goToNext = useCallback(() => {
    setState(prev => {
      if (!prev.currentTopic) return prev

      const maxIndex = prev.currentTopic.notes.length - 1
      if (prev.currentNoteIndex < maxIndex) {
        return {
          ...prev,
          currentNoteIndex: prev.currentNoteIndex + 1,
        }
      }
      return prev
    })
  }, [])

  const goToPrevious = useCallback(() => {
    setState(prev => {
      if (prev.currentNoteIndex > 0) {
        return {
          ...prev,
          currentNoteIndex: prev.currentNoteIndex - 1,
        }
      }
      return prev
    })
  }, [])

  const resetStudy = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTopic: null,
      currentNoteIndex: 0,
      isStudying: false,
      error: null,
    }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  // Computed values
  const currentNote = state.currentTopic?.notes[state.currentNoteIndex] || null
  const canGoNext = state.currentTopic
    ? state.currentNoteIndex < state.currentTopic.notes.length - 1
    : false
  const canGoPrevious = state.currentNoteIndex > 0
  const totalNotes = state.currentTopic?.notes.length || 0
  const progress =
    totalNotes > 0 ? ((state.currentNoteIndex + 1) / totalNotes) * 100 : 0

  return {
    ...state,
    currentNote,
    canGoNext,
    canGoPrevious,
    totalNotes,
    progress,
    actions: {
      startStudying,
      goToNext,
      goToPrevious,
      resetStudy,
      setError,
      setLoading,
    },
  }
}
