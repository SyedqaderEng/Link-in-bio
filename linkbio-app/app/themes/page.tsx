'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Theme {
  id: string
  name: string
  slug: string
  description: string | null
  config: any
  is_premium: boolean
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadThemes()
    loadProfile()
  }, [])

  const loadThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name')

      if (error) throw error
      setThemes(data || [])
    } catch (error) {
      console.error('Error loading themes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('theme_id')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setSelectedTheme(data?.theme_id || null)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const selectTheme = async (themeId: string) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ theme_id: themeId })
        .eq('id', user.id)

      if (error) throw error

      setSelectedTheme(themeId)
      alert('Theme applied successfully!')
    } catch (error) {
      console.error('Error applying theme:', error)
      alert('Failed to apply theme')
    } finally {
      setSaving(false)
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
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="gradient-text">Choose Your Theme</span>
          </h1>
          <p className="text-gray-400">Select a theme for your public profile page</p>
        </div>

        {/* Themes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`glass rounded-2xl overflow-hidden cursor-pointer transition hover:scale-105 ${
                selectedTheme === theme.id ? 'ring-2 ring-primary-cyan' : ''
              }`}
              onClick={() => !theme.is_premium && selectTheme(theme.id)}
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
                {theme.is_premium && (
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

                {theme.is_premium ? (
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

        {/* Custom CSS Section */}
        <div className="mt-12 glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Custom CSS</h2>
          <p className="text-gray-400 mb-6">
            Add your own custom CSS to further personalize your page (Pro feature)
          </p>
          <textarea
            className="w-full h-48 px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan font-mono text-sm"
            placeholder=".profile { ... }"
            disabled
          />
          <button
            disabled
            className="mt-4 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold opacity-50 cursor-not-allowed"
          >
            Save Custom CSS (Pro Only)
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
