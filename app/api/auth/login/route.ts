import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth-local'
import { setSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const result = await loginUser(email, password)

    if (!result) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Set session cookie
    await setSession(result.token)

    return NextResponse.json({
      user: result.user,
      token: result.token,
    })
  } catch (error: any) {
    console.error('Login API error:', error)
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 })
  }
}
