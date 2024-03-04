import { Stripe } from 'stripe'

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export default stripeClient
