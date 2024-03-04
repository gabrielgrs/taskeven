'use client'

import { useParams, useRouter } from 'next/navigation'
import { useListsContext } from '~/components/providers/List'
import TasksUI from '~/components/Tasks'
import { MemberSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import useAuth from '~/utils/hooks/useAuth'

const getPermission = (userId: string, createdBy: string, members: MemberSchema[]): Permission => {
  if (userId === createdBy) return 'EDIT'
  return members.find((x) => x.user._id === userId)?.permission || 'VIEW'
}

export default function Tasks() {
  const { slug } = useParams()
  const { user } = useAuth()
  const { lists } = useListsContext()
  const { push } = useRouter()

  const found = lists.find((x) => x.slug === slug)

  // TODO: redirect if was not deleted
  if (!found) return push('/app')

  // TODO: improve
  if (!user) return null
  const permission = getPermission(user._id, String(found.createdBy), found.members)

  return <TasksUI list={found} permission={permission} />
}
