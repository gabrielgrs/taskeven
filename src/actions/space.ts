'use server'

import ShortUniqueId from 'short-unique-id'
import slugify from 'slugify'
import schemas, { SpaceSchema } from '~/lib/mongoose'
import { getAuthenticatedUser } from './auth'
import { parseObject } from './helpers'
import { getDomain } from './helpers/server'

const uuid = new ShortUniqueId({ length: 10 })

const createSlug = (name: string) => slugify(`${name}-${uuid.rnd()}`, { lower: true, trim: true })

export async function insertSpace(name: string) {
  const user = await getAuthenticatedUser()
  if (!user) throw Error('Unauthorized access')

  const space = await schemas.space.create({ name, slug: createSlug(name), createdBy: user.identifier })

  if (!space) throw Error('Not found')

  const domain = getDomain()
  const response = await fetch(`${domain}/auth/setAuthSpace`, {
    method: 'POST',
    body: JSON.stringify({ spaceId: space._id }),
  })

  if (!response.ok) {
    await schemas.space.findOneAndDelete({ _id: space._id })
    throw Error('Something went wrong')
  }

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

export async function getSpacesWithTasks() {
  const lists = await schemas.space.find({})
  return parseObject(lists)
}

export type UserSpacesWithTasks = Awaited<ReturnType<typeof getSpacesWithTasks>>
