'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSpacesContext } from '~/components/providers/Space'
import TasksUI from '~/components/Tasks'

export default function Tasks() {
  const { slug } = useParams()
  const { spaces } = useSpacesContext()
  const { push } = useRouter()

  const found = spaces.find((x) => x.slug === slug)

  if (!found) return push('/')

  return <TasksUI spaceId={found._id} spaceName={found.name} tasks={found.tasks} />
}
