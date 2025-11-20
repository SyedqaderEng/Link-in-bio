import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/profile?username=xxx - Get public profile (or authenticated user's profile)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (username) {
      // Public profile fetch
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          theme: true,
        },
      })

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      return NextResponse.json({ profile })
    } else {
      // Authenticated user's profile
      const user = await getSession()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: {
          theme: true,
        },
      })

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      return NextResponse.json({ profile })
    }
  } catch (error: any) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update authenticated user's profile
export async function PUT(request: Request) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, displayName, bio, avatarUrl, themeId, customCss, customDomain } = body

    const updateData: any = {}
    if (username !== undefined) updateData.username = username
    if (displayName !== undefined) updateData.displayName = displayName
    if (bio !== undefined) updateData.bio = bio
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
    if (themeId !== undefined) updateData.themeId = themeId
    if (customCss !== undefined) updateData.customCss = customCss
    if (customDomain !== undefined) updateData.customDomain = customDomain

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: updateData,
    })

    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/profile - Delete authenticated user's account
export async function DELETE(request: Request) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete profile (cascades to links and analytics via Prisma schema)
    await prisma.profile.delete({
      where: { id: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
