import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth } from 'date-fns'

export async function GET(request: Request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7days' // 7days, 30days, 90days, all

    // Calculate date range
    let startDate: Date
    const endDate = endOfDay(new Date())

    switch (period) {
      case '7days':
        startDate = startOfDay(subDays(new Date(), 7))
        break
      case '30days':
        startDate = startOfDay(subDays(new Date(), 30))
        break
      case '90days':
        startDate = startOfDay(subDays(new Date(), 90))
        break
      case 'week':
        startDate = startOfWeek(new Date())
        break
      case 'month':
        startDate = startOfMonth(new Date())
        break
      default:
        startDate = startOfDay(subDays(new Date(), 7))
    }

    // Get total views
    const totalViews = await prisma.analytics.count({
      where: {
        userId: auth.userId,
        eventType: 'view',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Get total clicks
    const totalClicks = await prisma.analytics.count({
      where: {
        userId: auth.userId,
        eventType: 'click',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Get click-through rate
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

    // Get top links
    const topLinks = await prisma.link.findMany({
      where: {
        userId: auth.userId,
      },
      select: {
        id: true,
        title: true,
        url: true,
        clickCount: true,
        analytics: {
          where: {
            eventType: 'click',
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      orderBy: {
        clickCount: 'desc',
      },
      take: 5,
    })

    // Get views/clicks by day
    const dailyStats = await prisma.$queryRaw<
      Array<{ date: string; views: bigint; clicks: bigint }>
    >`
      SELECT
        DATE(created_at) as date,
        COUNT(CASE WHEN event_type = 'view' THEN 1 END) as views,
        COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks
      FROM analytics
      WHERE user_id = ${auth.userId}::uuid
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `

    // Get traffic by country
    const trafficByCountry = await prisma.analytics.groupBy({
      by: ['country'],
      where: {
        userId: auth.userId,
        country: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get traffic by device
    const trafficByDevice = await prisma.analytics.groupBy({
      by: ['device'],
      where: {
        userId: auth.userId,
        device: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    })

    // Get traffic by browser
    const trafficByBrowser = await prisma.analytics.groupBy({
      by: ['browser'],
      where: {
        userId: auth.userId,
        browser: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    })

    // Get referrers
    const topReferrers = await prisma.analytics.groupBy({
      by: ['referrer'],
      where: {
        userId: auth.userId,
        referrer: { not: null },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    return NextResponse.json({
      overview: {
        totalViews,
        totalClicks,
        clickThroughRate: Number(clickThroughRate.toFixed(2)),
        period,
      },
      topLinks: topLinks.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        clicks: link.analytics.length,
        totalClicks: link.clickCount,
      })),
      dailyStats: dailyStats.map((stat) => ({
        date: stat.date,
        views: Number(stat.views),
        clicks: Number(stat.clicks),
      })),
      trafficByCountry: trafficByCountry.map((item) => ({
        country: item.country,
        count: item._count.id,
      })),
      trafficByDevice: trafficByDevice.map((item) => ({
        device: item.device,
        count: item._count.id,
      })),
      trafficByBrowser: trafficByBrowser.map((item) => ({
        browser: item.browser,
        count: item._count.id,
      })),
      topReferrers: topReferrers.map((item) => ({
        referrer: item.referrer,
        count: item._count.id,
      })),
    })
  } catch (error: any) {
    console.error('Analytics stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
