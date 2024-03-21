'use client'

import { redirect } from 'next/navigation'
import { Skeleton } from '~/components/ui/skeleton'
import useSpaces from '~/utils/hooks/useSpaces'

export default function Home() {
  const { isLoading, spaces = [] } = useSpaces()

  if (isLoading) {
    if (spaces.length === 0) {
      return (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
      )
    }
  }

  const [space] = spaces

  return redirect(space.slug)
}
