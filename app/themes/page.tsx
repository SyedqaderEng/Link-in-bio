'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Check, Palette, Type, Sparkles, Save, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Theme {
  id: string
  name: string
  slug: string
  description: string | null
  config: any
  isPremium: boolean
}

interface CustomTheme {
  backgroundColor: string
  backgroundGradient: string
  backgroundType: 'solid' | 'gradient' | 'image'
  backgroundImage: string
  buttonColor: string
  buttonStyle: 'rounded' | 'square' | 'pill'
  buttonAnimation: 'none' | 'bounce' | 'slide' | 'glow'
  textColor: string
  fontFamily: string
  cardBackground: string
  accentColor: string
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    backgroundColor: '#0a0a0a',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundType: 'gradient',
    backgroundImage: '',
    buttonColor: '#3b82f6',
    buttonStyle: 'rounded',
    buttonAnimation: 'none',
    textColor: '#ffffff',
    fontFamily: 'Inter',
    cardBackground: 'rgba(255, 255, 255, 0.1)',
    accentColor: '#00d4ff',
  })
  const router = useRouter()

  useEffect(() => {
    loadThemes()
    loadProfile()
  }, [])

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/themes')
      if (!response.ok) throw new Error('Failed to load themes')

      const { themes } = await response.json()
      setThemes(themes || [])
    } catch (error) {
      console.error('Error loading themes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) return

      const { profile } = await response.json()
      setSelectedTheme(profile?.themeId || null)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const selectTheme = async (themeId: string) => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      })

      if (!response.ok) throw new Error('Failed to apply theme')

      setSelectedTheme(themeId)
      alert('Theme applied successfully!')
    } catch (error) {
      console.error('Error applying theme:', error)
      alert('Failed to apply theme')
    } finally {
      setSaving(false)
    }
  }

  const saveCustomTheme = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customCss: JSON.stringify(customTheme),
        }),
      })

      if (!response.ok) throw new Error('Failed to save custom theme')

      alert('Custom theme saved successfully!')
    } catch (error) {
      console.error('Error saving custom theme:', error)
      alert('Failed to save custom theme')
    } finally {
      setSaving(false)
    }
  }

  const fonts = [
    'Inter',
    'Poppins',
    'Roboto',
    'Montserrat',
    'Playfair Display',
    'Raleway',
    'Space Grotesk',
  ]

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-400">Loading themes...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold mb-2">
              <span className="gradient-text">Customize Your Theme</span>
            </h1>
            <p className="text-gray-400">Make your profile uniquely yours</p>
          </div>
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition"
          >
            <Sparkles className="w-5 h-5" />
            {showCustomizer ? 'View Themes' : 'Custom Theme Builder'}
          </button>
        </div>

        {showCustomizer ? (
          /* Custom Theme Builder */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Customization Controls */}
            <div className="space-y-6">
              {/* Background Settings */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-5 h-5 text-primary-cyan" />
                  <h3 className="text-xl font-bold">Background</h3>
                </div>

                <div className="space-y-4">
                  {/* Background Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['solid', 'gradient', 'image'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setCustomTheme({ ...customTheme, backgroundType: type })}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            customTheme.backgroundType === type
                              ? 'bg-primary-cyan text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solid Color */}
                  {customTheme.backgroundType === 'solid' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Color</label>
                      <input
                        type="color"
                        value={customTheme.backgroundColor}
                        onChange={(e) => setCustomTheme({ ...customTheme, backgroundColor: e.target.value })}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Gradient */}
                  {customTheme.backgroundType === 'gradient' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Gradient Presets</label>
                      <div className="grid grid-cols-3 gap-2">
                        {gradients.map((gradient, index) => (
                          <button
                            key={index}
                            onClick={() => setCustomTheme({ ...customTheme, backgroundGradient: gradient })}
                            className={`h-12 rounded-lg border-2 transition ${
                              customTheme.backgroundGradient === gradient
                                ? 'border-primary-cyan'
                                : 'border-transparent'
                            }`}
                            style={{ background: gradient }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image URL */}
                  {customTheme.backgroundType === 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <input
                        type="url"
                        value={customTheme.backgroundImage}
                        onChange={(e) => setCustomTheme({ ...customTheme, backgroundImage: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Button Settings */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="w-5 h-5 text-primary-cyan" />
                  <h3 className="text-xl font-bold">Buttons</h3>
                </div>

                <div className="space-y-4">
                  {/* Button Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Button Color</label>
                    <input
                      type="color"
                      value={customTheme.buttonColor}
                      onChange={(e) => setCustomTheme({ ...customTheme, buttonColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Button Style */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Button Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['rounded', 'square', 'pill'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setCustomTheme({ ...customTheme, buttonStyle: style })}
                          className={`px-4 py-2 font-medium transition ${
                            customTheme.buttonStyle === style
                              ? 'bg-primary-cyan text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          style={{
                            borderRadius: style === 'rounded' ? '8px' : style === 'pill' ? '9999px' : '0px'
                          }}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Button Animation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Hover Animation</label>
                    <select
                      value={customTheme.buttonAnimation}
                      onChange={(e) => setCustomTheme({ ...customTheme, buttonAnimation: e.target.value as any })}
                      className="w-full px-4 py-2 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    >
                      <option value="none">None</option>
                      <option value="bounce">Bounce</option>
                      <option value="slide">Slide Up</option>
                      <option value="glow">Glow</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Typography Settings */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="w-5 h-5 text-primary-cyan" />
                  <h3 className="text-xl font-bold">Typography</h3>
                </div>

                <div className="space-y-4">
                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Family</label>
                    <select
                      value={customTheme.fontFamily}
                      onChange={(e) => setCustomTheme({ ...customTheme, fontFamily: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <input
                      type="color"
                      value={customTheme.textColor}
                      onChange={(e) => setCustomTheme({ ...customTheme, textColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Accent Color</label>
                    <input
                      type="color"
                      value={customTheme.accentColor}
                      onChange={(e) => setCustomTheme({ ...customTheme, accentColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={saveCustomTheme}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Custom Theme'}
              </button>
            </div>

            {/* Live Preview */}
            <div className="glass p-6 rounded-2xl sticky top-8 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary-cyan" />
                <h3 className="text-xl font-bold">Live Preview</h3>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: customTheme.backgroundType === 'solid'
                    ? customTheme.backgroundColor
                    : customTheme.backgroundType === 'gradient'
                    ? customTheme.backgroundGradient
                    : `url(${customTheme.backgroundImage}) center/cover`,
                  minHeight: '600px',
                  fontFamily: customTheme.fontFamily,
                  color: customTheme.textColor,
                }}
              >
                <div className="p-8 flex flex-col items-center">
                  {/* Profile Section */}
                  <div className="w-24 h-24 rounded-full bg-gradient-vibrant mb-4" />
                  <h2 className="text-2xl font-bold mb-2" style={{ color: customTheme.textColor }}>
                    Your Name
                  </h2>
                  <p className="text-sm opacity-80 mb-8">Your bio goes here</p>

                  {/* Link Buttons */}
                  <div className="w-full max-w-md space-y-3">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        className="w-full px-6 py-4 font-semibold transition-all duration-300"
                        style={{
                          backgroundColor: customTheme.buttonColor,
                          borderRadius: customTheme.buttonStyle === 'rounded' ? '12px' : customTheme.buttonStyle === 'pill' ? '9999px' : '0px',
                          color: '#ffffff',
                        }}
                        onMouseEnter={(e) => {
                          if (customTheme.buttonAnimation === 'bounce') {
                            e.currentTarget.style.transform = 'scale(1.05)'
                          } else if (customTheme.buttonAnimation === 'slide') {
                            e.currentTarget.style.transform = 'translateY(-4px)'
                          } else if (customTheme.buttonAnimation === 'glow') {
                            e.currentTarget.style.boxShadow = `0 0 20px ${customTheme.accentColor}`
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        Link {i}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Theme Gallery */
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`glass rounded-2xl overflow-hidden cursor-pointer transition hover:scale-105 ${
                  selectedTheme === theme.id ? 'ring-2 ring-primary-cyan' : ''
                }`}
                onClick={() => !theme.isPremium && selectTheme(theme.id)}
              >
                {/* Theme Preview */}
                <div
                  className="h-48 relative"
                  style={{
                    background: theme.config.background || theme.config.gradient,
                  }}
                >
                  {selectedTheme === theme.id && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-primary-cyan rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  {theme.isPremium && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-vibrant rounded-full text-xs font-semibold">
                      Pro
                    </div>
                  )}

                  {/* Mini Preview */}
                  <div className="absolute inset-x-8 bottom-8 space-y-2">
                    <div
                      className="h-12 rounded-lg"
                      style={{
                        background: theme.config.cardBackground,
                        backdropFilter: theme.config.backdropBlur,
                        border: `1px solid ${theme.config.accentColor || 'rgba(255,255,255,0.2)'}`,
                      }}
                    />
                    <div
                      className="h-12 rounded-lg"
                      style={{
                        background: theme.config.cardBackground,
                        backdropFilter: theme.config.backdropBlur,
                        border: `1px solid ${theme.config.accentColor || 'rgba(255,255,255,0.2)'}`,
                      }}
                    />
                  </div>
                </div>

                {/* Theme Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{theme.name}</h3>
                  <p className="text-sm text-gray-400">{theme.description}</p>

                  {theme.isPremium ? (
                    <button
                      disabled={saving}
                      className="mt-4 w-full py-2 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm"
                    >
                      Upgrade to Pro
                    </button>
                  ) : (
                    <button
                      onClick={() => selectTheme(theme.id)}
                      disabled={saving || selectedTheme === theme.id}
                      className="mt-4 w-full py-2 bg-white/5 rounded-lg font-semibold hover:bg-white/10 transition disabled:opacity-50 text-sm"
                    >
                      {selectedTheme === theme.id ? 'Active' : 'Apply Theme'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
