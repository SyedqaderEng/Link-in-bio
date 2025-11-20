import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GlassmorphicTheme from '@/components/themes/GlassmorphicTheme'
import MinimalistTheme from '@/components/themes/MinimalistTheme'
import BoldVibrantTheme from '@/components/themes/BoldVibrantTheme'
import NatureEarthyTheme from '@/components/themes/NatureEarthyTheme'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, username')
    .eq('username', params.username)
    .single()

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: `${profile.display_name || profile.username} | LinkBio`,
    description: profile.bio || `Check out ${profile.display_name || profile.username}'s links`,
    openGraph: {
      title: `${profile.display_name || profile.username}`,
      description: profile.bio || `Check out my links`,
      type: 'profile',
    },
  }
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient()

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      themes (
        slug,
        config
      )
    `)
    .eq('username', params.username)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Get active links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true })

  // Track page view
  try {
    await supabase.from('analytics').insert({
      user_id: profile.id,
      event_type: 'view',
      referrer: null,
      country: null,
      city: null,
      device: null,
      browser: null,
    })
  } catch (error) {
    // Silently fail if analytics insert fails
  }

  // Determine theme
  const themeSlug = profile.themes?.slug || 'glassmorphic'

  // Render appropriate theme
  switch (themeSlug) {
    case 'minimalist':
      return <MinimalistTheme profile={profile} links={links || []} />
    case 'bold-vibrant':
      return <BoldVibrantTheme profile={profile} links={links || []} />
    case 'nature-earthy':
      return <NatureEarthyTheme profile={profile} links={links || []} />
    default:
      return <GlassmorphicTheme profile={profile} links={links || []} />
  }
}
