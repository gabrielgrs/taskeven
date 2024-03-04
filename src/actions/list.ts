'use server'

import { ClientSession } from 'mongoose'
import ShortUniqueId from 'short-unique-id'
import slugify from 'slugify'
import { getTokenData } from '~/lib/jwt'
import schemas, { ListSchema, connectDatabase } from '~/lib/mongoose'
import { costs } from '~/utils/configurations'
import { updateUserCredits } from './auth'
import { parseObject, isOwnerOrMemberWithEditPermission } from './helpers'

const uuid = new ShortUniqueId({ length: 10 })

const createSlug = (name: string) => slugify(`${name}-${uuid.rnd()}`, { lower: true, trim: true })

export async function insertList(name: string) {
  let session: ClientSession | null = null

  try {
    const user = await getTokenData()
    if (!user) throw Error('Unauthorized access')

    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const list = await schemas.list
      .create([{ name, slug: createSlug(name), createdBy: user._id }], { session })
      .then((res) => res[0])

    if (!list) throw Error('Not found')

    const updatedUser = await updateUserCredits(costs.CREATE_LIST, 'decrease', session)

    if (!updatedUser) throw Error('Not found')

    if (updatedUser.credits < 0) throw Error('Not enough credits')

    await session.commitTransaction()

    return parseObject(list)
  } catch (error) {
    if (session) await session.abortTransaction()
    throw error
  } finally {
    if (session) await session.endSession()
  }
}

export async function removeList(listId: string) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const list = await schemas.list.findOneAndDelete({ _id: listId, ...isOwnerOrMemberWithEditPermission(user._id) })

  if (!list) throw Error('Not found')

  return parseObject(list)
}

export async function updateList(listId: string, data: Partial<ListSchema>) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const list = await schemas.list.findOneAndUpdate(
    { _id: listId, ...isOwnerOrMemberWithEditPermission(user._id) },
    data,
    { new: true },
  )

  if (!list) throw Error('Not found')
  return parseObject(list)
}

export async function getUserListsWithTasksAndMembers() {
  const user = await getTokenData()

  if (!user) return []

  const lists = await schemas.list
    .find({
      $or: [{ createdBy: user._id }, { 'members.user': user._id }],
    })
    .populate('members.user')

  return parseObject(lists)
}

export type UserListsWithTasks = Awaited<ReturnType<typeof getUserListsWithTasksAndMembers>>
