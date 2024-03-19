'use server'

import { createToken, decodeToken } from '~/libs/jose'
import schemas, { SpaceSchema } from '~/libs/mongoose'
import { getTokenData } from '~/utils/auth'
import { PLANS } from '~/utils/constants'
import { formatToSlug } from '~/utils/formattars'
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

  const space = await schemas.space.create({ name, slug: formatToSlug(slug), createdBy: user._id })

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

  const { canShare } = await getPlanBySpaceId(spaceId)
  if (!canShare) throw Error('Not allowed')

  const space = await schemas.space.findOne({ _id: spaceId, createdBy: user._id })
  if (!space) throw Error('Not found')

  const shareToken = await createToken({ _id: space._id, email: user.email, role: user.role }, '30m')
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
