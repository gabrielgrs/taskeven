'use client'

import { ReactNode, Suspense } from 'react'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { Skeleton } from '~/components/ui/skeleton'
import useAuth from '~/utils/hooks/useAuth'

export default function ListsAndTasksLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth()

  if (isLoading)
    return (
      <Grid>
        <Column size={12}>
          <Skeleton className="w-full h-14" />
        </Column>
        {Array.from({ length: 3 }).map((_, index) => (
          <Column size={12} key={index}>
            <Skeleton className="w-full h-24" />
          </Column>
        ))}
      </Grid>
    )

  return <Suspense>{children}</Suspense>
}
