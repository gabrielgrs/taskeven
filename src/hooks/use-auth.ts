'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { useQuery } from '@tanstack/react-query'

export function useAuth() {
	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			const [data, err] = await getAuthenticatedUser()
			if (err) return null
			return data
		},
	})

	return {
		user,
		isLoading,
		refetch,
	}
}
