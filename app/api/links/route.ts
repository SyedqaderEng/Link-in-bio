import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/links - Get links for a user (public or authenticated)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const links = await prisma.link.findMany({
      where: {
        userId: profile.id,
        isActive: true,
      },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({ links })
  } catch (error: any) {
    console.error('Links API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/links - Create a new link
export async function POST(request: Request) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, url, icon, position, isActive, scheduledStart, scheduledEnd } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL required' }, { status: 400 })
    }

    // Get the current max position for this user
    const maxPositionLink = await prisma.link.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    const newPosition = position !== undefined ? position : (maxPositionLink?.position || 0) + 1

    const link = await prisma.link.create({
      data: {
        userId: user.id,
        title,
        url,
        icon,
        position: newPosition,
        isActive: isActive !== false,
        scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      },
    })

    return NextResponse.json({ link })
  } catch (error: any) {
    console.error('Create link error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
