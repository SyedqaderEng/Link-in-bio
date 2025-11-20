import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/themes - Get all available themes
export async function GET(request: Request) {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ themes })
  } catch (error: any) {
    console.error('Themes API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
