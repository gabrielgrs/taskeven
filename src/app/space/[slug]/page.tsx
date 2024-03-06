'use client'

import { useParams } from 'next/navigation'
import Spaces from '~/components/Spaces'
import TasksUI from '~/components/Tasks'
import { Skeleton } from '~/components/ui/skeleton'
import useSpaces from '~/utils/hooks/useSpaces'

export default function Tasks() {
  const { slug } = useParams()
  const { spaces, isLoading } = useSpaces()

  const found = spaces.find((x) => x.slug === slug)

  if (isLoading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    )

  if (!found) return <h1 className="text-center">Space not found</h1>

  return (
    <div>
      <Spaces spaces={spaces} />
      <TasksUI spaceId={found._id} spaceName={found.name} tasks={found.tasks} />
    </div>
  )
}
