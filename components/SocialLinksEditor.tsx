'use client'

import { useState } from 'react'
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Twitch,
  Music,
  Mail,
  Globe,
  MessageCircle,
  DollarSign,
} from 'lucide-react'

interface SocialLink {
  platform: string
  url: string
  icon: string
}

interface SocialLinksEditorProps {
  socialLinks: Record<string, string>
  onChange: (links: Record<string, string>) => void
}

const SOCIAL_PLATFORMS = [
  { name: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { name: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { name: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { name: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@channel' },
  { name: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
  { name: 'twitch', label: 'Twitch', icon: Twitch, placeholder: 'https://twitch.tv/username' },
  { name: 'tiktok', label: 'TikTok', icon: Music, placeholder: 'https://tiktok.com/@username' },
  { name: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/invite' },
  { name: 'patreon', label: 'Patreon', icon: DollarSign, placeholder: 'https://patreon.com/username' },
  { name: 'email', label: 'Email', icon: Mail, placeholder: 'mailto:your@email.com' },
  { name: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
]

export default function SocialLinksEditor({ socialLinks, onChange }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<Record<string, string>>(socialLinks || {})

  const updateLink = (platform: string, url: string) => {
    const newLinks = { ...links }
    if (url.trim() === '') {
      delete newLinks[platform]
    } else {
      newLinks[platform] = url
    }
    setLinks(newLinks)
    onChange(newLinks)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Social Links</h3>
        <p className="text-gray-400 text-sm">
          Add links to your social media profiles. They'll appear as icons on your profile.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = platform.icon
          return (
            <div key={platform.name} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  {platform.label}
                </label>
                <input
                  type="url"
                  value={links[platform.name] || ''}
                  onChange={(e) => updateLink(platform.name, e.target.value)}
                  placeholder={platform.placeholder}
                  className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                />
              </div>
            </div>
          )
        })}
      </div>

      {Object.keys(links).length > 0 && (
        <div className="glass p-4 rounded-lg">
          <h4 className="text-sm font-semibold mb-3">Preview</h4>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_PLATFORMS.filter(p => links[p.name])
              .map((platform) => {
                const Icon = platform.icon
                return (
                  <a
                    key={platform.name}
                    href={links[platform.name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                    title={platform.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
