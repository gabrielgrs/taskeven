'use client'

import { getAuthenticatedUser } from '@/actions/auth'
import { sortTasks } from '@/utils/sort'
import { useQuery } from '@tanstack/react-query'

export function useAuth() {
	const { data: user, refetch } = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			const [data, err] = await getAuthenticatedUser()
			if (err) return null
			const sortedTasks = sortTasks(data.tasks)
			return {
				...data,
				tasks: sortedTasks,
			}
		},
	})

	return {
		user,
		refetch,
	}
}
