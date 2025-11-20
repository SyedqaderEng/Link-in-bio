'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Link2, Palette, BarChart3, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Link2, label: 'My Links', href: '/editor' },
    { icon: Palette, label: 'Themes', href: '/themes' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-20 glass border-r border-dark-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-vibrant" />
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition group relative ${
                isActive
                  ? 'bg-gradient-vibrant'
                  : 'hover:bg-white/10'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />

              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-red-500/20 transition group relative"
        title="Logout"
      >
        <LogOut className="w-6 h-6" />

        {/* Tooltip */}
        <span className="absolute left-full ml-4 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Logout
        </span>
      </button>
    </div>
  )
}
