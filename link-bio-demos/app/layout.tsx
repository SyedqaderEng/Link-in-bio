import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Link-in-Bio Demo Themes',
  description: 'Beautiful link-in-bio page templates inspired by 2024-2025 design trends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
