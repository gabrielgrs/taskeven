'use server'

import { faker } from '@faker-js/faker'
import ShortUniqueId from 'short-unique-id'
import slugify from 'slugify'
import schemas, { SpaceSchema } from '~/lib/mongoose'
import { getUserIdentifier } from './auth'
import { parseObject } from './helpers'

const uuid = new ShortUniqueId({ length: 10 })

const createSlug = (name: string) => slugify(`${name}-${uuid.rnd()}`, { lower: true, trim: true })

export async function createRandomSpace() {
  const randomName = `${faker.color.human()} ${faker.animal.type()}`
  const createdSpace = await insertSpace(randomName)
  return createdSpace
}

export async function insertSpace(name: string) {
  const userIdentifier = await getUserIdentifier()
  if (!userIdentifier) throw Error('Unauthorized access')

  const space = await schemas.space.create({ name, slug: createSlug(name), createdBy: userIdentifier })

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
  const userIdentifier = await getUserIdentifier()
  const spaces = await schemas.space.find({ createdBy: userIdentifier })
  return parseObject(spaces)
}
