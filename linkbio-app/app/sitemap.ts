import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getBaseUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  const supabase = await createClient()

  // Get all public profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .order('updated_at', { ascending: false })

  const profileUrls = profiles?.map((profile) => ({
    url: `${baseUrl}/${profile.username}`,
    lastModified: new Date(profile.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...profileUrls,
  ]
}
