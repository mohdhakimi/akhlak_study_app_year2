import React, { useState, useEffect } from 'react'
import {
  getAudioSettings,
  setSoundEnabled,
  setMusicEnabled,
  setVolume,
} from '../utils/audio'
import Button from './Button'
import Card from './Card'
import { cn } from '../utils/cn'

export interface SoundSettingsProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const SoundSettings: React.FC<SoundSettingsProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const [settings, setSettings] = useState(getAudioSettings())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSettings(getAudioSettings())
    }
  }, [isOpen])

  const handleSoundToggle = async () => {
    setIsLoading(true)
    try {
      const newValue = !settings.soundEnabled
      setSoundEnabled(newValue)
      setSettings(prev => ({ ...prev, soundEnabled: newValue }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleMusicToggle = async () => {
    setIsLoading(true)
    try {
      const newValue = !settings.musicEnabled
      setMusicEnabled(newValue)
      setSettings(prev => ({ ...prev, musicEnabled: newValue }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVolumeChange = (volume: number) => {
    setVolume(volume)
    setSettings(prev => ({ ...prev, volume }))
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black bg-opacity-50 transition-opacity duration-300',
        className
      )}
    >
      <Card className="w-full max-w-md p-6 transform transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tetapan Audio</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-6">
          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Bunyi Efek</h3>
              <p className="text-sm text-gray-600">
                Bunyi untuk klik butang dan maklum balas
              </p>
            </div>
            <Button
              onClick={handleSoundToggle}
              disabled={isLoading}
              variant={settings.soundEnabled ? 'primary' : 'outline'}
              size="sm"
              className="min-w-[80px]"
            >
              {settings.soundEnabled ? 'Aktif' : 'Tidak Aktif'}
            </Button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Muzik Latar</h3>
              <p className="text-sm text-gray-600">
                Muzik latar belakang (akan datang)
              </p>
            </div>
            <Button
              onClick={handleMusicToggle}
              disabled={isLoading || true} // Disabled for now
              variant={settings.musicEnabled ? 'primary' : 'outline'}
              size="sm"
              className="min-w-[80px] opacity-50"
            >
              {settings.musicEnabled ? 'Aktif' : 'Tidak Aktif'}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Kelantangan</h3>
              <p className="text-sm text-gray-600">
                {Math.round(settings.volume * 100)}%
              </p>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.volume * 100}%, #e5e7eb ${settings.volume * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Senyap</span>
                <span>Maksimum</span>
              </div>
            </div>
          </div>

          {/* Audio Test */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Uji Bunyi
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() =>
                  import('../utils/audio').then(m => m.playSound('click'))
                }
                variant="outline"
                size="sm"
                disabled={!settings.soundEnabled}
              >
                Klik
              </Button>
              <Button
                onClick={() =>
                  import('../utils/audio').then(m => m.playSound('correct'))
                }
                variant="outline"
                size="sm"
                disabled={!settings.soundEnabled}
              >
                Betul
              </Button>
              <Button
                onClick={() =>
                  import('../utils/audio').then(m => m.playSound('incorrect'))
                }
                variant="outline"
                size="sm"
                disabled={!settings.soundEnabled}
              >
                Salah
              </Button>
              <Button
                onClick={() =>
                  import('../utils/audio').then(m => m.playSound('celebration'))
                }
                variant="outline"
                size="sm"
                disabled={!settings.soundEnabled}
              >
                Perayaan
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button onClick={onClose} variant="primary" className="w-full">
              Simpan & Tutup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SoundSettings
