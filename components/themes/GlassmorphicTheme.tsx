'use client'

import {
  ExternalLink,
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
import { createClient } from '@/lib/supabase/client'

const SOCIAL_ICONS: Record<string, any> = {
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  twitch: Twitch,
  tiktok: Music,
  discord: MessageCircle,
  patreon: DollarSign,
  email: Mail,
  website: Globe,
}

export default function GlassmorphicTheme({ profile, links }: { profile: any; links: any[] }) {
  const supabase = createClient()

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track click
    await supabase.from('analytics').insert({
      user_id: profile.id,
      link_id: linkId,
      event_type: 'click',
    })

    // Update click count
    await supabase.rpc('increment_link_clicks', { link_uuid: linkId })

    // Open link
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div className="container max-w-2xl mx-auto px-4 py-16">
        {/* Profile Header */}
        <div className="text-center mb-12">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/30"
            />
          )}
          <h1 className="text-4xl font-bold text-white mb-3">
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p className="text-white/80 text-lg mb-6">{profile.bio}</p>
          )}

          {/* Social Links */}
          {profile.social_links && Object.keys(profile.social_links).length > 0 && (
            <div className="flex justify-center gap-3 mt-6">
              {Object.entries(profile.social_links as Record<string, string>).map(([platform, url]) => {
                const Icon = SOCIAL_ICONS[platform]
                if (!Icon || !url) return null
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition hover:scale-110"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                    title={platform}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="w-full p-5 text-white font-semibold rounded-2xl transition hover:scale-105 hover:shadow-lg flex items-center justify-between group"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-4">
                {link.icon && <span className="text-2xl">{link.icon}</span>}
                <span>{link.title}</span>
              </div>
              <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <a
            href="/"
            className="text-white/60 hover:text-white text-sm transition"
          >
            Create your own LinkBio →
          </a>
        </div>
      </div>
    </div>
  )
}
