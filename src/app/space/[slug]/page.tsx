'use client'

import { useParams } from 'next/navigation'
import SpacesAndTasksUI from '~/components/SpacesAndTasks'
import { Skeleton } from '~/components/ui/skeleton'
import useAuth from '~/utils/hooks/useAuth'
import useSpaces from '~/utils/hooks/useSpaces'

export default function Tasks() {
  const { slug } = useParams()
  const { spaces, isLoading } = useSpaces()
  const { user } = useAuth()

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
    <SpacesAndTasksUI
      spaceId={found._id}
      spaceName={found.name}
      tasks={found.tasks}
      isOwner={user?._id === found.createdBy}
    />
  )
}
