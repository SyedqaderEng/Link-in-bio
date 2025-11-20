import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface User {
  id: string
  email: string
  username: string
  display_name: string | null
  subscription_tier: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const result = await query(
      'SELECT id, email, username, display_name, subscription_tier, password_hash FROM profiles WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return null
    }

    const user = result.rows[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return null
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      display_name: user.display_name,
      subscription_tier: user.subscription_tier,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        subscription_tier: user.subscription_tier,
      },
      token,
    }
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function registerUser(
  email: string,
  password: string,
  username: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Check if user already exists
    const existing = await query('SELECT id FROM profiles WHERE email = $1 OR username = $2', [email, username])

    if (existing.rows.length > 0) {
      return { error: 'User already exists' }
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const result = await query(
      `INSERT INTO profiles (email, password_hash, username, subscription_tier)
       VALUES ($1, $2, $3, 'free')
       RETURNING id, email, username, display_name, subscription_tier`,
      [email, password_hash, username]
    )

    const user = result.rows[0]
    const token = generateToken(user)

    return { user, token }
  } catch (error: any) {
    console.error('Registration error:', error)
    return { error: error.message || 'Registration failed' }
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    const result = await query(
      'SELECT id, email, username, display_name, subscription_tier FROM profiles WHERE id = $1',
      [decoded.id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function changePassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    const password_hash = await hashPassword(newPassword)
    await query('UPDATE profiles SET password_hash = $1 WHERE id = $2', [password_hash, userId])
    return true
  } catch (error) {
    console.error('Change password error:', error)
    return false
  }
}
