'use server'

import Stripe from 'stripe'
import stripeClient from '~/libs/stripe'
import { parseObject } from '../helpers'

export type StripePrice = Stripe.Price

export async function createProduct(name: string, amount: number, metadata?: StripePrice['metadata']) {
  const price = await stripeClient.prices.create({
    active: true,
    currency: 'usd',
    nickname: name,
    unit_amount: amount,
    product_data: { name },
    metadata,
  })

  return parseObject(price)
}

export async function getPrices() {
  const { data } = await stripeClient.prices.list({ active: true })

  return parseObject(data) as StripePrice[]
}

export async function disableAllPrices() {
  const { data } = await stripeClient.prices.list()

  const response = await Promise.all(data.map((price) => stripeClient.prices.update(price.id, { active: false })))
  return parseObject(response)
}
