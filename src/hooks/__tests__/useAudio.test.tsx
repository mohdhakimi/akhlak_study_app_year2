import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useAudio,
  useSoundEffect,
  useButtonSound,
  useQuizAudio,
  usePageTransitionAudio,
} from '../useAudio'
import * as audioUtils from '../../utils/audio'

// Create mock functions
const mockPlaySound = vi.fn()
const mockGetAudioSettings = vi.fn(() => ({
  soundEnabled: true,
  musicEnabled: false,
  volume: 0.7,
}))
const mockSetSoundEnabled = vi.fn()
const mockSetMusicEnabled = vi.fn()
const mockSetVolume = vi.fn()

// Mock the audio utils
vi.mock('../../utils/audio', () => ({
  playSound: mockPlaySound,
  getAudioSettings: mockGetAudioSettings,
  setSoundEnabled: mockSetSoundEnabled,
  setMusicEnabled: mockSetMusicEnabled,
  setVolume: mockSetVolume,
}))

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return audio settings and functions', () => {
    const { result } = renderHook(() => useAudio())

    expect(result.current.isSoundEnabled).toBe(true)
    expect(result.current.isMusicEnabled).toBe(false)
    expect(result.current.volume).toBe(0.7)
    expect(typeof result.current.playSound).toBe('function')
    expect(typeof result.current.toggleSound).toBe('function')
    expect(typeof result.current.toggleMusic).toBe('function')
    expect(typeof result.current.setVolumeLevel).toBe('function')
  })

  it('should call playSound when playSound is invoked', async () => {
    const { result } = renderHook(() => useAudio())

    await act(async () => {
      await result.current.playSound('click')
    })

    expect(mockPlaySound).toHaveBeenCalledWith('click')
  })

  it('should call setSoundEnabled when toggleSound is invoked', () => {
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.toggleSound()
    })

    expect(mockSetSoundEnabled).toHaveBeenCalledWith(false)
  })

  it('should call setMusicEnabled when toggleMusic is invoked', () => {
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.toggleMusic()
    })

    expect(mockSetMusicEnabled).toHaveBeenCalledWith(true)
  })

  it('should call setVolume when setVolumeLevel is invoked', () => {
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.setVolumeLevel(0.5)
    })

    expect(mockSetVolume).toHaveBeenCalledWith(0.5)
  })
})

describe('useSoundEffect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should play sound when trigger becomes true', () => {
    const { rerender } = renderHook(
      ({ trigger }) => useSoundEffect('click', trigger),
      { initialProps: { trigger: false } }
    )

    expect(mockPlaySound).not.toHaveBeenCalled()

    rerender({ trigger: true })

    expect(mockPlaySound).toHaveBeenCalledWith('click')
  })

  it('should not play sound when sound is disabled', () => {
    mockGetAudioSettings.mockReturnValue({
      soundEnabled: false,
      musicEnabled: false,
      volume: 0.7,
    })

    const { result } = renderHook(() => useSoundEffect('click', true))

    // Debug: check what was called
    console.log('playSound calls:', mockPlaySound.mock.calls)

    expect(mockPlaySound).not.toHaveBeenCalled()
  })
})

describe('useButtonSound', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the mock implementation
    mockGetAudioSettings.mockReturnValue({
      soundEnabled: true,
      musicEnabled: false,
      volume: 0.7,
    })
  })

  it('should return click and hover sound functions', () => {
    const { result } = renderHook(() => useButtonSound())

    expect(typeof result.current.playClickSound).toBe('function')
    expect(typeof result.current.playHoverSound).toBe('function')
  })

  it('should play click sound when playClickSound is called', () => {
    const { result } = renderHook(() => useButtonSound())

    act(() => {
      result.current.playClickSound()
    })

    console.log('playSound calls:', mockPlaySound.mock.calls)
    expect(mockPlaySound).toHaveBeenCalledWith('click')
  })

  it('should play hover sound when playHoverSound is called', () => {
    const { result } = renderHook(() => useButtonSound())

    act(() => {
      result.current.playHoverSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('buttonHover')
  })
})

describe('useQuizAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAudioSettings.mockReturnValue({
      soundEnabled: true,
      musicEnabled: false,
      volume: 0.7,
    })
  })

  it('should return quiz-specific sound functions', () => {
    const { result } = renderHook(() => useQuizAudio())

    expect(typeof result.current.playCorrectSound).toBe('function')
    expect(typeof result.current.playIncorrectSound).toBe('function')
    expect(typeof result.current.playQuizCompleteSound).toBe('function')
    expect(typeof result.current.playTestCompleteSound).toBe('function')
    expect(typeof result.current.playCelebrationSound).toBe('function')
  })

  it('should play correct sound when playCorrectSound is called', () => {
    const { result } = renderHook(() => useQuizAudio())

    act(() => {
      result.current.playCorrectSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('correct')
  })

  it('should play incorrect sound when playIncorrectSound is called', () => {
    const { result } = renderHook(() => useQuizAudio())

    act(() => {
      result.current.playIncorrectSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('incorrect')
  })

  it('should play quiz complete sound when playQuizCompleteSound is called', () => {
    const { result } = renderHook(() => useQuizAudio())

    act(() => {
      result.current.playQuizCompleteSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('quizComplete')
  })

  it('should play test complete sound when playTestCompleteSound is called', () => {
    const { result } = renderHook(() => useQuizAudio())

    act(() => {
      result.current.playTestCompleteSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('testComplete')
  })

  it('should play celebration sound when playCelebrationSound is called', () => {
    const { result } = renderHook(() => useQuizAudio())

    act(() => {
      result.current.playCelebrationSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('celebration')
  })
})

describe('usePageTransitionAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAudioSettings.mockReturnValue({
      soundEnabled: true,
      musicEnabled: false,
      volume: 0.7,
    })
  })

  it('should return page transition sound function', () => {
    const { result } = renderHook(() => usePageTransitionAudio())

    expect(typeof result.current.playTransitionSound).toBe('function')
  })

  it('should play transition sound when playTransitionSound is called', () => {
    const { result } = renderHook(() => usePageTransitionAudio())

    act(() => {
      result.current.playTransitionSound()
    })

    expect(mockPlaySound).toHaveBeenCalledWith('pageTransition')
  })
})
