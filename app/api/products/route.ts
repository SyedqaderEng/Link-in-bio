import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

// GET /api/products - Get all products for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    const userId = searchParams.get('userId')

    if (!username && !userId) {
      return NextResponse.json({ error: 'Username or userId required' }, { status: 400 })
    }

    // Get user
    const user = await prisma.profile.findUnique({
      where: username ? { username } : { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get active products
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, type, price, currency, imageUrl, downloadUrl } = body

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    // Validate price
    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        userId: auth.userId,
        name,
        description,
        type: type || 'digital',
        price: numPrice,
        currency: currency || 'usd',
        imageUrl,
        downloadUrl,
        isActive: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
