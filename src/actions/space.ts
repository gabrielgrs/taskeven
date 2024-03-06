'use server'

import { faker } from '@faker-js/faker'
import ShortUniqueId from 'short-unique-id'
import slugify from 'slugify'
import { createToken, decodeToken, getTokenData } from '~/lib/jwt'
import schemas, { SpaceSchema } from '~/lib/mongoose'
import { parseObject } from './helpers'

const uuid = new ShortUniqueId({ length: 10 })

const createSlug = (name: string) => slugify(`${name}-${uuid.rnd()}`, { lower: true, trim: true })

export async function createRandomSpace() {
  const randomName = `${faker.color.human()} ${faker.animal.type()}`
  const createdSpace = await insertSpace(randomName)
  return parseObject(createdSpace)
}

export async function insertSpace(name: string) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const space = await schemas.space.create({ name, slug: createSlug(name), createdBy: user._id })

  if (!space) throw Error('Not found')

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
  const spaces = await schemas.space.find({
    $or: [{ createdBy: user._id }, { members: user._id }],
  })
  return parseObject(spaces)
}

export async function generateShareLink(spaceId: string) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const space = await schemas.space.findOne({ _id: spaceId, createdBy: user._id })
  if (!space) throw Error('Not found')

  const shareToken = await createToken({ _id: space._id }, '30m')
  return parseObject(shareToken)
}

export async function validateInvite(inviteToken: string) {
  const decodedInviteToken = await decodeToken(inviteToken)
  if (!decodedInviteToken) throw Error('Invalid invite')

  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const space = await schemas.space.findOneAndUpdate({ _id: decodedInviteToken._id }, { $push: { members: user._id } })
  if (!space) throw Error('Invalid space')

  return parseObject(space)
}
