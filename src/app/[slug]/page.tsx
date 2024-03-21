'use client'

import SpacesAndTasksUI from '~/components/SpacesAndTasks'
import { Skeleton } from '~/components/ui/skeleton'
import useSpaces from '~/utils/hooks/useSpaces'

export default function Home() {
  const { isLoading, currentSpace } = useSpaces()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    )
  }

  if (!currentSpace) throw Error('Invalid')

  return (
    <SpacesAndTasksUI
      isPaid={currentSpace.isPaid}
      tasks={currentSpace.tasks}
      spaceId={currentSpace._id}
      spaceName={currentSpace.name}
    />
  )
}
