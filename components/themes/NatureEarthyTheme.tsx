'use client'

import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NatureEarthyTheme({ profile, links }: { profile: any; links: any[] }) {
  const supabase = createClient()

  const handleLinkClick = async (linkId: string, url: string) => {
    await supabase.from('analytics').insert({
      user_id: profile.id,
      link_id: linkId,
      event_type: 'click',
    })

    await supabase.rpc('increment_link_clicks', { link_uuid: linkId })
    window.open(url, '_blank')
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f3ee 0%, #e8e4dc 100%)',
      }}
    >
      <div className="container max-w-2xl mx-auto px-4 py-20">
        {/* Profile Header */}
        <div className="text-center mb-16">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-[#5a7a5f]/20"
            />
          )}
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: '#2f4538' }}
          >
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p
              className="text-lg leading-relaxed max-w-md mx-auto"
              style={{ color: '#5a7a5f' }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Decorative leaf elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">🍃</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 -rotate-12">🌿</div>

        {/* Links */}
        <div className="space-y-4 relative z-10">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="w-full p-5 bg-white font-semibold rounded-3xl border-2 transition hover:scale-105 hover:shadow-lg flex items-center justify-between group"
              style={{
                color: '#2f4538',
                borderColor: '#5a7a5f30',
              }}
            >
              <div className="flex items-center gap-4">
                {link.icon && (
                  <span className="text-2xl">{link.icon}</span>
                )}
                <span>{link.title}</span>
              </div>
              <ExternalLink
                className="w-5 h-5 opacity-0 group-hover:opacity-100 transition"
                style={{ color: '#5a7a5f' }}
              />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <a
            href="/"
            className="text-sm transition hover:opacity-70"
            style={{ color: '#5a7a5f80' }}
          >
            🌱 Powered by LinkBio
          </a>
        </div>
      </div>
    </div>
  )
}
