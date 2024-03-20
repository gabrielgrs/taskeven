'use server'

import schemas, { SpaceSchema } from '~/libs/mongoose'
import { PLANS } from '~/utils/constants'
import { formatToSlug } from '~/utils/formattars'
import { getTokenData } from './auth'
import { parseObject } from './helpers'

export async function getPlanBySpaceId(spaceId: string) {
  const space = await schemas.space.findOne({ _id: spaceId })
  if (!space) throw Error('Not found')
  const plan = PLANS[space.plan]
  return parseObject(plan)
}

export async function insertSpace(name: string, slug: string) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const space = await schemas.space.create({ name, slug: formatToSlug(slug), createdBy: user.email })

  return parseObject(space)
}

export async function removeSpace(spaceId: string) {
  const space = await schemas.space.findOneAndDelete({ _id: spaceId })

  if (!space) throw Error('Not found')

  return parseObject(space)
}

export async function updateSpace(spaceId: string, data: Partial<SpaceSchema>) {
  const space = await schemas.space.findOneAndUpdate({ _id: spaceId }, data, { new: true })

  if (!space) throw Error('Not found')
  return parseObject(space)
}

export async function getSpacesByUserIdentifier() {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')
  const spaces = await schemas.space.find({ $or: [{ createdBy: user.email }] })
  return parseObject(spaces)
}
