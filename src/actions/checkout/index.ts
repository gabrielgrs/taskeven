'use server'

import { randomUUID } from 'crypto'
import { ClientSession } from 'mongoose'
import slugify from 'slugify'
import schemas, { connectDatabase } from '~/libs/mongoose'
import stripeClient from '~/libs/stripe'
import { PlanName } from '~/utils/constants/types'
import { formatToSlug } from '~/utils/formattars'
import { getTokenData } from '../auth'
import { parseObject } from '../helpers'
import { getDomain } from '../helpers/server'

const createSlug = (name: string) => slugify(`${name}-${randomUUID()}`, { lower: true, trim: true })

export async function createCheckout(priceId: string, spaceId?: string) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const createdSpace = await schemas.space.create({
    name: 'Personal Space',
    slug: formatToSlug(createSlug('Personal Space')),
  })

  const {
    url,
    id: checkoutId,
    amount_total,
  } = await stripeClient.checkout.sessions.create({
    success_url: `${getDomain()}/checkout?spaceId=${spaceId || createdSpace._id}&type=success&checkoutSessionId={CHECKOUT_SESSION_ID}`,
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
  })

  const checkout = await schemas.checkout.create({
    payer: user.email,
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
    const tokenData = await getTokenData()
    if (!tokenData) throw Error('Unauthorized access')

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
