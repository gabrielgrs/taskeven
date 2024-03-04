'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { sendErrorEmail } from '~/actions/email'
import { getUserListsWithTasksAndMembers, insertList, removeList, updateList } from '~/actions/list'
import { sendMemberInvite, updateMember } from '~/actions/member'
import { generateAnnotationWithAI, insertTask, removeTask, updateTask } from '~/actions/task'
import { ListSchema, TaskSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import { costs, getAnnotationsPrompt } from '~/utils/configurations'
import useAuth from '~/utils/hooks/useAuth'
import { getTasksCosts } from '~/utils/pricing'

export default function useLists(initialState: ListSchema[]) {
  const [lists, setLists] = useState<ListSchema[]>(initialState)
  const { onUpdateCredits } = useAuth()
  const { push } = useRouter()

  const onRefetch = useCallback(async () => {
    const data = await getUserListsWithTasksAndMembers()
    setLists(data)
  }, [])

  const onFallbackError = useCallback(
    (error: any) => {
      toast.error('Something went wrong. We will retrieve the data from the server.')
      sendErrorEmail(error?.toString?.())
      onRefetch()
    },
    [onRefetch],
  )

  const onAddList = useCallback(
    async (name: string) => {
      try {
        const createdList = await insertList(name)
        onUpdateCredits(costs.CREATE_LIST, 'decrease')
        setLists((p) => [...p, createdList])
        toast.success('List created!')
        push('/app')
        return Promise.resolve(createdList)
      } catch (error) {
        onFallbackError(error)
      }
    },
    [onFallbackError, onUpdateCredits, push],
  )

  const onUpdateList = useCallback(
    async (listId: string, list: Partial<ListSchema>) => {
      try {
        const updatedList = await updateList(listId, list)

        setLists((p) =>
          p.map((list) => {
            if (list._id !== listId) return list
            return { ...updatedList, members: list.members }
          }),
        )
        toast.success('List updated!')
        return Promise.resolve(updatedList)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError],
  )

  const onRemoveList = useCallback(
    async (listId: string) => {
      try {
        await removeList(listId)
        setLists((p) => p.filter((list) => list._id !== listId))
        // toast.success('List removed!')
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
    async (listId: string, values: Partial<TaskSchema>) => {
      try {
        const createdTask = await insertTask(listId!, values)

        const taskCosts = getTasksCosts(values)
        const creditsToDecrease = costs.CREATE_TASK + taskCosts

        onUpdateCredits(creditsToDecrease, 'decrease')
        setLists((p) =>
          p.map((list) => {
            if (list._id !== listId) return list
            return { ...list, tasks: [...list.tasks, createdTask] }
          }),
        )

        // toast.success('Task addedd!')

        return Promise.resolve(createdTask)
      } catch (error) {
        onFallbackError(error)
        return Promise.reject(error)
      }
    },
    [onFallbackError, onUpdateCredits],
  )

  const onRemoveTask = useCallback(
    async (listId: string, taskId: string) => {
      try {
        await removeTask(listId, taskId)
        setLists((p) =>
          p.map((list) => {
            if (list._id !== listId) return list
            return { ...list, tasks: list.tasks.filter((t) => t._id !== taskId) }
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
    async (listId: string, taskId: string, values: Partial<TaskSchema>) => {
      try {
        const costs = getTasksCosts(values)
        onUpdateCredits(costs, 'decrease')

        const updatedTask = await updateTask(listId, taskId, values)

        setLists((p) =>
          p.map((list) => {
            if (list._id !== listId) return list
            return {
              ...list,
              tasks: list.tasks.map((task) => {
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
    [onFallbackError, onUpdateCredits],
  )

  const onAddMember = useCallback(
    async (listId: string, email: string) => {
      try {
        const createdMember = await sendMemberInvite(listId, email, 'VIEW')
        onUpdateCredits(costs.INVITE_MEMBER, 'decrease')

        setLists((p) =>
          p.map((list) => {
            if (list._id !== listId) return list
            return { ...list, members: [...list.members, createdMember] }
          }),
        )
      } catch (error) {
        onFallbackError(error)
      }
    },
    [onFallbackError, onUpdateCredits],
  )

  const onUpdateMember = useCallback(
    async (listId: string, memberId: string, permission: Permission) => {
      try {
        await updateMember(listId, memberId, { permission })
        setLists((p) =>
          p.map((list) => {
            if (list._id !== listId) return list
            const updatedMembers = list.members.map((member) => {
              if (String(member.user._id) !== memberId) return member
              return { ...member, permission }
            })
            return { ...list, members: updatedMembers }
          }),
        )
      } catch (error) {
        onFallbackError(error)
      }
    },
    [onFallbackError],
  )

  const onGenerateAnnotationSuggestion = useCallback(
    async (listName: string, text: string, taskNames: string[]) => {
      try {
        const response = await generateAnnotationWithAI(getAnnotationsPrompt(listName, text, taskNames))
        if (!response) throw Error('Empty response')
        onUpdateCredits(costs.GENERATE_ANNOTATION_WITH_AI, 'decrease')
        return Promise.resolve(response)
      } catch (error) {
        onFallbackError(error)
      }
    },
    [onFallbackError, onUpdateCredits],
  )

  return {
    lists,
    onAddList,
    onUpdateList,
    onRemoveList,
    onAddTask,
    onRemoveTask,
    onUpdateTask,
    onAddMember,
    onUpdateMember,
    onGenerateAnnotationSuggestion,
  }
}
