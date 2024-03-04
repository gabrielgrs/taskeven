'use server'

import { ClientSession } from 'mongoose'
import { getTokenData } from '~/lib/jwt'
import schemas, { connectDatabase } from '~/lib/mongoose'
import stripeClient from '~/lib/stripe'
import { getCookie } from '~/utils/storage'
import { updateUserCredits } from './auth'
import { parseObject } from './helpers'
import { getDomain } from './helpers/server'

export async function createCheckout(priceId: string) {
  const authenticatedUser = await getTokenData()
  const token = getCookie('token')

  if (!authenticatedUser) throw Error('Unauthorized access')

  const {
    url,
    id: checkoutId,
    amount_total,
  } = await stripeClient.checkout.sessions.create({
    success_url: `${getDomain()}/recharge/success?token=${token}checkoutSessionId={CHECKOUT_SESSION_ID}`,
    mode: 'payment',
    currency: 'usd',
    line_items: [{ price: priceId, quantity: 1 }],
  })

  await schemas.checkout.create({
    payer: authenticatedUser._id,
    status: 'PENDING',
    checkoutId,
    price: amount_total,
  })

  return { url }
}

export async function getProducts() {
  const { data } = await stripeClient.products.list({ active: true })

  const products = await Promise.all(
    data
      .filter((product) => Boolean(product.default_price))
      .map(async (product) => {
        const foundPrice = await stripeClient.prices.retrieve(product.default_price?.toString()!)

        return { priceId: foundPrice.id, productName: product.name }
      }),
  )

  return parseObject(products)
}

export async function checkoutSuccess(checkoutSessionId: string) {
  let session: ClientSession | null = null
  // let stripeCheckoutId: string | null = null

  try {
    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const data = await stripeClient.checkout.sessions.retrieve(checkoutSessionId)

    // stripeCheckoutId = data.id

    if (data.status === 'complete') {
      const checkout = await schemas.checkout.findOneAndUpdate(
        { checkoutId: data.id, status: 'PENDING' },
        { status: 'SUCCESS' },
        { session },
      )

      if (!checkout) throw Error('Invalid checkout')

      const credits = data.amount_total

      if (!credits) throw Error('Invalid credits data')

      await updateUserCredits(Number(credits), 'increase', session)
    } else {
      await schemas.checkout.findOneAndUpdate({ checkoutId: data.id }, { status: 'SUCCESS' }, { session })
    }

    await session.commitTransaction()

    return parseObject({})
  } catch (error) {
    // TODO: create refund
    // await stripeClient.refunds.create({})

    if (session) await session.abortTransaction()
    throw error
  } finally {
    if (session) await session.endSession()
  }
}
