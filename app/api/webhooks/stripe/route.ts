import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { randomBytes } from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { productId, customerId, buyerEmail, buyerName } = session.metadata || {}

    if (!productId || !customerId) {
      console.error('Missing metadata in checkout session')
      return
    }

    // Generate unique download token
    const downloadToken = randomBytes(32).toString('hex')

    // Update purchase record
    const purchase = await prisma.purchase.updateMany({
      where: {
        stripeCheckoutId: session.id,
        status: 'pending',
      },
      data: {
        status: 'completed',
        stripePaymentId: session.payment_intent as string,
        downloadToken,
      },
    })

    if (purchase.count === 0) {
      // Purchase might not exist yet, create it
      await prisma.purchase.create({
        data: {
          productId,
          customerId,
          buyerEmail: buyerEmail || session.customer_email || '',
          buyerName: buyerName || session.customer_details?.name || null,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || 'usd',
          status: 'completed',
          stripePaymentId: session.payment_intent as string,
          stripeCheckoutId: session.id,
          downloadToken,
        },
      })
    }

    // Increment sales count
    await prisma.product.update({
      where: { id: productId },
      data: {
        salesCount: { increment: 1 },
      },
    })

    console.log(`Payment completed for product ${productId}`)
  } catch (error) {
    console.error('Error handling checkout completion:', error)
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update purchase if it exists
    await prisma.purchase.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
      },
      data: {
        status: 'completed',
      },
    })

    console.log(`Payment succeeded: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update purchase to failed
    await prisma.purchase.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
      },
      data: {
        status: 'failed',
      },
    })

    console.log(`Payment failed: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handleRefund(charge: Stripe.Charge) {
  try {
    // Update purchase to refunded
    await prisma.purchase.updateMany({
      where: {
        stripePaymentId: charge.payment_intent as string,
      },
      data: {
        status: 'refunded',
      },
    })

    // Decrement sales count
    const purchase = await prisma.purchase.findFirst({
      where: {
        stripePaymentId: charge.payment_intent as string,
      },
    })

    if (purchase) {
      await prisma.product.update({
        where: { id: purchase.productId },
        data: {
          salesCount: { decrement: 1 },
        },
      })
    }

    console.log(`Refund processed for charge: ${charge.id}`)
  } catch (error) {
    console.error('Error handling refund:', error)
  }
}
