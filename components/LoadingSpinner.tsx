'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-cyan`} />
      {text && (
        <p className="text-gray-400 text-sm font-medium">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm z-50">
        {content}
      </div>
    )
  }

  return content
}

interface LoadingOverlayProps {
  loading: boolean
  children: React.ReactNode
  text?: string
}

export function LoadingOverlay({ loading, children, text }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/60 backdrop-blur-sm rounded-2xl z-10">
          <LoadingSpinner size="md" text={text} />
        </div>
      )}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass p-6 rounded-2xl animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/10 rounded"
          style={{ width: `${Math.random() * 30 + 60}%` }}
        ></div>
      ))}
    </div>
  )
}
