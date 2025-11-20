import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-local'
import { setSession } from '@/lib/session'
import { generateUsername } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const finalUsername = username || generateUsername(email)

    const result = await registerUser(email, password, finalUsername)

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Set session cookie
    await setSession(result.token)

    return NextResponse.json({
      user: result.user,
      token: result.token,
    })
  } catch (error: any) {
    console.error('Signup API error:', error)
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 })
  }
}
