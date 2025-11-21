'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Check, Palette, Type, Sparkles, Save, Eye, Layers, Zap, Image, Grid3X3 } from 'lucide-react'
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
  backgroundType: 'solid' | 'gradient' | 'image' | 'animated'
  backgroundImage: string
  buttonColor: string
  buttonTextColor: string
  buttonStyle: 'rounded' | 'square' | 'pill' | 'outline' | 'glass'
  buttonAnimation: 'none' | 'bounce' | 'slide' | 'glow' | 'shake' | 'pulse'
  buttonShadow: boolean
  textColor: string
  fontFamily: string
  cardBackground: string
  accentColor: string
  showSocialIcons: boolean
  linkSpacing: 'compact' | 'normal' | 'relaxed'
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [activeTab, setActiveTab] = useState<'background' | 'buttons' | 'typography' | 'effects'>('background')
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    backgroundColor: '#0a0a0a',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundType: 'gradient',
    backgroundImage: '',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    buttonStyle: 'rounded',
    buttonAnimation: 'none',
    buttonShadow: false,
    textColor: '#ffffff',
    fontFamily: 'Inter',
    cardBackground: 'rgba(255, 255, 255, 0.1)',
    accentColor: '#00d4ff',
    showSocialIcons: true,
    linkSpacing: 'normal',
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
      if (profile?.customCss) {
        try {
          const saved = JSON.parse(profile.customCss)
          setCustomTheme({ ...customTheme, ...saved })
        } catch (e) {}
      }
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
    'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Playfair Display',
    'Raleway', 'Space Grotesk', 'Outfit', 'DM Sans', 'Sora',
    'Clash Display', 'Satoshi',
  ]

  const gradients = [
    // Purple & Blue
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    // Pink & Purple
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #f472b6 0%, #7c3aed 100%)',
    // Cyan & Blue
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    // Green & Teal
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%)',
    // Orange & Pink
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    'linear-gradient(135deg, #fb923c 0%, #f472b6 100%)',
    // Dark & Moody
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    'linear-gradient(135deg, #1e1e1e 0%, #434343 100%)',
  ]

  const animatedBackgrounds = [
    'animated-gradient-1',
    'animated-gradient-2',
    'animated-gradient-3',
  ]

  const tabs = [
    { id: 'background', label: 'Background', icon: Layers },
    { id: 'buttons', label: 'Buttons', icon: Grid3X3 },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'effects', label: 'Effects', icon: Zap },
  ]

  const getButtonStyles = (style: string) => {
    switch (style) {
      case 'rounded': return { borderRadius: '12px', border: 'none', background: customTheme.buttonColor }
      case 'square': return { borderRadius: '0px', border: 'none', background: customTheme.buttonColor }
      case 'pill': return { borderRadius: '9999px', border: 'none', background: customTheme.buttonColor }
      case 'outline': return { borderRadius: '12px', border: `2px solid ${customTheme.buttonColor}`, background: 'transparent' }
      case 'glass': return { borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }
      default: return {}
    }
  }

  const getSpacing = () => {
    switch (customTheme.linkSpacing) {
      case 'compact': return 'space-y-2'
      case 'relaxed': return 'space-y-6'
      default: return 'space-y-4'
    }
  }

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
              <span className="gradient-text">Theme Studio</span>
            </h1>
            <p className="text-gray-400">Create the perfect look for your profile</p>
          </div>
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition"
          >
            <Sparkles className="w-5 h-5" />
            {showCustomizer ? 'Theme Gallery' : 'Custom Builder'}
          </button>
        </div>

        {showCustomizer ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Customization Controls */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="glass p-2 rounded-xl flex gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                        activeTab === tab.id
                          ? 'bg-gradient-vibrant'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Background Tab */}
              {activeTab === 'background' && (
                <div className="glass p-6 rounded-2xl space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary-cyan" />
                    Background
                  </h3>

                  {/* Background Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['solid', 'gradient', 'image', 'animated'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setCustomTheme({ ...customTheme, backgroundType: type })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
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
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={customTheme.backgroundColor}
                          onChange={(e) => setCustomTheme({ ...customTheme, backgroundColor: e.target.value })}
                          className="w-20 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customTheme.backgroundColor}
                          onChange={(e) => setCustomTheme({ ...customTheme, backgroundColor: e.target.value })}
                          className="flex-1 px-4 py-2 bg-white/5 border border-dark-border rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gradient Presets */}
                  {customTheme.backgroundType === 'gradient' && (
                    <div>
                      <label className="block text-sm font-medium mb-3">Gradient Presets</label>
                      <div className="grid grid-cols-6 gap-2">
                        {gradients.map((gradient, index) => (
                          <button
                            key={index}
                            onClick={() => setCustomTheme({ ...customTheme, backgroundGradient: gradient })}
                            className={`aspect-square rounded-lg border-2 transition hover:scale-110 ${
                              customTheme.backgroundGradient === gradient
                                ? 'border-white'
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
                        className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-2">Tip: Use Unsplash for free high-quality images</p>
                    </div>
                  )}

                  {/* Animated */}
                  {customTheme.backgroundType === 'animated' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">Animated gradients create a dynamic, eye-catching effect</p>
                      <div className="grid grid-cols-3 gap-3">
                        {['Aurora', 'Sunset', 'Ocean'].map((name, i) => (
                          <button
                            key={name}
                            onClick={() => setCustomTheme({ ...customTheme, backgroundGradient: gradients[i * 3] })}
                            className="glass p-4 rounded-xl hover:bg-white/10 transition text-center"
                          >
                            <div className="w-12 h-12 mx-auto mb-2 rounded-lg animate-pulse" style={{ background: gradients[i * 3] }} />
                            <span className="text-sm">{name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons Tab */}
              {activeTab === 'buttons' && (
                <div className="glass p-6 rounded-2xl space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-primary-cyan" />
                    Buttons
                  </h3>

                  {/* Button Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Color</label>
                      <input
                        type="color"
                        value={customTheme.buttonColor}
                        onChange={(e) => setCustomTheme({ ...customTheme, buttonColor: e.target.value })}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Color</label>
                      <input
                        type="color"
                        value={customTheme.buttonTextColor}
                        onChange={(e) => setCustomTheme({ ...customTheme, buttonTextColor: e.target.value })}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Button Style */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Style</label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['rounded', 'square', 'pill', 'outline', 'glass'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setCustomTheme({ ...customTheme, buttonStyle: style })}
                          className={`px-3 py-3 text-xs font-medium transition ${
                            customTheme.buttonStyle === style
                              ? 'ring-2 ring-primary-cyan'
                              : ''
                          }`}
                          style={getButtonStyles(style)}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animation */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Hover Animation</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['none', 'bounce', 'slide', 'glow', 'shake', 'pulse'] as const).map((anim) => (
                        <button
                          key={anim}
                          onClick={() => setCustomTheme({ ...customTheme, buttonAnimation: anim })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            customTheme.buttonAnimation === anim
                              ? 'bg-primary-cyan text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {anim.charAt(0).toUpperCase() + anim.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Link Spacing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
                        <button
                          key={spacing}
                          onClick={() => setCustomTheme({ ...customTheme, linkSpacing: spacing })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            customTheme.linkSpacing === spacing
                              ? 'bg-primary-cyan text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shadow Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customTheme.buttonShadow}
                      onChange={(e) => setCustomTheme({ ...customTheme, buttonShadow: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary-cyan"
                    />
                    <span className="text-sm font-medium">Enable button shadow</span>
                  </label>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="glass p-6 rounded-2xl space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary-cyan" />
                    Typography
                  </h3>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Font Family</label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {fonts.map((font) => (
                        <button
                          key={font}
                          onClick={() => setCustomTheme({ ...customTheme, fontFamily: font })}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            customTheme.fontFamily === font
                              ? 'bg-primary-cyan text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Color</label>
                      <input
                        type="color"
                        value={customTheme.textColor}
                        onChange={(e) => setCustomTheme({ ...customTheme, textColor: e.target.value })}
                        className="w-full h-12 rounded-lg cursor-pointer"
                      />
                    </div>
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
              )}

              {/* Effects Tab */}
              {activeTab === 'effects' && (
                <div className="glass p-6 rounded-2xl space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-cyan" />
                    Effects & Extras
                  </h3>

                  {/* Card Background */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Card Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Glass', value: 'rgba(255, 255, 255, 0.1)' },
                        { name: 'Dark', value: 'rgba(0, 0, 0, 0.5)' },
                        { name: 'Solid', value: customTheme.buttonColor + '33' },
                      ].map((card) => (
                        <button
                          key={card.name}
                          onClick={() => setCustomTheme({ ...customTheme, cardBackground: card.value })}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                            customTheme.cardBackground === card.value
                              ? 'ring-2 ring-primary-cyan'
                              : ''
                          }`}
                          style={{ background: card.value, backdropFilter: 'blur(10px)' }}
                        >
                          {card.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Social Icons */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customTheme.showSocialIcons}
                      onChange={(e) => setCustomTheme({ ...customTheme, showSocialIcons: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary-cyan"
                    />
                    <span className="text-sm font-medium">Show social media icons</span>
                  </label>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={saveCustomTheme}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-vibrant rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Theme'}
              </button>
            </div>

            {/* Live Preview */}
            <div className="glass p-6 rounded-2xl sticky top-8 h-fit">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-cyan" />
                  <h3 className="text-xl font-bold">Live Preview</h3>
                </div>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Real-time</span>
              </div>

              <div
                className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                  customTheme.backgroundType === 'animated' ? 'animate-gradient' : ''
                }`}
                style={{
                  background: customTheme.backgroundType === 'solid'
                    ? customTheme.backgroundColor
                    : customTheme.backgroundType === 'gradient' || customTheme.backgroundType === 'animated'
                    ? customTheme.backgroundGradient
                    : `url(${customTheme.backgroundImage}) center/cover`,
                  minHeight: '650px',
                  fontFamily: customTheme.fontFamily,
                  color: customTheme.textColor,
                }}
              >
                <div className="p-8 flex flex-col items-center">
                  {/* Avatar */}
                  <div
                    className="w-28 h-28 rounded-full mb-4 ring-4"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.accentColor}, ${customTheme.buttonColor})`,
                      ringColor: customTheme.accentColor + '40'
                    }}
                  />

                  {/* Name & Bio */}
                  <h2 className="text-2xl font-bold mb-1" style={{ color: customTheme.textColor }}>
                    Your Name
                  </h2>
                  <p className="text-sm opacity-70 mb-2">@username</p>
                  <p className="text-sm opacity-80 mb-6 text-center max-w-xs">
                    Digital creator & developer. Building cool stuff on the internet.
                  </p>

                  {/* Social Icons */}
                  {customTheme.showSocialIcons && (
                    <div className="flex gap-3 mb-6">
                      {['🐦', '📸', '💼', '🎵'].map((icon, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition hover:scale-110"
                          style={{ background: customTheme.cardBackground }}
                        >
                          {icon}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Link Buttons */}
                  <div className={`w-full max-w-sm ${getSpacing()}`}>
                    {['My Website', 'YouTube Channel', 'Latest Project', 'Contact Me'].map((label, i) => (
                      <button
                        key={i}
                        className="w-full px-6 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        style={{
                          ...getButtonStyles(customTheme.buttonStyle),
                          color: customTheme.buttonStyle === 'outline' || customTheme.buttonStyle === 'glass'
                            ? customTheme.textColor
                            : customTheme.buttonTextColor,
                          boxShadow: customTheme.buttonShadow
                            ? `0 4px 14px ${customTheme.buttonColor}40`
                            : 'none',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget
                          switch (customTheme.buttonAnimation) {
                            case 'bounce': el.style.transform = 'scale(1.05)'; break
                            case 'slide': el.style.transform = 'translateY(-4px)'; break
                            case 'glow': el.style.boxShadow = `0 0 25px ${customTheme.accentColor}`; break
                            case 'shake': el.style.animation = 'shake 0.5s'; break
                            case 'pulse': el.style.animation = 'pulse 1s infinite'; break
                          }
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget
                          el.style.transform = 'none'
                          el.style.animation = 'none'
                          el.style.boxShadow = customTheme.buttonShadow
                            ? `0 4px 14px ${customTheme.buttonColor}40`
                            : 'none'
                        }}
                      >
                        {['🌐', '🎬', '🚀', '✉️'][i]} {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Theme Gallery */
          <div className="space-y-8">
            {/* Quick Presets */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Presets</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gradients.slice(0, 6).map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCustomTheme({ ...customTheme, backgroundGradient: gradient, backgroundType: 'gradient' })
                      setShowCustomizer(true)
                    }}
                    className="aspect-video rounded-xl border-2 border-transparent hover:border-primary-cyan transition hover:scale-105"
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>

            {/* Theme Cards */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Theme Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`glass rounded-2xl overflow-hidden cursor-pointer transition hover:scale-105 ${
                      selectedTheme === theme.id ? 'ring-2 ring-primary-cyan' : ''
                    }`}
                    onClick={() => !theme.isPremium && selectTheme(theme.id)}
                  >
                    <div
                      className="h-48 relative"
                      style={{ background: theme.config?.background || theme.config?.gradient || '#1a1a1a' }}
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
                      <div className="absolute inset-x-6 bottom-6 space-y-2">
                        <div className="h-10 rounded-lg" style={{ background: theme.config?.cardBackground || 'rgba(255,255,255,0.1)' }} />
                        <div className="h-10 rounded-lg" style={{ background: theme.config?.cardBackground || 'rgba(255,255,255,0.1)' }} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1">{theme.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{theme.description}</p>
                      <button
                        onClick={() => selectTheme(theme.id)}
                        disabled={saving || selectedTheme === theme.id || theme.isPremium}
                        className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
                          theme.isPremium
                            ? 'bg-gradient-vibrant hover:opacity-90'
                            : selectedTheme === theme.id
                            ? 'bg-primary-cyan/20 text-primary-cyan'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {theme.isPremium ? 'Upgrade to Pro' : selectedTheme === theme.id ? 'Active' : 'Apply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CSS for animations */}
        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 5s ease infinite;
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}
