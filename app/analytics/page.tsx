'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Link2,
  ExternalLink,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsStats {
  overview: {
    totalViews: number
    totalClicks: number
    clickThroughRate: number
    period: string
  }
  topLinks: Array<{
    id: string
    title: string
    url: string
    clicks: number
    totalClicks: number
  }>
  dailyStats: Array<{
    date: string
    views: number
    clicks: number
  }>
  trafficByCountry: Array<{
    country: string | null
    count: number
  }>
  trafficByDevice: Array<{
    device: string | null
    count: number
  }>
  trafficByBrowser: Array<{
    browser: string | null
    count: number
  }>
  topReferrers: Array<{
    referrer: string | null
    count: number
  }>
}

const COLORS = ['#00d4ff', '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7days')
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    loadStats()
  }, [period])

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/analytics/stats?period=${period}`)
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login')
          return
        }
        throw new Error('Failed to load analytics')
      }

      const data = await response.json()
      setStats(data)
    } catch (error: any) {
      console.error('Error loading analytics:', error)
      toast.error(error.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-400">Loading analytics...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats) return null

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold mb-2">
              <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-gray-400">Insights into your profile performance</p>
          </div>

          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-cyan/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary-cyan" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold">{formatNumber(stats.overview.totalViews)}</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold">{formatNumber(stats.overview.totalClicks)}</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Click-Through Rate</p>
                <p className="text-3xl font-bold">{stats.overview.clickThroughRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Traffic Chart */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Daily Traffic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  tick={{ fill: '#888' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#888" tick={{ fill: '#888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={{ fill: '#00d4ff' }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#43e97b"
                  strokeWidth={2}
                  dot={{ fill: '#43e97b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Distribution */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Traffic by Device</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.trafficByDevice}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percent }) =>
                    `${device || 'Unknown'}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.trafficByDevice.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Links & Geography */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Links */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Link2 className="w-6 h-6 text-primary-cyan" />
              Top Performing Links
            </h3>
            <div className="space-y-3">
              {stats.topLinks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No link data yet</p>
              ) : (
                stats.topLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">#{index + 1}</span>
                        <p className="font-semibold truncate">{link.title}</p>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{link.url}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary-cyan">{link.clicks}</p>
                      <p className="text-xs text-gray-400">clicks</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Countries */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-500" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {stats.trafficByCountry.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No geographic data yet</p>
              ) : (
                stats.trafficByCountry.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <p className="font-semibold">{item.country || 'Unknown'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${
                              (item.count / stats.trafficByCountry[0].count) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Browsers & Referrers */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Browsers */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Monitor className="w-6 h-6 text-purple-500" />
              Top Browsers
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.trafficByBrowser}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="browser" stroke="#888" tick={{ fill: '#888' }} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Referrers */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-yellow-500" />
              Top Referrers
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {stats.topReferrers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No referrer data yet</p>
              ) : (
                stats.topReferrers.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <p className="text-sm truncate flex-1">
                      {item.referrer || 'Direct'}
                    </p>
                    <span className="text-sm font-semibold ml-4">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
