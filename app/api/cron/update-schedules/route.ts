import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint can be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// to automatically activate/deactivate links based on their schedule
export async function GET(request: Request) {
  try {
    // Optional: Add authorization header check for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'change-this-in-production'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    let activatedCount = 0
    let deactivatedCount = 0

    // Get all links with schedules
    const scheduledLinks = await prisma.link.findMany({
      where: {
        OR: [
          { scheduledStart: { not: null } },
          { scheduledEnd: { not: null } },
        ],
      },
    })

    for (const link of scheduledLinks) {
      let shouldBeActive = link.isActive

      // Check if link should be activated
      if (link.scheduledStart && new Date(link.scheduledStart) <= now) {
        if (!link.scheduledEnd || new Date(link.scheduledEnd) >= now) {
          shouldBeActive = true
        }
      }

      // Check if link should be deactivated
      if (link.scheduledEnd && new Date(link.scheduledEnd) < now) {
        shouldBeActive = false
      }

      // Update if status changed
      if (shouldBeActive !== link.isActive) {
        await prisma.link.update({
          where: { id: link.id },
          data: { isActive: shouldBeActive },
        })

        if (shouldBeActive) {
          activatedCount++
        } else {
          deactivatedCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      activatedCount,
      deactivatedCount,
      totalProcessed: scheduledLinks.length,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    )
  }
}

// Also support POST for flexibility
export async function POST(request: Request) {
  return GET(request)
}
