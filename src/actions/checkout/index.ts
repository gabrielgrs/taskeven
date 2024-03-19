'use server'

import { ClientSession } from 'mongoose'
import schemas, { connectDatabase } from '~/libs/mongoose'
import stripeClient from '~/libs/stripe'
import { PlanName } from '~/utils/constants/types'
import { getAuthenticatedUser } from '../auth'
import { parseObject } from '../helpers'
import { getDomain } from '../helpers/server'

export async function createCheckout(priceId: string, spaceId: string) {
  const authenticatedUser = await getAuthenticatedUser()
  if (!authenticatedUser) throw Error('Unauthorized access')

  const {
    url,
    id: checkoutId,
    amount_total,
  } = await stripeClient.checkout.sessions.create({
    success_url: `${getDomain()}/checkout?spaceId=${spaceId}&type=success&checkoutSessionId={CHECKOUT_SESSION_ID}`,
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
  })

  const checkout = await schemas.checkout.create({
    payer: authenticatedUser._id,
    status: 'PENDING',
    checkoutId,
    price: amount_total,
    metadata: {
      priceId,
    },
  })

  if (!checkout) throw Error('Failed to create checkout')

  if (!url) {
    await schemas.checkout.findOneAndUpdate({ _id: checkout._id }, { status: 'FAILURE' })
    throw Error('Failed to process your request')
  }

  return url
}

export async function checkoutSuccess(checkoutSessionId: string, spaceId: string) {
  let session: ClientSession | null = null
  // let stripeCheckoutId: string | null = null

  try {
    const authenticatedUser = await getAuthenticatedUser()
    if (!authenticatedUser) throw Error('Unauthorized access')

    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const data = await stripeClient.checkout.sessions.retrieve(checkoutSessionId)

    // stripeCheckoutId = data.id

    if (data.status === 'complete') {
      const checkout = await schemas.checkout.findOneAndUpdate(
        { checkoutId: data.id, status: 'PENDING' },
        { status: 'SUCCESS' },
        { session, new: true },
      )

      if (!checkout) throw Error('Invalid checkout')
    } else {
      await schemas.checkout.findOneAndUpdate({ checkoutId: data.id }, { status: 'FAILURE' }, { session })
    }

    const foundSpace = await schemas.space.findOneAndUpdate(
      { _id: spaceId },
      { plan: 'PLUS' satisfies PlanName },
      { session, new: true },
    )

    if (!foundSpace) throw Error('Failed to get space')

    await session.commitTransaction()

    return parseObject(foundSpace)
  } catch (error) {
    await schemas.space.findOneAndDelete({ _id: spaceId })
    if (session) await session.abortTransaction()
    throw error
  }
}
