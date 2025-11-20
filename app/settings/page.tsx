'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Mail, Lock, Globe, CreditCard, Trash2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    custom_domain: '',
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        username: data.username || '',
        display_name: data.display_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        custom_domain: data.custom_domain || '',
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      alert('Profile updated successfully!')
      loadProfile()
    } catch (error: any) {
      console.error('Error saving profile:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }

    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      })

      if (error) throw error

      alert('Password updated successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      console.error('Error changing password:', error)
      alert(error.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    const confirmText = prompt('Type "DELETE" to confirm:')
    if (confirmText !== 'DELETE') {
      alert('Account deletion cancelled')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Delete profile (cascades to links and analytics)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (error) throw error

      // Sign out
      await supabase.auth.signOut()
      router.push('/')
    } catch (error: any) {
      console.error('Error deleting account:', error)
      alert(error.message || 'Failed to delete account')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <div className="glass p-8 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary-cyan" />
            <h2 className="text-2xl font-bold">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                pattern="[a-z0-9_-]+"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your page: {window.location.origin}/{formData.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                rows={3}
                maxLength={160}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.bio.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Custom Domain */}
        <div className="glass p-8 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary-cyan" />
            <h2 className="text-2xl font-bold">Custom Domain</h2>
            <span className="px-3 py-1 bg-gradient-vibrant rounded-full text-xs font-semibold">
              Pro
            </span>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={formData.custom_domain}
              onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              placeholder="yourdomain.com"
              disabled={!profile?.is_premium}
            />
            <p className="text-sm text-gray-400">
              {profile?.is_premium
                ? 'Connect your custom domain to use it for your profile page'
                : 'Upgrade to Pro to use a custom domain'}
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass p-8 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-primary-cyan" />
            <h2 className="text-2xl font-bold">Change Password</h2>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              placeholder="New password"
            />

            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              placeholder="Confirm new password"
            />

            <button
              onClick={handleChangePassword}
              disabled={saving || !passwords.new || !passwords.confirm}
              className="px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition disabled:opacity-50"
            >
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass p-8 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary-cyan" />
            <h2 className="text-2xl font-bold">Subscription</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                Current Plan: <span className="gradient-text">{profile?.subscription_tier?.toUpperCase() || 'FREE'}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {profile?.is_premium
                  ? 'Enjoy unlimited features and priority support'
                  : 'Upgrade to unlock advanced features'}
              </p>
            </div>
            {!profile?.is_premium && (
              <button className="px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition">
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass p-8 rounded-2xl border border-red-500/50">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-red-500">Danger Zone</h2>
          </div>

          <div>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={saving}
              className="px-6 py-3 bg-red-500/20 text-red-500 rounded-lg font-semibold hover:bg-red-500/30 transition disabled:opacity-50"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
