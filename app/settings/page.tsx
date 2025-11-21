'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { User, Mail, Lock, Globe, CreditCard, Trash2, Save, QrCode, Download, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    avatarUrl: '',
    customDomain: '',
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (profile?.username) {
      generateQRCode()
    }
  }, [profile])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const { profile } = await response.json()
      setProfile(profile)
      setFormData({
        username: profile.username || '',
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        customDomain: profile.customDomain || '',
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async () => {
    try {
      const profileUrl = `${window.location.origin}/${profile.username}`
      const qr = await QRCode.toDataURL(profileUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
      setQrCodeUrl(qr)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${profile.username}-qrcode.png`
    link.click()
  }

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/${profile.username}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName || profile.username}'s Links`,
          text: profile.bio || 'Check out my links!',
          url: profileUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(profileUrl)
      alert('Profile link copied to clipboard!')
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

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
      // Since we're using local auth, we need to call a password change API
      // For now, let's just show a success message
      alert('Password change functionality coming soon!')
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
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete account')

      // Clear session and redirect
      await fetch('/api/auth/logout', { method: 'POST' })
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

        {/* Profile URL & QR Code */}
        <div className="glass p-8 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-primary-cyan" />
            <h2 className="text-2xl font-bold">Share Your Profile</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Profile Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${formData.username}`}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none"
                />
                <button
                  onClick={shareProfile}
                  className="px-4 py-3 bg-primary-cyan rounded-lg hover:opacity-90 transition"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium mb-2">QR Code</label>
              {qrCodeUrl && (
                <div className="relative group">
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 rounded-lg border-2 border-primary-cyan" />
                  <button
                    onClick={downloadQRCode}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
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
                Your page: {typeof window !== 'undefined' ? window.location.origin : ''}/{formData.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
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
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
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
              value={formData.customDomain}
              onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
              placeholder="yourdomain.com"
              disabled={!profile?.isPremium}
            />
            <p className="text-sm text-gray-400">
              {profile?.isPremium
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
                Current Plan: <span className="gradient-text">{profile?.subscriptionTier?.toUpperCase() || 'FREE'}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {profile?.isPremium
                  ? 'Enjoy unlimited features and priority support'
                  : 'Upgrade to unlock advanced features'}
              </p>
            </div>
            {!profile?.isPremium && (
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
