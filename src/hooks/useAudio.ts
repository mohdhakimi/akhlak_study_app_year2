import { useEffect, useCallback } from 'react'
import {
  playSound,
  getAudioSettings,
  setSoundEnabled,
  setMusicEnabled,
  setVolume,
  type SoundEffect,
} from '../utils/audio'

export interface UseAudioReturn {
  playSound: (effect: SoundEffect) => Promise<void>
  isSoundEnabled: boolean
  isMusicEnabled: boolean
  volume: number
  toggleSound: () => void
  toggleMusic: () => void
  setVolumeLevel: (volume: number) => void
  settings: ReturnType<typeof getAudioSettings>
}

export const useAudio = (): UseAudioReturn => {
  const settings = getAudioSettings()

  const playSoundEffect = useCallback(async (effect: SoundEffect) => {
    await playSound(effect)
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled(!settings.soundEnabled)
  }, [settings.soundEnabled])

  const toggleMusic = useCallback(() => {
    setMusicEnabled(!settings.musicEnabled)
  }, [settings.musicEnabled])

  const setVolumeLevel = useCallback((volume: number) => {
    setVolume(volume)
  }, [])

  return {
    playSound: playSoundEffect,
    isSoundEnabled: settings.soundEnabled,
    isMusicEnabled: settings.musicEnabled,
    volume: settings.volume,
    toggleSound,
    toggleMusic,
    setVolumeLevel,
    settings,
  }
}

// Hook for playing sounds on specific events
export const useSoundEffect = (effect: SoundEffect, trigger: boolean) => {
  const { playSound, isSoundEnabled } = useAudio()

  useEffect(() => {
    if (trigger && isSoundEnabled) {
      playSound(effect)
    }
  }, [trigger, effect, playSound, isSoundEnabled])
}

// Hook for button click sounds
export const useButtonSound = () => {
  const { playSound, isSoundEnabled } = useAudio()

  const playClickSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('click')
    }
  }, [playSound, isSoundEnabled])

  const playHoverSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('buttonHover')
    }
  }, [playSound, isSoundEnabled])

  return {
    playClickSound,
    playHoverSound,
  }
}

// Hook for quiz/test sounds
export const useQuizAudio = () => {
  const { playSound, isSoundEnabled } = useAudio()

  const playCorrectSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('correct')
    }
  }, [playSound, isSoundEnabled])

  const playIncorrectSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('incorrect')
    }
  }, [playSound, isSoundEnabled])

  const playQuizCompleteSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('quizComplete')
    }
  }, [playSound, isSoundEnabled])

  const playTestCompleteSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('testComplete')
    }
  }, [playSound, isSoundEnabled])

  const playCelebrationSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('celebration')
    }
  }, [playSound, isSoundEnabled])

  return {
    playCorrectSound,
    playIncorrectSound,
    playQuizCompleteSound,
    playTestCompleteSound,
    playCelebrationSound,
  }
}

// Hook for page transition sounds
export const usePageTransitionAudio = () => {
  const { playSound, isSoundEnabled } = useAudio()

  const playTransitionSound = useCallback(() => {
    if (isSoundEnabled) {
      playSound('pageTransition')
    }
  }, [playSound, isSoundEnabled])

  return {
    playTransitionSound,
  }
}
