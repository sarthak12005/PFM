import React, { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [previewMode, setPreviewMode] = useState(false)

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: Sun,
      description: 'Clean and bright interface',
      colors: {
        primary: '#3B82F6',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1F2937'
      }
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
      colors: {
        primary: '#60A5FA',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB'
      }
    },
    {
      id: 'system',
      name: 'System',
      icon: Monitor,
      description: 'Follows your device settings',
      colors: {
        primary: '#8B5CF6',
        background: 'auto',
        surface: 'auto',
        text: 'auto'
      }
    }
  ]

  const colorSchemes = [
    { id: 'blue', name: 'Blue', color: '#3B82F6' },
    { id: 'purple', name: 'Purple', color: '#8B5CF6' },
    { id: 'green', name: 'Green', color: '#10B981' },
    { id: 'orange', name: 'Orange', color: '#F59E0B' },
    { id: 'red', name: 'Red', color: '#EF4444' },
    { id: 'pink', name: 'Pink', color: '#EC4899' }
  ]

  useEffect(() => {
    setSelectedTheme(currentTheme)
  }, [currentTheme])

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId)
    if (!previewMode) {
      onThemeChange(themeId)
      toast.success(`Switched to ${themes.find(t => t.id === themeId)?.name} theme`)
    }
  }

  const handlePreviewToggle = () => {
    if (previewMode) {
      // Exit preview mode - apply the selected theme
      onThemeChange(selectedTheme)
      toast.success('Theme applied successfully')
    } else {
      // Enter preview mode
      toast.info('Preview mode enabled - click themes to preview')
    }
    setPreviewMode(!previewMode)
  }

  const resetToDefault = () => {
    setSelectedTheme('light')
    onThemeChange('light')
    setPreviewMode(false)
    toast.success('Reset to default light theme')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Palette className="text-primary-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
            <p className="text-sm text-gray-500">Customize your interface appearance</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePreviewToggle}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              previewMode 
                ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {previewMode ? 'Apply' : 'Preview'}
          </button>
          
          <button
            onClick={resetToDefault}
            className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Theme Options */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-900">Theme Mode</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {themes.map((theme) => {
            const Icon = theme.icon
            const isSelected = selectedTheme === theme.id
            
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check size={16} className="text-primary-600" />
                  </div>
                )}
                
                <div className="flex items-center space-x-3 mb-2">
                  <Icon size={20} className={isSelected ? 'text-primary-600' : 'text-gray-600'} />
                  <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                    {theme.name}
                  </span>
                </div>
                
                <p className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                  {theme.description}
                </p>
                
                {/* Color Preview */}
                {theme.colors.background !== 'auto' && (
                  <div className="flex space-x-1 mt-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: theme.colors.background }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: theme.colors.surface }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Scheme Options */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Accent Color</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              className="group relative p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              onClick={() => toast.info('Color schemes coming soon!')}
            >
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: scheme.color }}
              />
              <span className="text-xs text-gray-600 block text-center">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {previewMode && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm text-yellow-800 font-medium">
              Preview Mode Active
            </span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Click "Apply" to save your theme selection or continue previewing other themes.
          </p>
        </div>
      )}
    </div>
  )
}

export default ThemeSwitcher
