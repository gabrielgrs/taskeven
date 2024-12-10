import { Stripe } from 'stripe'

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-11-20.acacia',
})

export default stripeClient
