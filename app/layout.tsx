import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkBio - Your Link in Bio Tool',
  description: 'Create a beautiful link-in-bio page in minutes. Share all your content with one link.',
  keywords: ['link in bio', 'social media', 'creator tools', 'linktree alternative'],
  authors: [{ name: 'LinkBio' }],
  openGraph: {
    title: 'LinkBio - Your Link in Bio Tool',
    description: 'Create a beautiful link-in-bio page in minutes',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
