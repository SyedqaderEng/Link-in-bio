import { notFound } from 'next/navigation'
import GlassmorphicTheme from '@/components/themes/GlassmorphicTheme'
import MinimalistTheme from '@/components/themes/MinimalistTheme'
import BoldVibrantTheme from '@/components/themes/BoldVibrantTheme'
import NatureEarthyTheme from '@/components/themes/NatureEarthyTheme'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params

  const profile = await prisma.profile.findUnique({
    where: { username },
    select: { displayName: true, bio: true, username: true },
  })

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: `${profile.displayName || profile.username} | LinkBio`,
    description: profile.bio || `Check out ${profile.displayName || profile.username}'s links`,
    openGraph: {
      title: `${profile.displayName || profile.username}`,
      description: profile.bio || `Check out my links`,
      type: 'profile',
    },
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  // Get profile with theme
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      theme: true,
    },
  })

  if (!profile) {
    notFound()
  }

  // Get active links
  const links = await prisma.link.findMany({
    where: {
      userId: profile.id,
      isActive: true,
    },
    orderBy: { position: 'asc' },
  })

  // Track page view
  try {
    await prisma.analytics.create({
      data: {
        userId: profile.id,
        eventType: 'view',
        referrer: null,
        country: null,
        city: null,
        device: null,
        browser: null,
      },
    })
  } catch (error) {
    // Silently fail if analytics insert fails
    console.error('Failed to track page view:', error)
  }

  // Determine theme
  const themeSlug = profile.theme?.slug || 'glassmorphic'

  // Render appropriate theme
  switch (themeSlug) {
    case 'minimalist':
      return <MinimalistTheme profile={profile} links={links} />
    case 'bold-vibrant':
      return <BoldVibrantTheme profile={profile} links={links} />
    case 'nature-earthy':
      return <NatureEarthyTheme profile={profile} links={links} />
    default:
      return <GlassmorphicTheme profile={profile} links={links} />
  }
}
