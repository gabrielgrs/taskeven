'use server'

import schemas, { TaskSchema } from '~/lib/mongoose'
import { parseObject } from './helpers'

export async function getSpaceById(spaceId: string) {
  const space = await schemas.space.findOne({ _id: spaceId })

  if (!space) throw Error('Space not found')

  return parseObject(space)
}

export async function getSpaceBySlug(listSlug: string) {
  const space = await schemas.space.findOne({ slug: listSlug })

  if (!space) throw Error('Space not found')

  return space
}

export async function getTasksBySpaceId(spaceId: string) {
  const space = await schemas.space
    .findOne({
      _id: spaceId,
    })
    .populate('tasks')

  if (!space) throw Error('Not found')

  return parseObject(space.tasks)
}

export async function insertTask(spaceId: string, taskData: Partial<TaskSchema>) {
  const space = await schemas.space.findOneAndUpdate(
    {
      _id: spaceId,
    },
    { $push: { tasks: { ...taskData } } },
    { new: true },
  )

  if (!space) throw Error('Not found')

  return parseObject(space.tasks.at(-1)!)
}

export async function removeTask(spaceId: string, taskId: string) {
  const space = await schemas.space.findOneAndUpdate(
    {
      _id: spaceId,
      'tasks._id': taskId,
    },
    { $pull: { tasks: { _id: taskId } } },
    { new: true },
  )

  if (!space) throw Error('Not found')
  return parseObject(space.tasks)
}

export async function updateTask(spaceId: string, taskId: string, task: Partial<TaskSchema>) {
  const dataToSet = Object.entries(task).reduce((acc: Record<string, unknown>, [key, value]) => {
    acc[`tasks.$.${key}`] = value
    return acc
  }, {})

  const space = await schemas.space.findOneAndUpdate(
    { _id: spaceId, 'tasks._id': taskId },
    { $set: dataToSet },
    { new: true },
  )

  if (!space) throw Error('Not found')

  return parseObject(space.tasks)
}
