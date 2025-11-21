import { NextResponse } from 'next/server'

interface Metadata {
  title?: string
  description?: string
  image?: string
  icon?: string
  url: string
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkBioBot/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: response.status }
      )
    }

    const html = await response.text()

    // Extract metadata using regex patterns
    const metadata: Metadata = {
      url: validUrl.toString(),
    }

    // Extract Open Graph tags (preferred)
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)
    const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)

    // Extract Twitter Card tags (fallback)
    const twitterTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i)
    const twitterDescription = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i)
    const twitterImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)

    // Extract standard meta tags (fallback)
    const metaDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    const titleTag = html.match(/<title>([^<]+)<\/title>/i)

    // Extract favicon
    const favicon = html.match(/<link\s+rel=["'](?:icon|shortcut icon)["']\s+(?:type=["'][^"']+["']\s+)?href=["']([^"']+)["']/i)

    // Priority: OG > Twitter > Standard
    metadata.title = ogTitle?.[1] || twitterTitle?.[1] || titleTag?.[1] || validUrl.hostname
    metadata.description = ogDescription?.[1] || twitterDescription?.[1] || metaDescription?.[1]
    metadata.image = ogImage?.[1] || twitterImage?.[1]

    // Handle relative favicon URLs
    if (favicon?.[1]) {
      try {
        const faviconUrl = new URL(favicon[1], validUrl.origin)
        metadata.icon = faviconUrl.toString()
      } catch {
        metadata.icon = `${validUrl.origin}/favicon.ico`
      }
    } else {
      metadata.icon = `${validUrl.origin}/favicon.ico`
    }

    // Handle relative image URLs
    if (metadata.image && !metadata.image.startsWith('http')) {
      try {
        const imageUrl = new URL(metadata.image, validUrl.origin)
        metadata.image = imageUrl.toString()
      } catch {
        metadata.image = undefined
      }
    }

    // Decode HTML entities in text content
    const decodeHTML = (text: string) => {
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'")
    }

    if (metadata.title) metadata.title = decodeHTML(metadata.title)
    if (metadata.description) metadata.description = decodeHTML(metadata.description)

    // Trim long descriptions
    if (metadata.description && metadata.description.length > 200) {
      metadata.description = metadata.description.substring(0, 197) + '...'
    }

    return NextResponse.json({ metadata })
  } catch (error: any) {
    console.error('Metadata fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch metadata' },
      { status: 500 }
    )
  }
}
