'use client'

import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BoldVibrantTheme({ profile, links }: { profile: any; links: any[] }) {
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
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 blur-3xl rounded-full opacity-30 animate-pulse"
          style={{ background: '#FF00FF' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 blur-3xl rounded-full opacity-30 animate-pulse"
          style={{ background: '#00E5FF', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-3xl rounded-full opacity-20 animate-pulse"
          style={{ background: '#C4FF0E', animationDelay: '2s' }}
        />
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-16 relative z-10">
        {/* Profile Header */}
        <div className="text-center mb-12">
          {profile.avatar_url && (
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF00FF] via-[#00E5FF] to-[#C4FF0E] blur-lg opacity-75" />
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                className="relative w-28 h-28 rounded-full border-4 border-white/10"
              />
            </div>
          )}
          <h1
            className="text-5xl font-extrabold mb-4"
            style={{
              background: 'linear-gradient(135deg, #FF00FF, #00E5FF, #C4FF0E)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradient 3s ease infinite',
            }}
          >
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p className="text-white/70 text-lg max-w-md mx-auto">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="w-full p-6 text-white font-bold rounded-2xl transition hover:scale-105 hover:shadow-2xl flex items-center justify-between group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: `slideIn 0.5s ease ${index * 0.1}s both`,
              }}
            >
              {/* Gradient hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,229,255,0.1), rgba(196,255,14,0.1))',
                }}
              />

              <div className="flex items-center gap-4 relative z-10">
                {link.icon && <span className="text-3xl">{link.icon}</span>}
                <span className="text-lg">{link.title}</span>
              </div>
              <ExternalLink className="w-6 h-6 opacity-0 group-hover:opacity-100 transition relative z-10" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <a
            href="/"
            className="text-white/40 hover:text-white text-sm transition inline-block"
          >
            <span className="gradient-text">Create your own LinkBio →</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
