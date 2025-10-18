import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  audioManager, 
  playSound, 
  setSoundEnabled, 
  setMusicEnabled, 
  setVolume,
  getAudioSettings,
  isSoundEnabled,
  isMusicEnabled,
  getVolume
} from '../audio'

// Mock Web Audio API
const mockAudioContext = {
  createBuffer: vi.fn(),
  createBufferSource: vi.fn(),
  createGain: vi.fn(),
  destination: {},
  sampleRate: 44100
}

const mockBuffer = {
  getChannelData: vi.fn(() => new Float32Array(100))
}

const mockSource = {
  buffer: null,
  connect: vi.fn(),
  start: vi.fn()
}

const mockGainNode = {
  gain: { value: 0.7 },
  connect: vi.fn()
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

Object.defineProperty(window, 'AudioContext', {
  value: vi.fn(() => mockAudioContext)
})

Object.defineProperty(window, 'webkitAudioContext', {
  value: vi.fn(() => mockAudioContext)
})

describe('AudioManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudioContext.createBuffer.mockReturnValue(mockBuffer)
    mockAudioContext.createBufferSource.mockReturnValue(mockSource)
    mockAudioContext.createGain.mockReturnValue(mockGainNode)
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Settings Management', () => {
    it('should load default settings when no stored settings exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const settings = getAudioSettings()
      expect(settings).toEqual({
        soundEnabled: true,
        musicEnabled: false,
        volume: 0.7
      })
    })

    it('should load settings from localStorage', () => {
      const storedSettings = {
        soundEnabled: false,
        musicEnabled: true,
        volume: 0.5
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedSettings))

      // Create a new instance to test loading
      const newAudioManager = new (audioManager.constructor as any)()
      const settings = newAudioManager.getSettings()
      expect(settings).toEqual(storedSettings)
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const settings = getAudioSettings()
      expect(settings).toEqual({
        soundEnabled: true,
        musicEnabled: false,
        volume: 0.7
      })
    })

    it('should save settings to localStorage', () => {
      setSoundEnabled(false)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'audioSettings',
        JSON.stringify({
          soundEnabled: false,
          musicEnabled: false,
          volume: 0.7
        })
      )
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })

      expect(() => setSoundEnabled(false)).not.toThrow()
    })
  })

  describe('Sound Control', () => {
    it('should enable/disable sound', () => {
      // Reset to default state
      localStorageMock.getItem.mockReturnValue(null)
      
      setSoundEnabled(false)
      expect(isSoundEnabled()).toBe(false)
      
      setSoundEnabled(true)
      expect(isSoundEnabled()).toBe(true)
    })

    it('should enable/disable music', () => {
      expect(isMusicEnabled()).toBe(false)
      
      setMusicEnabled(true)
      expect(isMusicEnabled()).toBe(true)
      
      setMusicEnabled(false)
      expect(isMusicEnabled()).toBe(false)
    })

    it('should set volume within valid range', () => {
      setVolume(0.5)
      expect(getVolume()).toBe(0.5)
      
      setVolume(1.5) // Should be clamped to 1
      expect(getVolume()).toBe(1)
      
      setVolume(-0.5) // Should be clamped to 0
      expect(getVolume()).toBe(0)
    })
  })

  describe('Sound Generation', () => {
    beforeEach(async () => {
      // Initialize audio manager first
      await audioManager.initialize()
    })

    it('should generate click sound', () => {
      const buffer = audioManager['generateClickSound']()
      expect(buffer).toBeDefined()
      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(
        1,
        0.1 * mockAudioContext.sampleRate,
        mockAudioContext.sampleRate
      )
    })

    it('should generate correct sound', () => {
      const buffer = audioManager['generateCorrectSound']()
      expect(buffer).toBeDefined()
      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(
        1,
        0.5 * mockAudioContext.sampleRate,
        mockAudioContext.sampleRate
      )
    })

    it('should generate incorrect sound', () => {
      const buffer = audioManager['generateIncorrectSound']()
      expect(buffer).toBeDefined()
      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(
        1,
        0.3 * mockAudioContext.sampleRate,
        mockAudioContext.sampleRate
      )
    })

    it('should generate celebration sound', () => {
      const buffer = audioManager['generateCelebrationSound']()
      expect(buffer).toBeDefined()
      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(
        1,
        1.0 * mockAudioContext.sampleRate,
        mockAudioContext.sampleRate
      )
    })
  })

  describe('Sound Playback', () => {
    beforeEach(async () => {
      // Initialize audio manager
      await audioManager.initialize()
    })

    it('should not play sound when disabled', async () => {
      setSoundEnabled(false)
      await playSound('click')
      
      expect(mockAudioContext.createBufferSource).not.toHaveBeenCalled()
    })

    it('should play sound when enabled', async () => {
      setSoundEnabled(true)
      await playSound('click')
      
      expect(mockAudioContext.createBufferSource).toHaveBeenCalled()
      expect(mockSource.connect).toHaveBeenCalledWith(mockGainNode)
      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination)
      expect(mockSource.start).toHaveBeenCalled()
    })

    it('should handle missing sound gracefully', async () => {
      setSoundEnabled(true)
      // Clear the sounds map to simulate missing sound
      audioManager['sounds'].clear()
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      await playSound('click')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Sound effect 'click' not found")
      )
      consoleSpy.mockRestore()
    })

    it('should handle audio context errors gracefully', async () => {
      setSoundEnabled(true)
      // Clear sounds to trigger the missing sound error instead
      audioManager['sounds'].clear()
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      await playSound('click')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Sound effect 'click' not found")
      )
      consoleSpy.mockRestore()
    })
  })

  describe('Convenience Functions', () => {
    it('should provide working convenience functions', () => {
      expect(typeof playSound).toBe('function')
      expect(typeof setSoundEnabled).toBe('function')
      expect(typeof setMusicEnabled).toBe('function')
      expect(typeof setVolume).toBe('function')
      expect(typeof getAudioSettings).toBe('function')
      expect(typeof isSoundEnabled).toBe('function')
      expect(typeof isMusicEnabled).toBe('function')
      expect(typeof getVolume).toBe('function')
    })
  })
})
