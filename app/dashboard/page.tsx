import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Eye, MousePointerClick, Share2, TrendingUp, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect('/auth/login')
  }

  // Get profile
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  })

  if (!profile) {
    redirect('/auth/login')
  }

  // Get links
  const links = await prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { position: 'asc' },
  })

  // Get analytics summary (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const analytics = await prisma.analytics.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate stats
  const totalViews = analytics.filter(a => a.eventType === 'view').length
  const totalClicks = analytics.filter(a => a.eventType === 'click').length
  const totalShares = analytics.filter(a => a.eventType === 'share').length
  const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  // Get weekly data for bar chart
  const weeklyData = getWeeklyData(analytics)

  // Get top links by click count
  const topLinks = [...links]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 5)

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="gradient-text">Welcome back</span>, {profile.displayName || profile.username}
          </h1>
          <p className="text-gray-400">Here's what's happening with your links</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Large Stats - Views */}
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            label="Total Views"
            value={formatNumber(totalViews)}
            change="+12%"
            trend="up"
            large
          />

          {/* Clicks */}
          <StatCard
            icon={<MousePointerClick className="w-6 h-6" />}
            label="Total Clicks"
            value={formatNumber(totalClicks)}
            change="+8%"
            trend="up"
          />

          {/* Shares */}
          <StatCard
            icon={<Share2 className="w-6 h-6" />}
            label="Shares"
            value={formatNumber(totalShares)}
            change="+24%"
            trend="up"
          />

          {/* Click Rate */}
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Click Rate"
            value={`${clickRate.toFixed(1)}%`}
            change="+5%"
            trend="up"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Views Chart - Large */}
          <div className="lg:col-span-2 glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Views Over Time</h3>
            <div className="h-64">
              <ViewsChart data={weeklyData} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/editor"
                className="flex items-center gap-3 p-4 bg-gradient-vibrant rounded-lg hover:opacity-90 transition"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add New Link</span>
              </Link>
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="flex items-center gap-3 p-4 glass rounded-lg hover:bg-white/10 transition"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="font-semibold">View My Page</span>
              </Link>
              <Link
                href="/themes"
                className="flex items-center gap-3 p-4 glass rounded-lg hover:bg-white/10 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="font-semibold">Customize Theme</span>
              </Link>
            </div>
          </div>

          {/* Top Links */}
          <div className="lg:col-span-2 glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Top Performing Links</h3>
            {topLinks.length > 0 ? (
              <div className="space-y-4">
                {topLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-600">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{link.title}</div>
                      <div className="text-sm text-gray-400 truncate">{link.url}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">{formatNumber(link.clickCount)}</div>
                      <div className="text-sm text-gray-400">clicks</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No links yet. Add your first link to get started!</p>
                <Link href="/editor" className="inline-block mt-4 text-primary-cyan hover:underline">
                  Add Link →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {analytics.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    event.eventType === 'view' ? 'bg-primary-cyan' :
                    event.eventType === 'click' ? 'bg-primary-magenta' :
                    'bg-primary-lime'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      {event.eventType === 'view' && 'Profile viewed'}
                      {event.eventType === 'click' && 'Link clicked'}
                      {event.eventType === 'share' && 'Profile shared'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {analytics.length === 0 && (
                <p className="text-gray-400 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  icon,
  label,
  value,
  change,
  trend,
  large = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  large?: boolean
}) {
  return (
    <div className={`glass p-6 rounded-2xl ${large ? 'lg:col-span-2' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary-cyan">{icon}</div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-4xl font-extrabold gradient-text">{value}</div>
        <div className={`text-sm font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </div>
      </div>
    </div>
  )
}

function ViewsChart({ data }: { data: { day: string; views: number }[] }) {
  const maxViews = Math.max(...data.map(d => d.views), 1)

  return (
    <div className="h-full flex items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-white/5 rounded-t-lg relative group cursor-pointer"
            style={{ height: `${(item.views / maxViews) * 100}%`, minHeight: '20px' }}>
            <div className="absolute inset-0 bg-gradient-vibrant rounded-t-lg opacity-75" />

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-dark-surface border border-dark-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              {item.views} views
            </div>
          </div>
          <div className="text-xs text-gray-500">{item.day}</div>
        </div>
      ))}
    </div>
  )
}

function getWeeklyData(analytics: any[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const data = days.map(day => ({ day, views: 0 }))

  analytics.forEach(event => {
    if (event.eventType === 'view') {
      const date = new Date(event.createdAt)
      const dayIndex = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
      data[dayIndex].views++
    }
  })

  return data
}
