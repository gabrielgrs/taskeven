'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getSpacesWithTasks, insertSpace, removeSpace, updateSpace } from '~/actions/space'
import { insertTask, removeTask, updateTask } from '~/actions/task'
import { SpaceSchema, TaskSchema } from '~/lib/mongoose'

export default function useSpaces(initialState: SpaceSchema[]) {
  const [spaces, setSpaces] = useState<SpaceSchema[]>(initialState)
  const { push } = useRouter()

  const onRefetch = useCallback(async () => {
    const data = await getSpacesWithTasks()
    setSpaces(data)
  }, [])

  const onFallbackError = useCallback(
    (error: any) => {
      toast.error('Something went wrong. We will retrieve the data from the server.')
      // sendErrorEmail(error?.toString?.())
      onRefetch()
      return error
    },
    [onRefetch],
  )

  const onAddSpace = useCallback(
    async (name: string) => {
      try {
        const createdSpace = await insertSpace(name)
        setSpaces((p) => [...p, createdSpace])
        toast.success('Space created!')
        push('/app')
        return Promise.resolve(createdSpace)
      } catch (error) {
        onFallbackError(error)
      }
    },
    [onFallbackError, push],
  )

  const onUpdateSpace = useCallback(
    async (spaceId: string, spaceData: Partial<SpaceSchema>) => {
      try {
        const updatedSpace = await updateSpace(spaceId, spaceData)

        setSpaces((p) =>
          p.map((space) => {
            if (space._id !== spaceId) return space
            return { ...updatedSpace, members: space.members }
          }),
        )
        toast.success('Space updated!')
        return Promise.resolve(updatedSpace)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError],
  )

  const onRemoveSpace = useCallback(
    async (spaceId: string) => {
      try {
        await removeSpace(spaceId)
        setSpaces((p) => p.filter((space) => space._id !== spaceId))
        // toast.success('Space removed!')
        push('/app')
        return Promise.resolve({ message: 'Success' })
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError, push],
  )

  const onAddTask = useCallback(
    async (spaceId: string, taskData: Partial<TaskSchema>) => {
      try {
        const createdTask = await insertTask(spaceId!, taskData)

        setSpaces((p) =>
          p.map((space) => {
            if (space._id !== spaceId) return space
            return { ...space, tasks: [...space.tasks, createdTask] }
          }),
        )

        // toast.success('Task addedd!')

        return Promise.resolve(createdTask)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError],
  )

  const onRemoveTask = useCallback(
    async (spaceId: string, taskId: string) => {
      try {
        await removeTask(spaceId, taskId)
        setSpaces((p) =>
          p.map((space) => {
            if (space._id !== spaceId) return space
            return { ...space, tasks: space.tasks.filter((t) => t._id !== taskId) }
          }),
        )

        // toast.success('Task removed!')
        return Promise.resolve({ message: 'Success' })
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError],
  )

  const onUpdateTask = useCallback(
    async (spaceId: string, taskId: string, values: Partial<TaskSchema>) => {
      try {
        const updatedTask = await updateTask(spaceId, taskId, values)

        setSpaces((p) =>
          p.map((space) => {
            if (space._id !== spaceId) return space
            return {
              ...space,
              tasks: space.tasks.map((task) => {
                if (task._id !== taskId) return task
                return { ...task, ...values }
              }),
            }
          }),
        )
        toast.success('Task updated!')
        return Promise.resolve(updatedTask)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError],
  )

  return {
    spaces,
    onAddSpace,
    onUpdateSpace,
    onRemoveSpace,
    onAddTask,
    onRemoveTask,
    onUpdateTask,
  }
}
