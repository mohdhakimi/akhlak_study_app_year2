/**
 * =============================================================================
 * AUDIO MANAGEMENT UTILITY
 * =============================================================================
 * This module provides comprehensive audio management for the Akhlak Flashcard
 * application, including sound effects, music, and audio settings management.
 * 
 * Features:
 * - Synthetic sound generation using Web Audio API
 * - Persistent audio settings via localStorage
 * - Lazy initialization on user interaction
 * - Volume control and sound toggling
 * - Multiple sound effect types for different UI interactions
 */

// =============================================================================
// AUDIO TYPES AND INTERFACES
// =============================================================================

/**
 * Configuration settings for audio management
 * @interface AudioSettings
 */
export interface AudioSettings {
  /** Whether sound effects are enabled */
  soundEnabled: boolean
  /** Whether background music is enabled */
  musicEnabled: boolean
  /** Volume level (0.0 to 1.0) */
  volume: number
}

/**
 * Available sound effects in the application
 * @type SoundEffect
 */
export type SoundEffect = 
  | 'click'           // General click interactions
  | 'correct'         // Correct answer feedback
  | 'incorrect'       // Incorrect answer feedback
  | 'celebration'     // Achievement celebrations
  | 'notification'    // System notifications
  | 'pageTransition'  // Page navigation sounds
  | 'buttonHover'     // Button hover effects
  | 'quizComplete'    // Quiz completion sound
  | 'testComplete'    // Test completion sound

// =============================================================================
// AUDIO MANAGER CLASS
// =============================================================================

/**
 * Centralized audio management class for handling all audio operations
 * @class AudioManager
 */
class AudioManager {
  /** Current audio settings */
  private settings: AudioSettings
  /** Web Audio API context for sound generation */
  private audioContext: AudioContext | null = null
  /** Cache of pre-generated sound buffers */
  private sounds: Map<SoundEffect, AudioBuffer> = new Map()
  /** Whether the audio system has been initialized */
  private isInitialized = false

  /**
   * Creates a new AudioManager instance
   * Loads settings from localStorage on initialization
   */
  constructor() {
    this.settings = this.loadSettings()
  }

  /**
   * Loads audio settings from localStorage
   * @private
   * @returns {AudioSettings} The loaded settings or default values
   */
  private loadSettings(): AudioSettings {
    try {
      const stored = localStorage.getItem('audioSettings')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error)
    }
    
    // Return default settings if loading fails
    return {
      soundEnabled: true,
      musicEnabled: false,
      volume: 0.7
    }
  }

  /**
   * Saves current audio settings to localStorage
   * @private
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('audioSettings', JSON.stringify(this.settings))
    } catch (error) {
      console.warn('Failed to save audio settings:', error)
    }
  }

  /**
   * Initializes the audio system and loads all sound effects
   * @public
   * @returns {Promise<void>} Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Create audio context with fallback for webkit browsers
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      await this.loadSounds()
      this.isInitialized = true
    } catch (error) {
      console.warn('Failed to initialize audio context:', error)
    }
  }

  private async loadSounds(): Promise<void> {
    if (!this.audioContext) return

    // Generate synthetic sounds for now
    const soundGenerators: Record<SoundEffect, () => AudioBuffer> = {
      click: () => this.generateClickSound(),
      correct: () => this.generateCorrectSound(),
      incorrect: () => this.generateIncorrectSound(),
      celebration: () => this.generateCelebrationSound(),
      notification: () => this.generateNotificationSound(),
      pageTransition: () => this.generatePageTransitionSound(),
      buttonHover: () => this.generateButtonHoverSound(),
      quizComplete: () => this.generateQuizCompleteSound(),
      testComplete: () => this.generateTestCompleteSound()
    }

    for (const [effect, generator] of Object.entries(soundGenerators)) {
      try {
        const buffer = generator()
        this.sounds.set(effect as SoundEffect, buffer)
      } catch (error) {
        console.warn(`Failed to generate sound for ${effect}:`, error)
      }
    }
  }

  private generateClickSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.1 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20) * 0.3
    }
    
    return buffer
  }

  private generateCorrectSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.5 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const freq1 = 523.25 // C5
      const freq2 = 659.25 // E5
      const freq3 = 783.99 // G5
      data[i] = (
        Math.sin(2 * Math.PI * freq1 * t) * 0.3 +
        Math.sin(2 * Math.PI * freq2 * t) * 0.2 +
        Math.sin(2 * Math.PI * freq3 * t) * 0.1
      ) * Math.exp(-t * 3)
    }
    
    return buffer
  }

  private generateIncorrectSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.3 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      data[i] = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 5) * 0.4
    }
    
    return buffer
  }

  private generateCelebrationSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 1.0 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const melody = [
        { freq: 523.25, duration: 0.2 }, // C5
        { freq: 659.25, duration: 0.2 }, // E5
        { freq: 783.99, duration: 0.2 }, // G5
        { freq: 1046.50, duration: 0.4 } // C6
      ]
      
      let sample = 0
      let timeOffset = 0
      
      for (const note of melody) {
        if (t >= timeOffset && t < timeOffset + note.duration) {
          const noteTime = t - timeOffset
          sample += Math.sin(2 * Math.PI * note.freq * noteTime) * Math.exp(-noteTime * 2) * 0.3
        }
        timeOffset += note.duration
      }
      
      data[i] = sample
    }
    
    return buffer
  }

  private generateNotificationSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.4 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      data[i] = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 4) * 0.2
    }
    
    return buffer
  }

  private generatePageTransitionSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.2 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      data[i] = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 10) * 0.15
    }
    
    return buffer
  }

  private generateButtonHoverSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.05 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 30) * 0.1
    }
    
    return buffer
  }

  private generateQuizCompleteSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 0.8 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const melody = [
        { freq: 523.25, duration: 0.15 }, // C5
        { freq: 659.25, duration: 0.15 }, // E5
        { freq: 783.99, duration: 0.15 }, // G5
        { freq: 1046.50, duration: 0.35 } // C6
      ]
      
      let sample = 0
      let timeOffset = 0
      
      for (const note of melody) {
        if (t >= timeOffset && t < timeOffset + note.duration) {
          const noteTime = t - timeOffset
          sample += Math.sin(2 * Math.PI * note.freq * noteTime) * Math.exp(-noteTime * 1.5) * 0.25
        }
        timeOffset += note.duration
      }
      
      data[i] = sample
    }
    
    return buffer
  }

  private generateTestCompleteSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const buffer = this.audioContext.createBuffer(1, 1.2 * this.audioContext.sampleRate, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.audioContext.sampleRate
      const melody = [
        { freq: 523.25, duration: 0.2 }, // C5
        { freq: 659.25, duration: 0.2 }, // E5
        { freq: 783.99, duration: 0.2 }, // G5
        { freq: 1046.50, duration: 0.2 }, // C6
        { freq: 1318.51, duration: 0.4 } // E6
      ]
      
      let sample = 0
      let timeOffset = 0
      
      for (const note of melody) {
        if (t >= timeOffset && t < timeOffset + note.duration) {
          const noteTime = t - timeOffset
          sample += Math.sin(2 * Math.PI * note.freq * noteTime) * Math.exp(-noteTime * 1) * 0.3
        }
        timeOffset += note.duration
      }
      
      data[i] = sample
    }
    
    return buffer
  }

  /**
   * Plays a sound effect if audio is enabled
   * @public
   * @param {SoundEffect} effect - The sound effect to play
   * @returns {Promise<void>} Promise that resolves when sound starts playing
   */
  async playSound(effect: SoundEffect): Promise<void> {
    // Early return if audio is disabled or not initialized
    if (!this.settings.soundEnabled || !this.isInitialized || !this.audioContext) {
      return
    }

    try {
      const buffer = this.sounds.get(effect)
      if (!buffer) {
        console.warn(`Sound effect '${effect}' not found`)
        return
      }

      // Create audio source and gain node for volume control
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = this.settings.volume
      
      // Connect audio nodes and start playback
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } catch (error) {
      console.warn(`Failed to play sound '${effect}':`, error)
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.settings.soundEnabled = enabled
    this.saveSettings()
  }

  setMusicEnabled(enabled: boolean): void {
    this.settings.musicEnabled = enabled
    this.saveSettings()
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  isSoundEnabled(): boolean {
    return this.settings.soundEnabled
  }

  isMusicEnabled(): boolean {
    return this.settings.musicEnabled
  }

  getVolume(): number {
    return this.settings.volume
  }
}

// Create singleton instance
export const audioManager = new AudioManager()

// Initialize audio on first user interaction
let isInitialized = false
const initializeAudio = async () => {
  if (!isInitialized) {
    await audioManager.initialize()
    isInitialized = true
  }
}

// Auto-initialize on user interaction
document.addEventListener('click', initializeAudio, { once: true })
document.addEventListener('keydown', initializeAudio, { once: true })
document.addEventListener('touchstart', initializeAudio, { once: true })

// Export convenience functions
export const playSound = (effect: SoundEffect) => audioManager.playSound(effect)
export const setSoundEnabled = (enabled: boolean) => audioManager.setSoundEnabled(enabled)
export const setMusicEnabled = (enabled: boolean) => audioManager.setMusicEnabled(enabled)
export const setVolume = (volume: number) => audioManager.setVolume(volume)
export const getAudioSettings = () => audioManager.getSettings()
export const isSoundEnabled = () => audioManager.isSoundEnabled()
export const isMusicEnabled = () => audioManager.isMusicEnabled()
export const getVolume = () => audioManager.getVolume()
