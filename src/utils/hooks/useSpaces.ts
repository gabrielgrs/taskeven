'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSpacesByUserIdentifier, insertSpace, removeSpace, updateSpace } from '~/actions/space'
import { insertTask, removeTask, updateTask } from '~/actions/task'
import { SpaceSchema, TaskSchema } from '~/libs/mongoose'

export default function useSpaces() {
  const queryClient = useQueryClient()
  const { slug } = useParams()

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const data = await getSpacesByUserIdentifier()
      return data
    },
  })

  const onRefetch = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['spaces'] })
  }, [queryClient])

  const onFallbackError = useCallback(
    (error: any) => {
      toast.error(error.message || 'Something went wrong. We will retrieve the data from the server.')
      // sendErrorEmail(error?.toString?.())
      onRefetch()
      return error
    },
    [onRefetch],
  )

  const onAddSpace = useCallback(
    async (name: string, slug: string) => {
      try {
        const createdSpace = await insertSpace(name, slug)
        toast.success('Space created!')
        onRefetch()
        return Promise.resolve(createdSpace)
      } catch (error) {
        onFallbackError(error)
      }
    },
    [onFallbackError, onRefetch],
  )

  const onUpdateSpace = useCallback(
    async (spaceId: string, spaceData: Partial<SpaceSchema>) => {
      try {
        const updatedSpace = await updateSpace(spaceId, spaceData)
        onRefetch()

        toast.success('Space updated!')
        return Promise.resolve(updatedSpace)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError, onRefetch],
  )

  const onRemoveSpace = useCallback(
    async (spaceId: string) => {
      try {
        await removeSpace(spaceId)
        onRefetch()
        return Promise.resolve({ message: 'Success' })
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError, onRefetch],
  )

  const onAddTask = useCallback(
    async (spaceId: string, taskData: Partial<TaskSchema>) => {
      try {
        const createdTask = await insertTask(spaceId, taskData)
        onRefetch()

        return Promise.resolve(createdTask)
      } catch (error) {
        onFallbackError(error)
        // return Promise.reject(error)
      }
    },
    [onFallbackError, onRefetch],
  )

  const onRemoveTask = useCallback(
    async (spaceId: string, taskId: string) => {
      try {
        await removeTask(spaceId, taskId)
        onRefetch()

        // toast.success('Task removed!')
        return Promise.resolve({ message: 'Success' })
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError, onRefetch],
  )

  const onUpdateTask = useCallback(
    async (spaceId: string, taskId: string, values: Partial<TaskSchema>) => {
      try {
        const updatedTask = await updateTask(spaceId, taskId, values)
        onRefetch()
        toast.success('Task updated!')
        return Promise.resolve(updatedTask)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError, onRefetch],
  )

  const currentSpace = spaces.find((space) => space.slug === slug)

  return {
    spaces,
    currentSpace,
    isLoading,
    onAddSpace,
    onUpdateSpace,
    onRemoveSpace,
    onAddTask,
    onRemoveTask,
    onUpdateTask,
  }
}
