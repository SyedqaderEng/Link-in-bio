'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Plus, GripVertical, Trash2, Eye, EyeOff, ExternalLink, Save, RefreshCw, Image as ImageIcon, Sparkles, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  position: number
  isActive: boolean
  clickCount: number
  thumbnail?: string | null
  description?: string | null
  scheduledStart?: string | null
  scheduledEnd?: string | null
}

interface LinkMetadata {
  title?: string
  description?: string
  image?: string
  icon?: string
  url: string
}

export default function EditorPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [fetchingMetadata, setFetchingMetadata] = useState<Record<number, boolean>>({})
  const [generatingAI, setGeneratingAI] = useState<Record<number, boolean>>({})
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/auth/login')
        return
      }

      const { user } = await response.json()

      const linksResponse = await fetch(`/api/links?username=${user.username}`)
      if (!linksResponse.ok) throw new Error('Failed to load links')

      const { links: userLinks } = await linksResponse.json()
      setLinks(userLinks || [])
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
      isActive: true,
      clickCount: 0,
    }
    setLinks([...links, newLink])
  }

  const updateLink = (index: number, field: keyof Link, value: any) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  const fetchMetadata = async (index: number) => {
    const link = links[index]
    if (!link.url || link.url === 'https://') return

    // Validate URL
    try {
      new URL(link.url)
    } catch {
      return
    }

    setFetchingMetadata(prev => ({ ...prev, [index]: true }))

    try {
      const response = await fetch('/api/links/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.url }),
      })

      if (!response.ok) throw new Error('Failed to fetch metadata')

      const { metadata } = await response.json() as { metadata: LinkMetadata }

      // Update link with fetched metadata
      const newLinks = [...links]
      newLinks[index] = {
        ...newLinks[index],
        title: metadata.title || newLinks[index].title,
        description: metadata.description || null,
        thumbnail: metadata.image || null,
        icon: metadata.icon ? '🌐' : newLinks[index].icon, // Use globe emoji as placeholder
      }
      setLinks(newLinks)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    } finally {
      setFetchingMetadata(prev => ({ ...prev, [index]: false }))
    }
  }

  const generateAITitle = async (index: number) => {
    const link = links[index]
    if (!link.url || link.url === 'https://') {
      toast.warning('Please enter a URL first')
      return
    }

    setGeneratingAI(prev => ({ ...prev, [index]: true }))

    try {
      const response = await fetch('/api/ai/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: link.url,
          description: link.description,
          count: 3,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate suggestions')

      const { suggestions } = await response.json()

      if (suggestions && suggestions.length > 0) {
        const newLinks = [...links]
        newLinks[index] = {
          ...newLinks[index],
          title: suggestions[0].title,
          description: suggestions[0].description,
        }
        setLinks(newLinks)
        toast.success('AI-generated title applied!')
      }
    } catch (error: any) {
      console.error('Error generating AI title:', error)
      toast.error('Failed to generate AI suggestions')
    } finally {
      setGeneratingAI(prev => ({ ...prev, [index]: false }))
    }
  }

  const deleteLink = async (index: number) => {
    const link = links[index]

    if (!link.id.startsWith('temp-')) {
      try {
        const response = await fetch(`/api/links/${link.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete link')
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
    updateLink(index, 'isActive', !links[index].isActive)
  }

  const saveAllLinks = async () => {
    setSaving(true)
    try {
      // Update positions
      const linksToSave = links.map((link, index) => ({
        ...link,
        position: index,
      }))

      // Separate new and existing links
      const newLinks = linksToSave.filter(link => link.id.startsWith('temp-'))
      const existingLinks = linksToSave.filter(link => !link.id.startsWith('temp-'))

      // Insert new links
      for (const link of newLinks) {
        const { id, clickCount, ...linkData } = link
        const response = await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkData),
        })

        if (!response.ok) throw new Error('Failed to create link')
      }

      // Update existing links
      for (const link of existingLinks) {
        const { id, clickCount, ...updateData } = link
        const response = await fetch(`/api/links/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) throw new Error('Failed to update link')
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

                  {/* URL with Fetch Button */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      onBlur={() => fetchMetadata(index)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                      placeholder="https://example.com"
                    />
                    <button
                      onClick={() => fetchMetadata(index)}
                      disabled={fetchingMetadata[index]}
                      className="px-4 py-2 bg-primary-cyan/20 text-primary-cyan rounded-lg hover:bg-primary-cyan/30 transition disabled:opacity-50 flex items-center gap-2"
                      title="Fetch metadata"
                    >
                      <RefreshCw className={`w-4 h-4 ${fetchingMetadata[index] ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => generateAITitle(index)}
                      disabled={generatingAI[index]}
                      className="px-4 py-2 bg-purple-500/20 text-purple-500 rounded-lg hover:bg-purple-500/30 transition disabled:opacity-50 flex items-center gap-2"
                      title="Generate AI title"
                    >
                      <Sparkles className={`w-4 h-4 ${generatingAI[index] ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>

                  {/* Description (if fetched) */}
                  {link.description && (
                    <div className="text-sm text-gray-400 italic">
                      {link.description}
                    </div>
                  )}

                  {/* Thumbnail (if fetched) */}
                  {link.thumbnail && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-white/5">
                      <img
                        src={link.thumbnail}
                        alt={link.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{link.clickCount} clicks</span>
                    <span>•</span>
                    <span>Position {index + 1}</span>
                    {(link.thumbnail || link.description) && (
                      <>
                        <span>•</span>
                        <span className="text-primary-cyan flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Metadata fetched
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleActive(index)}
                    className={`p-2 rounded-lg transition ${
                      link.isActive
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                    }`}
                    title={link.isActive ? 'Active' : 'Inactive'}
                  >
                    {link.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
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
