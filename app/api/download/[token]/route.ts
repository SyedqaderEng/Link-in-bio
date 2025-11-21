import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: 'Download token required' }, { status: 400 })
    }

    // Find purchase by download token
    const purchase = await prisma.purchase.findUnique({
      where: {
        downloadToken: token,
        status: 'completed',
      },
      include: {
        product: true,
      },
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Invalid or expired download link' },
        { status: 404 }
      )
    }

    if (!purchase.product.downloadUrl) {
      return NextResponse.json(
        { error: 'No download available for this product' },
        { status: 404 }
      )
    }

    // Return download information
    return NextResponse.json({
      product: {
        name: purchase.product.name,
        description: purchase.product.description,
        downloadUrl: purchase.product.downloadUrl,
      },
      purchase: {
        purchaseDate: purchase.createdAt,
        amount: purchase.amount,
        currency: purchase.currency,
      },
    })
  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
