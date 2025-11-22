import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// GET /api/links/scheduled - Get all scheduled links
export async function GET(request: Request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get links with schedules
    const scheduledLinks = await prisma.link.findMany({
      where: {
        userId: auth.userId,
        OR: [
          { scheduledStart: { not: null } },
          { scheduledEnd: { not: null } },
        ],
      },
      orderBy: { scheduledStart: 'asc' },
    })

    // Categorize links
    const now = new Date()
    const upcoming = scheduledLinks.filter(
      (link) => link.scheduledStart && new Date(link.scheduledStart) > now
    )
    const active = scheduledLinks.filter(
      (link) =>
        link.scheduledStart &&
        link.scheduledEnd &&
        new Date(link.scheduledStart) <= now &&
        new Date(link.scheduledEnd) >= now
    )
    const expired = scheduledLinks.filter(
      (link) => link.scheduledEnd && new Date(link.scheduledEnd) < now
    )

    return NextResponse.json({
      upcoming,
      active,
      expired,
      total: scheduledLinks.length,
    })
  } catch (error: any) {
    console.error('Error fetching scheduled links:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/links/scheduled - Schedule a link
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { linkId, scheduledStart, scheduledEnd } = body

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    // Verify ownership
    const link = await prisma.link.findUnique({
      where: { id: linkId },
    })

    if (!link || link.userId !== auth.userId) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Validate dates
    if (scheduledStart && scheduledEnd) {
      const start = new Date(scheduledStart)
      const end = new Date(scheduledEnd)
      if (end <= start) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Update link schedule
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: {
        scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      },
    })

    return NextResponse.json({ link: updatedLink })
  } catch (error: any) {
    console.error('Error scheduling link:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/links/scheduled - Remove schedule from link
export async function DELETE(request: Request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get('linkId')

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    // Verify ownership
    const link = await prisma.link.findUnique({
      where: { id: linkId },
    })

    if (!link || link.userId !== auth.userId) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Remove schedule
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: {
        scheduledStart: null,
        scheduledEnd: null,
      },
    })

    return NextResponse.json({ link: updatedLink })
  } catch (error: any) {
    console.error('Error removing schedule:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
