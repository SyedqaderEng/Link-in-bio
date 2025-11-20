'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, GripVertical, Trash2, Eye, EyeOff, ExternalLink, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  position: number
  is_active: boolean
  click_count: number
}

export default function EditorPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true })

      if (error) throw error
      setLinks(data || [])
    } catch (error) {
      console.error('Error loading links:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLink = () => {
    const newLink: Link = {
      id: `temp-${Date.now()}`,
      title: 'New Link',
      url: 'https://',
      icon: '🔗',
      position: links.length,
      is_active: true,
      click_count: 0,
    }
    setLinks([...links, newLink])
  }

  const updateLink = (index: number, field: keyof Link, value: any) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  const deleteLink = async (index: number) => {
    const link = links[index]

    if (!link.id.startsWith('temp-')) {
      try {
        const { error } = await supabase
          .from('links')
          .delete()
          .eq('id', link.id)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting link:', error)
        alert('Failed to delete link')
        return
      }
    }

    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks)
  }

  const toggleActive = (index: number) => {
    updateLink(index, 'is_active', !links[index].is_active)
  }

  const saveAllLinks = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update positions
      const linksToSave = links.map((link, index) => ({
        ...link,
        position: index,
        user_id: user.id,
      }))

      // Separate new and existing links
      const newLinks = linksToSave.filter(link => link.id.startsWith('temp-'))
      const existingLinks = linksToSave.filter(link => !link.id.startsWith('temp-'))

      // Insert new links
      if (newLinks.length > 0) {
        const { data, error } = await supabase
          .from('links')
          .insert(newLinks.map(({ id, ...link }) => link))
          .select()

        if (error) throw error
      }

      // Update existing links
      for (const link of existingLinks) {
        const { id, user_id, ...updateData } = link
        const { error } = await supabase
          .from('links')
          .update(updateData)
          .eq('id', id)

        if (error) throw error
      }

      // Reload links
      await loadLinks()
      alert('Links saved successfully!')
    } catch (error) {
      console.error('Error saving links:', error)
      alert('Failed to save links')
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newLinks = [...links]
    const draggedLink = newLinks[draggedIndex]
    newLinks.splice(draggedIndex, 1)
    newLinks.splice(index, 0, draggedLink)

    setLinks(newLinks)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold mb-2">
              <span className="gradient-text">Manage Links</span>
            </h1>
            <p className="text-gray-400">Drag to reorder, click to edit</p>
          </div>
          <button
            onClick={saveAllLinks}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-vibrant rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Links List */}
        <div className="space-y-4 mb-6">
          {links.map((link, index) => (
            <div
              key={link.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`glass p-6 rounded-2xl cursor-move transition ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <GripVertical className="w-6 h-6 text-gray-500 mt-2 flex-shrink-0" />

                <div className="flex-1 space-y-4">
                  {/* Icon & Title */}
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={link.icon || ''}
                      onChange={(e) => updateLink(index, 'icon', e.target.value)}
                      className="w-16 px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-center text-2xl"
                      placeholder="🔗"
                      maxLength={2}
                    />
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(index, 'title', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                      placeholder="Link Title"
                    />
                  </div>

                  {/* URL */}
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                    placeholder="https://example.com"
                  />

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{link.click_count} clicks</span>
                    <span>•</span>
                    <span>Position {index + 1}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleActive(index)}
                    className={`p-2 rounded-lg transition ${
                      link.is_active
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                    }`}
                    title={link.is_active ? 'Active' : 'Inactive'}
                  >
                    {link.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>

                  {link.url && !link.url.startsWith('https://') && link.url !== 'https://' && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/30 transition"
                      title="Open link"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}

                  <button
                    onClick={() => deleteLink(index)}
                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Link Button */}
        <button
          onClick={addLink}
          className="w-full p-6 glass rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition group"
        >
          <Plus className="w-6 h-6 text-primary-cyan" />
          <span className="text-lg font-semibold">Add New Link</span>
        </button>
      </div>
    </DashboardLayout>
  )
}
