import { useState } from 'react'
import { motion } from 'framer-motion'
import './styles/SettingsPanel.css'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSettingsChange?: (settings: UserSettings) => void
}

export interface UserSettings {
  theme: 'cyberpunk' | 'minimal' | 'matrix'
  soundEnabled: boolean
  notificationsEnabled: boolean
  autoTrade: boolean
  riskLevel: 'low' | 'medium' | 'high'
  defaultTradeAmount: number
  tradeDuration: number
}

export default function SettingsPanel({ isOpen, onClose, onSettingsChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'cyberpunk',
    soundEnabled: true,
    notificationsEnabled: true,
    autoTrade: false,
    riskLevel: 'medium',
    defaultTradeAmount: 100,
    tradeDuration: 60,
  })

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="settings-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          {/* Theme Section */}
          <div className="setting-section">
            <h3 className="section-title">Appearance</h3>
            <div className="theme-options">
              <button
                type="button"
                className={`theme-option cyberpunk ${settings.theme === 'cyberpunk' ? 'active' : ''}`}
                onClick={() => updateSetting('theme', 'cyberpunk')}
              >
                Cyberpunk
              </button>
              <button
                type="button"
                className={`theme-option minimal ${settings.theme === 'minimal' ? 'active' : ''}`}
                onClick={() => updateSetting('theme', 'minimal')}
              >
                Minimal
              </button>
              <button
                type="button"
                className={`theme-option matrix ${settings.theme === 'matrix' ? 'active' : ''}`}
                onClick={() => updateSetting('theme', 'matrix')}
              >
                Matrix
              </button>
            </div>
          </div>

          {/* General Settings */}
          <div className="setting-section">
            <h3 className="section-title">General</h3>

            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-name">Sound Effects</span>
                <span className="setting-description">Play sounds for trades and notifications</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-name">Notifications</span>
                <span className="setting-description">Receive alerts for trade results</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Trading Settings */}
          <div className="setting-section">
            <h3 className="section-title">Trading Preferences</h3>

            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-name">Auto-Trade</span>
                <span className="setting-description">Automatically execute trades (demo mode)</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.autoTrade}
                  onChange={(e) => updateSetting('autoTrade', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item setting-item--stack">
              <div className="setting-label">
                <span className="setting-name">Default Trade Amount</span>
                <span className="setting-description">Your preferred starting trade amount</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={settings.defaultTradeAmount}
                  onChange={(e) => updateSetting('defaultTradeAmount', Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-value">${settings.defaultTradeAmount}</div>
              </div>
            </div>

            <div className="setting-item setting-item--stack">
              <div className="setting-label">
                <span className="setting-name">Trade Duration</span>
                <span className="setting-description">Default expiry time in seconds</span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={30}
                  value={settings.tradeDuration}
                  onChange={(e) => updateSetting('tradeDuration', Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-value">{settings.tradeDuration}s</div>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="setting-section">
            <h3 className="section-title">Risk Management</h3>
            <div className="risk-options">
              <button
                type="button"
                className={`risk-option low ${settings.riskLevel === 'low' ? 'active' : ''}`}
                onClick={() => updateSetting('riskLevel', 'low')}
              >
                Low
              </button>
              <button
                type="button"
                className={`risk-option medium ${settings.riskLevel === 'medium' ? 'active' : ''}`}
                onClick={() => updateSetting('riskLevel', 'medium')}
              >
                Medium
              </button>
              <button
                type="button"
                className={`risk-option high ${settings.riskLevel === 'high' ? 'active' : ''}`}
                onClick={() => updateSetting('riskLevel', 'high')}
              >
                High
              </button>
            </div>
          </div>

          <button type="button" className="save-btn" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

