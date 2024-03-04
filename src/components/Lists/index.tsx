'use client'

import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useListsContext } from '~/components/providers/List'
import Title from '~/components/shared/Title'
import { Button } from '~/components/ui/button'
import { MemberSchema, TaskSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import useAuth from '~/utils/hooks/useAuth'
import ListCard from './ListCard'
import ListForm from './ListForm'

const getPercentage = (tasks: TaskSchema[]) => {
  if (tasks.length === 0) return 0
  const completed = tasks.filter((x) => x.completed)
  return Math.round((completed.length / tasks.length) * 100)
}

const getPermission = (userId: string, createdBy: string, members: MemberSchema[]): Permission => {
  if (userId === createdBy) return 'EDIT'
  return members.find((x) => x.user._id === userId)?.permission || 'VIEW'
}

export default function ListsUI() {
  const { lists } = useListsContext()
  const { user } = useAuth()

  const { userLists, sharedLists } = useMemo(() => {
    const compoundLists = lists.map((item) => ({
      ...item,
      permission: getPermission(user?._id!, String(item.createdBy), item.members),
    }))
    const userLists = compoundLists.filter((list) => String(list.createdBy) === user?._id)
    const ids = userLists.map((x) => x._id)
    const sharedLists = compoundLists.filter((list) => !ids.includes(list._id))

    return {
      userLists,
      sharedLists,
    }
  }, [lists, user])

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Title variant="accent" className="text-xl md:text-3xl">
          Clear mind better focus
        </Title>

        <ListForm>
          <Button size="sm" variant="link" aria-label="Create list button" className="h-6 text-end w-max">
            Create list <Plus size={16} />
          </Button>
        </ListForm>
      </div>

      <AnimatePresence>
        <div>
          {userLists.length > 0 && <label className="opacity-60">My lists</label>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userLists.map((list) => {
              return (
                <ListCard
                  key={list._id}
                  listId={list._id}
                  slug={list.slug}
                  name={list.name}
                  tasksQuantity={list.tasks.length}
                  percentage={getPercentage(list.tasks)}
                  permission={list.permission}
                  members={list.members || []}
                />
              )
            })}
          </div>
        </div>

        <div>
          {sharedLists.length > 0 && <label className="opacity-60">Shared lists</label>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sharedLists.map((list) => {
              return (
                <ListCard
                  key={list._id}
                  listId={list._id}
                  slug={list.slug}
                  name={list.name}
                  members={list.members || []}
                  tasksQuantity={list.tasks.length}
                  percentage={getPercentage(list.tasks)}
                  permission={list.permission}
                />
              )
            })}
          </div>
        </div>
      </AnimatePresence>
    </>
  )
}
