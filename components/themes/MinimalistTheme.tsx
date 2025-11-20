'use client'

import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function MinimalistTheme({ profile, links }: { profile: any; links: any[] }) {
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
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="container max-w-xl mx-auto px-4 py-20">
        {/* Profile Header */}
        <div className="text-center mb-16">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-20 h-20 rounded-full mx-auto mb-6 grayscale"
            />
          )}
          <h1 className="text-3xl font-light text-[#2c2c2c] mb-3 tracking-wide">
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p className="text-[#666] text-base leading-relaxed max-w-md mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="w-full p-4 bg-white text-[#2c2c2c] font-medium rounded-lg border border-[#e0e0e0] transition hover:border-[#8b7355] hover:shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                {link.icon && <span className="text-xl opacity-70">{link.icon}</span>}
                <span>{link.title}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#8b7355] opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <a
            href="/"
            className="text-[#999] hover:text-[#666] text-sm transition"
          >
            Powered by LinkBio
          </a>
        </div>
      </div>
    </div>
  )
}
