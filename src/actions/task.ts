'use server'

import { ClientSession } from 'mongoose'
import { requestCompletion } from '~/lib/chatgpt'
import { getTokenData } from '~/lib/jwt'
import schemas, { MemberSchema, TaskSchema, connectDatabase } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import { costs } from '~/utils/configurations'
import { getTasksCosts } from '~/utils/pricing'
import { updateUserCredits } from './auth'
import { parseObject } from './helpers'
import { isOwnerOrMemberWithEditPermission } from './helpers'

const getPermission = (userId: string, createdBy: string, members: MemberSchema[]): Permission => {
  if (userId === createdBy) return 'EDIT'
  return members.find((x) => x.user._id === userId)?.permission || 'VIEW'
}

export async function getListTasksBySlug(listSlug: string) {
  const user = await getTokenData()

  if (!user) throw Error('Unauthorized access')

  const list = await schemas.list
    .findOne({
      slug: listSlug,
      $or: [{ createdBy: user._id }, { 'members.user': user._id }],
    })
    .populate('tasks')

  if (!list) throw Error('List not')

  return parseObject({
    _id: list._id,
    name: list.name,
    tasks: list?.tasks || [],
    permission: getPermission(user._id, String(list.createdBy), list.members),
  })
}

export async function getTasksByListId(listId: string) {
  const user = await getTokenData()
  if (!user) return []

  const list = await schemas.list
    .findOne({
      _id: listId,
      $or: [{ createdBy: user._id }, { 'members.user': user._id }],
    })
    .populate('tasks')

  if (!list) throw Error('Not found')

  return parseObject(list.tasks)
}

export async function insertTask(listId: string, taskData: Partial<TaskSchema>) {
  let session: ClientSession | null = null

  try {
    const user = await getTokenData()
    if (!user) throw Error('Unauthorized access')

    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const list = await schemas.list.findOneAndUpdate(
      {
        _id: listId,
        ...isOwnerOrMemberWithEditPermission(user._id),
      },
      { $push: { tasks: { ...taskData, createdById: user._id } } },
      { new: true, session },
    )

    if (!list) throw Error('Not found')

    const taskCosts = getTasksCosts(taskData)
    const creditsToDecrease = costs.CREATE_TASK + taskCosts

    const updatedUser = await updateUserCredits(creditsToDecrease, 'decrease', session)

    if (!updatedUser) throw Error('Not found')

    if (updatedUser.credits < 0) throw Error('Not enough credits')

    await session.commitTransaction()

    return parseObject(list.tasks.at(-1)!)
  } catch (error) {
    if (session) await session.abortTransaction()
    throw error
  } finally {
    if (session) await session.endSession()
  }
}

export async function removeTask(listId: string, taskId: string) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const list = await schemas.list.findOneAndUpdate(
    {
      _id: listId,
      'tasks._id': taskId,
      ...isOwnerOrMemberWithEditPermission(user._id),
    },
    { $pull: { tasks: { _id: taskId } } },
    { new: true },
  )

  if (!list) throw Error('Not found')
  return parseObject(list.tasks)
}

export async function updateTask(listId: string, taskId: string, task: Partial<TaskSchema>) {
  let session: ClientSession | null = null

  try {
    const user = await getTokenData()
    if (!user) throw Error('Unauthorized access')

    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const dataToSet = Object.entries(task).reduce((acc: Record<string, unknown>, [key, value]) => {
      acc[`tasks.$.${key}`] = value
      return acc
    }, {})

    const list = await schemas.list.findOneAndUpdate(
      { _id: listId, 'tasks._id': taskId, ...isOwnerOrMemberWithEditPermission(user._id) },
      { $set: dataToSet },
      { new: true, session },
    )

    if (!list) throw Error('Not found')

    await updateUserCredits(getTasksCosts(task), 'decrease', session)

    await session.commitTransaction()

    return parseObject(list.tasks)
  } catch (error) {
    if (session) await session.abortTransaction()
    throw error
  } finally {
    if (session) await session.endSession()
  }
}

export async function generateAnnotationWithAI(message: string) {
  let session: ClientSession | null = null

  try {
    const user = await getTokenData()
    if (!user) throw Error('Unauthorized access')

    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const completion = await requestCompletion(message)

    await updateUserCredits(costs.GENERATE_ANNOTATION_WITH_AI, 'decrease', session)

    await session.commitTransaction()

    return parseObject(completion)
  } catch (error) {
    if (session) await session.abortTransaction()
    throw error
  } finally {
    if (session) await session.endSession()
  }
}
