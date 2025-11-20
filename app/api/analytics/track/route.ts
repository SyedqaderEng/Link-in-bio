import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, linkId, eventType, referrer, country, city, device, browser } = await request.json()

    if (!userId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['view', 'click', 'share'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    await prisma.analytics.create({
      data: {
        userId,
        linkId: linkId || null,
        eventType,
        referrer,
        country,
        city,
        device,
        browser,
      },
    })

    // If it's a click event, increment the link click count
    if (eventType === 'click' && linkId) {
      await prisma.link.update({
        where: { id: linkId },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
