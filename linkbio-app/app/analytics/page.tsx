import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Eye, MousePointerClick, Share2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get analytics for different time periods
  const now = new Date()
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const prev30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const { data: currentPeriod } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', last30Days.toISOString())

  const { data: previousPeriod } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', prev30Days.toISOString())
    .lt('created_at', last30Days.toISOString())

  // Calculate metrics
  const currentViews = currentPeriod?.filter(a => a.event_type === 'view').length || 0
  const currentClicks = currentPeriod?.filter(a => a.event_type === 'click').length || 0
  const currentShares = currentPeriod?.filter(a => a.event_type === 'share').length || 0
  const currentCTR = currentViews > 0 ? (currentClicks / currentViews) * 100 : 0

  const previousViews = previousPeriod?.filter(a => a.event_type === 'view').length || 0
  const previousClicks = previousPeriod?.filter(a => a.event_type === 'click').length || 0
  const previousShares = previousPeriod?.filter(a => a.event_type === 'share').length || 0
  const previousCTR = previousViews > 0 ? (previousClicks / previousViews) * 100 : 0

  const viewsChange = calculateChange(currentViews, previousViews)
  const clicksChange = calculateChange(currentClicks, previousClicks)
  const sharesChange = calculateChange(currentShares, previousShares)
  const ctrChange = calculateChange(currentCTR, previousCTR)

  // Get top performing links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('click_count', { ascending: false })
    .limit(10)

  // Get geographic data
  const countries = getTopCountries(currentPeriod || [])

  // Get daily data for chart
  const dailyData = getDailyData(currentPeriod || [], 30)

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-gray-400">Last 30 days performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Eye className="w-6 h-6" />}
            label="Total Views"
            value={formatNumber(currentViews)}
            change={viewsChange}
          />
          <MetricCard
            icon={<MousePointerClick className="w-6 h-6" />}
            label="Total Clicks"
            value={formatNumber(currentClicks)}
            change={clicksChange}
          />
          <MetricCard
            icon={<Share2 className="w-6 h-6" />}
            label="Total Shares"
            value={formatNumber(currentShares)}
            change={sharesChange}
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Click Rate"
            value={`${currentCTR.toFixed(1)}%`}
            change={ctrChange}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Views & Clicks Chart */}
          <div className="lg:col-span-2 glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Performance Overview</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-cyan rounded-full" />
                  <span className="text-gray-400">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-magenta rounded-full" />
                  <span className="text-gray-400">Clicks</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <MultiLineChart data={dailyData} />
            </div>
          </div>

          {/* Top Countries */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Top Countries</h3>
            <div className="space-y-4">
              {countries.slice(0, 5).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{country.name || 'Unknown'}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-vibrant"
                        style={{ width: `${(country.count / countries[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold gradient-text w-12 text-right">
                      {country.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Links Table */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Top Performing Links</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-dark-border">
                  <th className="pb-4 text-gray-400 font-medium">Rank</th>
                  <th className="pb-4 text-gray-400 font-medium">Link</th>
                  <th className="pb-4 text-gray-400 font-medium">Clicks</th>
                  <th className="pb-4 text-gray-400 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {links?.map((link, index) => (
                  <tr key={link.id} className="border-b border-dark-border/50 hover:bg-white/5">
                    <td className="py-4">
                      <div className="text-2xl font-bold text-gray-600">#{index + 1}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold">{link.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-md">{link.url}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-xl font-bold gradient-text">{formatNumber(link.click_count)}</div>
                    </td>
                    <td className="py-4">
                      <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-vibrant"
                          style={{
                            width: `${links[0].click_count > 0 ? (link.click_count / links[0].click_count) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function MetricCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode
  label: string
  value: string
  change: number
}) {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary-cyan">{icon}</div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-4xl font-extrabold gradient-text">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function MultiLineChart({ data }: { data: { day: string; views: number; clicks: number }[] }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.views, d.clicks)), 1)

  return (
    <div className="h-full flex items-end justify-between gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col gap-1 items-center">
            {/* Views bar */}
            <div
              className="w-1/2 bg-primary-cyan/50 rounded-t"
              style={{ height: `${(item.views / maxValue) * 200}px`, minHeight: '2px' }}
              title={`${item.views} views`}
            />
            {/* Clicks bar */}
            <div
              className="w-1/2 bg-primary-magenta/50 rounded-t"
              style={{ height: `${(item.clicks / maxValue) * 200}px`, minHeight: '2px' }}
              title={`${item.clicks} clicks`}
            />
          </div>
          {index % 5 === 0 && (
            <div className="text-[10px] text-gray-500">{item.day}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

function getTopCountries(analytics: any[]) {
  const countryCounts = new Map<string, number>()

  analytics.forEach(event => {
    const country = event.country || 'Unknown'
    countryCounts.set(country, (countryCounts.get(country) || 0) + 1)
  })

  return Array.from(countryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

function getDailyData(analytics: any[], days: number) {
  const data: { day: string; views: number; clicks: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayAnalytics = analytics.filter(a =>
      a.created_at.startsWith(dateStr)
    )

    data.push({
      day: date.getDate().toString(),
      views: dayAnalytics.filter(a => a.event_type === 'view').length,
      clicks: dayAnalytics.filter(a => a.event_type === 'click').length,
    })
  }

  return data
}
