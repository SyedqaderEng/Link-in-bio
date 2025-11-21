import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, buyerEmail, buyerName, successUrl, cancelUrl } = body

    if (!productId || !buyerEmail) {
      return NextResponse.json(
        { error: 'Product ID and buyer email are required' },
        { status: 400 }
      )
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!product.isActive) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 })
    }

    // Get or create customer profile
    let customer = await prisma.profile.findUnique({
      where: { email: buyerEmail },
    })

    if (!customer) {
      // Create a temporary customer profile for tracking
      customer = await prisma.profile.create({
        data: {
          email: buyerEmail,
          username: `buyer_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          displayName: buyerName || buyerEmail,
        },
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: product.currency,
            unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.imageUrl ? [product.imageUrl] : undefined,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/purchase/canceled`,
      metadata: {
        productId: product.id,
        customerId: customer.id,
        buyerEmail,
        buyerName: buyerName || '',
      },
    })

    // Create pending purchase record
    await prisma.purchase.create({
      data: {
        productId: product.id,
        customerId: customer.id,
        buyerEmail,
        buyerName,
        amount: product.price,
        currency: product.currency,
        status: 'pending',
        stripeCheckoutId: session.id,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
