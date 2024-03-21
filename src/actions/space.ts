'use server'

import { Types } from 'mongoose'
import slugify from 'slugify'
import schemas, { SpaceSchema } from '~/libs/mongoose'
import { formatToSlug } from '~/utils/formattars'
import { getMyIP, getTokenData } from './auth'
import { parseObject } from './helpers'

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

const createSlug = (name: string) => slugify(`${name}-${new Types.ObjectId()}`, { lower: true, trim: true })

export async function getSpacesByUserIdentifier(): Promise<SpaceSchema[]> {
  const user = await getTokenData()
  if (user) {
    const spaces = await schemas.space.find({ createdBy: user.email })
    return parseObject(spaces)
  }

  const ip = await getMyIP()
  const spaces = await schemas.space.find({ createdBy: ip })
  if (spaces.length > 0) return parseObject(spaces)

  const space = await schemas.space.create({
    name: 'Personal Space',
    slug: formatToSlug(createSlug('Personal Space')),
    createdBy: ip,
  })
  return parseObject([space])
}
