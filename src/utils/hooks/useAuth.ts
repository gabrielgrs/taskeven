'use client'

import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedUser } from '~/actions/auth'
import { UserSchema } from '~/lib/mongoose'

export default function useAuth() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: () => getAuthenticatedUser(),
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const onUpdateUser = useCallback(
    (user: Partial<UserSchema>) => {
      refetch()
      return user
    },
    [refetch],
  )

  const onLogin = useCallback(
    (user: Partial<UserSchema>) => {
      refetch()
      return user
    },
    [refetch],
  )

  const onUpdateCredits = useCallback(
    (credits: number, type: 'increase' | 'decrease') => {
      refetch()
      return { credits, type }
    },
    [refetch],
  )

  return {
    user: data,
    isAuthenticated: Boolean(!error && data),
    isLoading,
    onUpdateCredits,
    onUpdateUser,
    onLogin,
  }
}
