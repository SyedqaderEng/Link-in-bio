import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Unlimited links',
      'Basic analytics',
      '4 themes',
      'QR code',
    ],
  },
  pro: {
    name: 'Pro',
    price: 6,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Free',
      'Advanced analytics',
      'Link scheduling',
      'Custom CSS',
      'Remove branding',
      'Priority support',
    ],
  },
  lifetime: {
    name: 'Lifetime',
    price: 49,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID,
    features: [
      'Everything in Pro',
      'Lifetime access',
      'One-time payment',
      'Custom domains',
      'API access',
      'White-label option',
    ],
  },
}
